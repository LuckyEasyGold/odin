import express from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { renderDocument } from "@odin/engine";
import { ModelRepository, GenerationRepository } from "@odin/storage";

const app = express();
const PORT = process.env.API_PORT || 3001;
const prisma = new PrismaClient();

// Repositories
const modelRepo = new ModelRepository(prisma);
const genRepo = new GenerationRepository(prisma);

app.use(express.json());

// CORS simple
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/api/v1/models", async (_req: Request, res: Response) => {
  try {
    const models = await modelRepo.findAll();
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

app.get("/api/v1/models/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
  const { modelId, inputs, format = "html" } = req.body;

  try {
    let model = await modelRepo.findById(modelId);
    if (!model) model = await modelRepo.findBySlug(modelId);
    
    if (!model) return res.status(404).json({ error: "Model not found" });

    const result = await renderDocument(model.template, inputs || {}, { format });
    
    const generation = await genRepo.create({
      modelId: model.id,
      inputs: inputs || {},
      outputHtml: format === "html" ? (result as string) : undefined,
    });

    if (format === "pdf") {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=documento-${generation.id}.pdf`);
      return res.send(result);
    }

    res.json({ 
      generationId: generation.id, 
      html: format === "html" ? result : undefined,
      message: "Document generated" 
    });
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({ error: "Generation failed" });
  }
});

app.get("/api/v1/generations/:id/download", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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

app.post("/api/v1/models/:id/fork", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
      { name: "listModels", description: "List all document models", params: [] },
      { name: "getModel", description: "Get model by ID or Slug", params: ["id: string"] },
      { name: "generateDocument", description: "Generate document from model", params: ["modelId", "inputs", "options?"] },
    ]
  });
});

const server = app.listen(PORT, () => {
  console.log(`ODIN API running on port ${PORT}`);
});

export { app, server };
export default app;