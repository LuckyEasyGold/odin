import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";
import type { DocumentTemplate } from "@odin/core";
import { renderDocument } from "@odin/engine";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");

export const documentQueue = new Queue("documents", { connection });

export const documentWorker = new Worker(
  "documents",
  async (job) => {
    const { template, data, options } = job.data as {
      template: DocumentTemplate;
      data: Record<string, unknown>;
      options?: { format?: "html" | "pdf" };
    };

    console.log(`Processing document for job ${job.id}`);

    const result = await renderDocument(
      template.template,
      data,
      options || { format: "pdf" }
    );

    return { success: true, result: Buffer.isBuffer(result) ? result.toString("base64") : result };
  },
  { connection }
);

documentWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

documentWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

export async function queueDocument(
  template: DocumentTemplate,
  data: Record<string, unknown>,
  options?: { format?: "html" | "pdf" }
) {
  return documentQueue.add("render", { template, data, options });
}

export default documentWorker;