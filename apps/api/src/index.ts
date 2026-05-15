import express from "express";
import type { Request, Response, Express } from "express";
import { PrismaClient } from "@prisma/client";
import { renderDocument, DocumensoProvider } from "@odin/engine";
import * as dotenv from "dotenv";
import path from "path";
import { emailService } from "./services/email";
import crypto from "crypto";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
import { ModelRepository, GenerationRepository, RatingRepository } from "@odin/storage";
import { dispatchWebhook } from "./lib/webhooks";
import { handleDocumensoWebhook } from "./webhooks/documenso";

const app: Express = express();
const PORT = process.env.API_PORT || 3001;
const prisma = new PrismaClient();

// Repositories
const modelRepo = new ModelRepository(prisma);
const genRepo = new GenerationRepository(prisma);
const ratingRepo = new RatingRepository(prisma);

app.use(express.json());

// Debug route to see what path Express receives
app.use((req, _res, next) => {
  console.log(`[DEBUG] Request Path: ${req.path}, URL: ${req.url}`);
  next();
});

// Auth Middleware for API Keys
async function authenticateApiKey(req: Request, res: Response, next: Function) {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    return next();
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

    (req as any).user = keyData.user;

    await prisma.apiKey.update({
      where: { id: keyData.id },
      data: { lastUsedAt: new Date() }
    });

    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication error", details: (error as Error).message });
  }
}

// Trust proxy for Vercel
app.set("trust proxy", true);

// Rate limiting simple (memory store)
const rateLimitWindow = 60000;
const rateLimitMax = 100;
const rateLimitMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string | undefined): boolean {
  const key = ip || "unknown";
  const now = Date.now();
  const record = rateLimitMap.get(key);
  if (!record || now > record.reset) {
    rateLimitMap.set(key, { count: 1, reset: now + rateLimitWindow });
    return true;
  }
  if (record.count >= rateLimitMax) {
    return false;
  }
  record.count++;
  return true;
}

// Debug route to see what path Express receives
app.use((req, _res, next) => {
  console.log(`[DEBUG] Request Path: ${req.path}, URL: ${req.url}`);
  next();
});

// Rate limiting + CORS — check rate limit FIRST
app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] as string || req.socket?.remoteAddress;
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Too many requests, try again later" });
  }
  next();
});

// CORS simple
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.NODE_ENV === "production" ? FRONTEND_URL : "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-api-key, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.NODE_ENV === "production" ? FRONTEND_URL : "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-api-key, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
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

const apiRouter = express.Router();

apiRouter.get("/me", async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

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

apiRouter.get("/", (_req: Request, res: Response) => {
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

apiRouter.get("/models", async (_req: Request, res: Response) => {
  try {
    const models = await modelRepo.findAll();
    res.json(models);
  } catch (error) {
    console.error("Fetch models error:", error);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

apiRouter.get("/models/:id/ratings", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    console.log("Fetching ratings for model:", id);
    const ratings = await ratingRepo.findByModelId(id);
    res.json(ratings);
  } catch (error) {
    console.error("Fetch ratings error:", error);
    res.status(500).json({ error: "Failed to fetch ratings", details: (error as Error).message });
  }
});

apiRouter.post("/models/:id/ratings", async (req: Request, res: Response) => {
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
    await modelRepo.recalculateRating(id);
    res.status(201).json(newRating);
  } catch (error) {
    res.status(400).json({ error: "Failed to submit rating", details: (error as Error).message });
  }
});

apiRouter.post("/models/:id/fork", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { slug } = req.body;
    const forked = await modelRepo.fork(id, slug || `${id}-fork`);
    res.status(201).json(forked);
  } catch (error) {
    res.status(400).json({ error: "Fork failed" });
  }
});

apiRouter.get("/models/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    let model = await modelRepo.findById(id);
    if (!model) {
      model = await modelRepo.findBySlug(id);
    }

    if (!model) return res.status(404).json({ error: "Model not found" });
    res.json(model);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch model", details: (error as Error).message });
  }
});

