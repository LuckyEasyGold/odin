import express from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { renderDocument, DocumensoProvider } from "@odin/engine";
import * as dotenv from "dotenv";
import path from "path";
import crypto from "crypto";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
import { ModelRepository, GenerationRepository, RatingRepository } from "@odin/storage";
import { dispatchWebhook } from "./lib/webhooks";
import { handleDocumensoWebhook } from "./webhooks/documenso";

const app = express();
const PORT = process.env.API_PORT || 3001;
const prisma = new PrismaClient();

// Repositories
const modelRepo = new ModelRepository(prisma);
const genRepo = new GenerationRepository(prisma);
const ratingRepo = new RatingRepository(prisma);

app.use(express.json());

// Auth Middleware for API Keys
async function authenticateApiKey(req: Request, res: Response, next: Function) {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    return next(); // Continue, some routes might not need it or will fail later
  }

  try {
    const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex");
    const keyData = await prisma.apiKey.findFirst({
      where: { keyHash, isActive: true },
      include: { user: true }
    });

    if (!keyData) {
      return res.status(401).json({ error: "Invalid API Key" });
    }

    // Attach user to request
    (req as any).user = keyData.user;
    
    // Update last used
    await prisma.apiKey.update({
      where: { id: keyData.id },
      data: { lastUsedAt: new Date() }
    });

    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication error" });
  }
}

// CORS simple
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-api-key");
  next();
});

app.use(authenticateApiKey);

app.get("/", (_req: Request, res: Response) => {
  res.json({ 
    name: "ODIN API", 
    version: "1.0.0", 
    status: "online",
    message: "Bem-vindo à infraestrutura de documentos ODIN. Use /api/v1 para endpoints." 
  });
});

app.get("/api/v1/me", async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  // Refresh user data from DB to get latest balance
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  });

  if (!dbUser) return res.status(404).json({ error: "User not found" });

  res.json({
    id: dbUser.id,
    username: dbUser.username,
    email: dbUser.email,
    fullName: dbUser.fullName,
    balance: Number(dbUser.balance),
    isSpecialist: dbUser.isSpecialist,
    specialty: dbUser.specialty
  });
});

app.get("/api/v1", (_req: Request, res: Response) => {
  res.json({
    version: "v1",
    endpoints: [
      "/api/v1/me",
      "/api/v1/models",
      "/api/v1/models/:id",
      "/api/v1/generate",
      "/api/v1/mcp/tools"
    ]
  });
});

app.get("/api/v1/models", async (_req: Request, res: Response) => {
  try {
    const models = await modelRepo.findAll();
    res.json(models);
  } catch (error) {
    console.error("Fetch models error:", error);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

app.get("/api/v1/models/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    let model = await modelRepo.findById(id);
    if (!model) {
      model = await modelRepo.findBySlug(id);
    }

    if (!model) return res.status(404).json({ error: "Model not found" });
    res.json(model);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch model" });
  }
});

app.post("/api/v1/models", async (req: Request, res: Response) => {
  try {
    const model = await modelRepo.create(req.body);
    res.status(201).json(model);
  } catch (error) {
    res.status(400).json({ error: "Invalid model data" });
  }
});

app.post("/api/v1/generate", async (req: Request, res: Response) => {
  const { modelId, inputs, format = "html", userId: bodyUserId, signers } = req.body;
  const user = (req as any).user; // From API Key
  const activeUserId = user?.id || bodyUserId;

  try {
    let model = await modelRepo.findById(modelId);
    if (!model) model = await modelRepo.findBySlug(modelId);
    
    if (!model) return res.status(404).json({ error: "Model not found" });

    // Marketplace Logic
    const price = Number(model.price || 0);
    if (price > 0) {
      if (!activeUserId) {
        return res.status(401).json({ error: "Paid models require authentication" });
      }

      // Check balance (if user from API key, we have it, otherwise fetch)
      const currentUser = user || await prisma.user.findUnique({ where: { id: activeUserId } });
      if (!currentUser || Number(currentUser.balance) < price) {
        return res.status(402).json({ error: "Insufficient balance", price });
      }

      // ATOMIC TRANSACTION: Pay author, Pay platform, Deduct from user
      const authorShare = price * 0.8;

      await prisma.$transaction([
        // Deduct from buyer
        prisma.user.update({ 
          where: { id: activeUserId }, 
          data: { balance: { decrement: price } } 
        }),
        // Add to author
        prisma.user.update({ 
          where: { id: model.createdBy }, 
          data: { balance: { increment: authorShare } } 
        }),
        // Record transactions
        prisma.transaction.create({
          data: {
            userId: activeUserId,
            type: "PURCHASE",
            amount: -price,
            description: `Compra do modelo: ${model.name}`
          }
        }),
        prisma.transaction.create({
          data: {
            userId: model.createdBy,
            type: "EARNING",
            amount: authorShare,
            description: `Venda do modelo: ${model.name}`
          }
        })
      ]);
    }

    const result = await renderDocument(model.template, inputs || {}, { format });
    
    // Generate document hash (DNA)
    const contentToHash = format === "html" ? (result as string) : JSON.stringify(inputs);
    const documentHash = crypto.createHash("sha256").update(contentToHash).digest("hex");

    const generation = await genRepo.create({
      modelId: model.id,
      userId: activeUserId,
      inputs: inputs || {},
      outputHtml: format === "html" ? (result as string) : undefined,
      documentHash,
      status: signers?.length > 0 ? "PENDING_SIGNATURE" : "COMPLETED",
      signatureStatus: signers?.length > 0 ? "PENDING" : undefined,
      signers: signers
    });

    // If signers are provided and we have a PDF, initiate electronic signature
    if (signers?.length > 0 && (format === "pdf" || format === "html")) {
      try {
        const apiKey = process.env.DOCUMENSO_API_KEY;
        if (apiKey) {
          const provider = new DocumensoProvider(apiKey);
          // If we only have HTML, we need to render PDF first for Documenso
          const pdfBuffer = format === "pdf" 
            ? (result as Buffer) 
            : await renderDocument(model.template, inputs || {}, { format: "pdf" }) as Buffer;

          const signatureResponse = await provider.createDocument({
            title: `${model.name} - ${generation.id}`,
            file: pdfBuffer,
            recipients: signers
          });

          await prisma.generation.update({
            where: { id: generation.id },
            data: { 
              externalSignatureId: signatureResponse.externalId,
              signatureStatus: "SENT"
            }
          });
        }
      } catch (sigError) {
        console.error("Signature initiation failed:", sigError);
      }
    }

    if (format === "pdf" && (!signers || signers.length === 0)) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=documento-${generation.id}.pdf`);
      return res.send(result);
    }

    res.json({ 
      generationId: generation.id, 
      html: format === "html" ? result : undefined,
      externalSignatureId: (generation as any).externalSignatureId,
      message: signers?.length > 0 ? "Document generated and sent for signature" : "Document generated" 
    });
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({ error: "Generation failed" });
  }
});

app.get("/api/v1/generations/:id/download", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const generation = await genRepo.findById(id);
    if (!generation) return res.status(404).json({ error: "Generation not found" });

    const model = await modelRepo.findById(generation.modelId);
    if (!model) return res.status(404).json({ error: "Model not found" });

    // Re-render as PDF for download
    const pdf = await renderDocument(model.template, generation.inputs as any, { format: "pdf" });
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=documento-${id}.pdf`);
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ error: "Download failed" });
  }
});

