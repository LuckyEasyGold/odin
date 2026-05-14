import Handlebars from "handlebars";
import puppeteer from "puppeteer";
import type { DocumentTemplate, RenderOptions } from "@odin/core";
import crypto from "crypto";
import QRCode from "qrcode";

export async function generateVerificationQRCode(url: string): Promise<string> {
  return QRCode.toDataURL(url);
}

export interface ExtendedRenderOptions extends RenderOptions {
  verificationUrl?: string;
  documentId?: string;
  documentHash?: string;
}

export async function renderDocument(
  template: string,
  data: Record<string, unknown>,
  options?: ExtendedRenderOptions
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
    
    let footerTemplate = '';
    if (options?.verificationUrl) {
      const qrCode = await generateVerificationQRCode(options.verificationUrl);
      footerTemplate = `
        <div style="font-family: sans-serif; font-size: 8px; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 40px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${qrCode}" style="width: 40px; height: 40px;" />
            <div>
              <div style="font-weight: bold; color: #0f172a;">Selo de Autenticidade ODIN</div>
              <div>Validar em: ${options.verificationUrl}</div>
              <div style="font-size: 6px; opacity: 0.6;">Hash DNA: ${options.documentHash || 'calculando...'}</div>
            </div>
          </div>
          <div>Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>
        </div>
      `;
    }

    const pdf = await page.pdf({ 
      format: "A4", 
      printBackground: true,
      displayHeaderFooter: !!options?.verificationUrl,
      headerTemplate: '<div></div>',
      footerTemplate: footerTemplate || '<div></div>',
      margin: options?.verificationUrl 
        ? { top: '40px', bottom: '80px', left: '40px', right: '40px' } 
        : { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });
    
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