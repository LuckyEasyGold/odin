import Handlebars from "handlebars";
import puppeteer from "puppeteer";
import type { DocumentTemplate, RenderOptions } from "@odin/core";

export async function renderDocument(
  template: string,
  data: Record<string, unknown>,
  options?: RenderOptions
): Promise<Buffer | string> {
  const compiled = Handlebars.compile(template);
  const html = compiled(data);

  if (options?.format === "html") {
    return html;
  }

  if (options?.format === "json") {
    return JSON.stringify({ html, data });
  }

  const browser = await puppeteer.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    return pdf;
  } finally {
    await browser.close();
  }
}

export async function renderFromTemplate(
  docTemplate: DocumentTemplate,
  data: Record<string, unknown>
): Promise<Buffer> {
  const result = await renderDocument(docTemplate.template, data, { format: "pdf" });
  if (typeof result === "string") {
    throw new Error("Expected Buffer from PDF render");
  }
  return result;
}

export * from "./signatures";