app.post("/api/v1/models/:id/ratings", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { userId, rating, comment } = req.body;

    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const newRating = await ratingRepo.create({
      modelId: id,
      userId,
      rating,
      comment
    });

    // Sync average rating in Model
    await modelRepo.recalculateRating(id);

    res.status(201).json(newRating);
  } catch (error) {
    res.status(400).json({ error: "Failed to submit rating" });
  }
});

app.get("/api/v1/models/:id/ratings", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const ratings = await ratingRepo.findByModelId(id);
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
});

app.post("/api/v1/models/:id/fork", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { slug } = req.body;
    const forked = await modelRepo.fork(id, slug || `${id}-fork`);
    res.status(201).json(forked);
  } catch (error) {
    res.status(400).json({ error: "Fork failed" });
  }
});

app.get("/api/v1/mcp/tools", (_req: Request, res: Response) => {
  res.json({
    tools: [
      { 
        name: "odin_list_models", 
        description: "Lista todos os modelos de documentos disponíveis no ODIN", 
        parameters: { type: "object", properties: {} } 
      },
      { 
        name: "odin_get_model", 
        description: "Obtém detalhes completos de um modelo específico pelo slug ou ID", 
        parameters: { 
          type: "object", 
          properties: { 
            id: { type: "string", description: "Slug ou UUID do modelo" } 
          },
          required: ["id"]
        } 
      },
      { 
        name: "odin_generate_document", 
        description: "Gera um novo documento a partir de um modelo e entradas de dados", 
        parameters: { 
          type: "object", 
          properties: { 
            modelId: { type: "string", description: "Slug ou ID do modelo" },
            inputs: { type: "object", description: "Dados para preenchimento das variáveis do modelo" },
            format: { type: "string", enum: ["html", "pdf"], default: "html" }
          },
          required: ["modelId", "inputs"]
        } 
      },
    ]
  });
});

app.post("/api/v1/generations/:id/sign", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const ipAddress = req.ip || req.headers["x-forwarded-for"] || "unknown";

  try {
    const generation = await genRepo.findById(id);
    if (!generation) return res.status(404).json({ error: "Document not found" });

    if ((generation as any).status === "SIGNED") {
      return res.status(400).json({ error: "Document already signed" });
    }

    const updated = await prisma.generation.update({
      where: { id },
      data: {
        status: "SIGNED",
        signedAt: new Date(),
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : (ipAddress as string),
      } as any
    });

    // Notify Webhooks
    if (updated.userId) {
      dispatchWebhook(updated.userId, "document.signed", {
        generationId: updated.id,
        modelId: updated.modelId,
        signedAt: (updated as any).signedAt,
        hash: updated.documentHash
      });
    }

    res.json({ 
      message: "Document signed successfully", 
      id: updated.id,
      signedAt: (updated as any).signedAt,
      hash: updated.documentHash
    });
  } catch (error) {
    console.error("Signing error:", error);
    res.status(500).json({ error: "Failed to sign document" });
  }
});

// Signature Webhooks
app.post("/webhooks/documenso", handleDocumensoWebhook);

app.listen(PORT, () => {
  console.log(`ODIN API running on port ${PORT}`);
});

export { app };
export default app;