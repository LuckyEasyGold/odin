import Handlebars from "handlebars";
import puppeteer from "puppeteer";
import type { DocumentTemplate, RenderOptions } from "@odin/core";
import crypto from "crypto";

export async function renderDocument(
  template: string,
  data: Record<string, unknown>,
  options?: RenderOptions
): Promise<{ content: Buffer | string; hash?: string }> {
  const compiled = Handlebars.compile(template);
  const html = compiled(data);

  if (options?.format === "html") {
    return { content: html };
  }

  if (options?.format === "json") {
    return { content: JSON.stringify({ html, data }) };
  }

  let browser;
  
  if (process.env.VERCEL) {
    const chromium = require("@sparticuz/chromium");
    const puppeteerCore = require("puppeteer-core");
    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    browser = await puppeteer.launch({
      headless: true,
    });
  }

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    
    // Calculate SHA-256 hash (Document DNA)
    const hash = crypto.createHash("sha256").update(pdf).digest("hex");
    
    return { content: pdf as Buffer, hash };
  } finally {
    if (browser) await browser.close();
  }
}

export async function renderFromTemplate(
  docTemplate: DocumentTemplate,
  data: Record<string, unknown>
): Promise<{ content: Buffer; hash: string }> {
  const result = await renderDocument(docTemplate.template, data, { format: "pdf" });
  if (typeof result.content === "string") {
    throw new Error("Expected Buffer from PDF render");
  }
  return { content: result.content, hash: result.hash! };
}

export * from "./signatures";