apiRouter.post("/models", async (req: Request, res: Response) => {
  try {
    const model = await modelRepo.create(req.body);
    res.status(201).json(model);
  } catch (error) {
    res.status(400).json({ error: "Invalid model data" });
  }
});

apiRouter.post("/generate", async (req: Request, res: Response) => {
  const { modelId, inputs, format = "html", userId: bodyUserId, signers } = req.body;
  console.log("Generate request:", { modelId, format, hasSigners: !!signers?.length });
  const user = (req as any).user;
  const activeUserId = user?.id || bodyUserId;

  try {
    let model = await modelRepo.findById(modelId);
    if (!model) {
      console.log("Model not found by ID, trying slug:", modelId);
      model = await modelRepo.findBySlug(modelId);
    }

    if (!model) return res.status(404).json({ error: "Model not found" });

    // Marketplace Logic
    const price = Number(model.price || 0);
    if (price > 0) {
      if (!activeUserId) {
        return res.status(401).json({ error: "Paid models require authentication" });
      }

      const currentUser = user || await prisma.user.findUnique({ where: { id: activeUserId } });
      if (!currentUser || Number(currentUser.balance) < price) {
        return res.status(402).json({ error: "Insufficient balance", price });
      }

      const authorShare = price * 0.8;
      await prisma.$transaction([
        prisma.user.update({
          where: { id: activeUserId },
          data: { balance: { decrement: price } }
        }),
        prisma.user.update({
          where: { id: model.createdBy },
          data: { balance: { increment: authorShare } }
        }),
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

    const webUrl = process.env.NEXT_PUBLIC_WEB_URL || `${req.protocol}://${req.get('host')}`;
    const apiUrl = process.env.API_URL || webUrl;
    const tempGenId = crypto.randomUUID();
    const verificationUrl = `${apiUrl}/api/v1/verify/${tempGenId}`;

    const renderResult = await renderDocument(model.template, inputs || {}, {
      format,
      verificationUrl,
      documentId: tempGenId,
      signers
    });
    const result = renderResult.content;
    const documentHash = renderResult.hash || crypto.createHash("sha256").update(result as string).digest("hex");

    const generation = await genRepo.create({
      id: tempGenId,
      modelId: model.id,
      userId: activeUserId,
      inputs: inputs || {},
      outputHtml: format === "html" ? (result as string) : undefined,
      documentHash,
      status: signers?.length > 0 ? "PENDING_SIGNATURE" : "COMPLETED",
      signatureStatus: signers?.length > 0 ? "PENDING" : undefined,
      signers: signers
    } as any);

    const signatureUrl = `${webUrl}/sign/${generation.id}`;

    if (signers && signers.length > 0) {
      for (const signer of signers) {
        await emailService.sendSignatureRequest(
          signer.email,
          signer.name,
          model.name,
          signatureUrl
        );
      }
    }

    if (signers?.length > 0 && (format === "pdf" || format === "html")) {
      try {
        const apiKey = process.env.DOCUMENSO_API_KEY;
        if (apiKey) {
          const provider = new DocumensoProvider(apiKey);
          const pdfBuffer = format === "pdf"
            ? (result as Buffer)
            : (await renderDocument(model.template, inputs || {}, { format: "pdf" })).content as Buffer;

          const signatureResponse = await provider.createDocument({
            title: `${model.name} - ${tempGenId}`,
            file: pdfBuffer,
            recipients: signers
          });

          await prisma.generation.update({
            where: { id: tempGenId },
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
      res.setHeader("Content-Disposition", `attachment; filename=documento-${tempGenId}.pdf`);
      return res.send(result);
    }

    res.json({
      generationId: tempGenId,
      html: format === "html" ? result : undefined,
      externalSignatureId: (generation as any).externalSignatureId,
      signatureUrl: `${webUrl}/sign/${tempGenId}`,
      message: signers?.length > 0 ? "Document generated and ready for signature" : "Document generated"
    });
  } catch (error) {
    console.error("FULL GENERATION ERROR:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      error: "Generation failed",
      message: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? (error as Error)?.stack : undefined
    });
  }
});

apiRouter.get("/generations/:id/download", async (req: Request, res: Response) => {
   try {
     const id = req.params.id as string;
     const generation = await genRepo.findById(id);
     if (!generation) return res.status(404).json({ error: "Generation not found" });

     const model = await modelRepo.findById(generation.modelId);
if (!model) return res.status(404).json({ error: "Model not found" });

      // Build verification URL for QR code in PDF
      const webUrl = process.env.NEXT_PUBLIC_WEB_URL || `${req.protocol}://${req.get('host')}`;
      const apiUrl = process.env.API_URL || webUrl;
      const verificationUrl = `${apiUrl}/api/v1/verify/${id}`;

      const { content } = await renderDocument(model.template, generation.inputs as any, {
        format: "pdf",
        verificationUrl,
        documentId: id,
        signers: generation.signers
      });

     res.setHeader("Content-Type", "application/pdf");
     res.setHeader("Content-Disposition", `attachment; filename=documento-${id}.pdf`);
     res.send(content);
   } catch (error) {
     res.status(500).json({ error: "Download failed" });
   }
 });

apiRouter.get("/mcp/tools", (_req: Request, res: Response) => {
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

apiRouter.post("/generations/:id/sign", async (req: Request, res: Response) => {
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

// Public verification endpoint
apiRouter.get("/verify/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;

    const generation = await prisma.generation.findUnique({
      where: { id: idStr },
      include: { model: { select: { name: true, version: true } } }
    });

    if (!generation) {
      return res.status(404).json({ error: "Document not found" });
    }

    const generationSigners = await prisma.signer.findMany({ where: { generationId: idStr } });

    res.json({
      valid: true,
      documentId: generation.id,
      modelName: generation.model?.name,
      modelVersion: generation.model?.version,
      hash: generation.documentHash,
      createdAt: generation.createdAt,
      signers: generationSigners
    });
  } catch (error) {
    res.status(500).json({ error: "Verification failed", details: (error as Error).message });
  }
});

// Native signing endpoint
apiRouter.post("/generations/:id/sign-native", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { email, signatureData } = req.body;

    const generation = await prisma.generation.findUnique({
      where: { id },
      include: { signers: true }
    });

    if (!generation) {
      return res.status(404).json({ error: "Document not found" });
    }

    const signer = generation.signers.find((s: any) => s.email === email);
    if (!signer) {
      return res.status(403).json({ error: "Signer not authorized for this document" });
    }

    if (signer.status === "SIGNED") {
      return res.status(400).json({ error: "Document already signed by this user" });
    }

    await prisma.signer.update({
      where: { id: signer.id },
      data: {
        status: "SIGNED",
        signedAt: new Date(),
        signatureId: signatureData
      }
    });

    const allSigners = await prisma.signer.findMany({ where: { generationId: id } });
    const allSigned = allSigners.every((s: any) => s.status === "SIGNED");

    if (allSigned) {
      await prisma.generation.update({
        where: { id },
        data: {
          status: "SIGNED",
          signatureStatus: "COMPLETED",
          signedAt: new Date()
        }
      });
    }

    res.json({ success: true, message: "Document signed successfully" });
  } catch (error) {
    console.error("Signing error:", error);
    res.status(500).json({ error: "Signing failed", details: (error as Error).message });
  }
});

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Mount the router at both /api/v1 and root / for resilience
app.use("/api/v1", apiRouter);
app.use("/", apiRouter);

// Specific routes for root-level or legacy support
app.post("/webhooks/documenso", handleDocumensoWebhook);

// Only listen when run directly (for local dev)
// Vercel handles the server binding in production
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ODIN API running on port ${PORT}`);
  });
}

export { app };
export default app;