import Handlebars from "handlebars";
import puppeteer from "puppeteer";
import type { DocumentTemplate, RenderOptions } from "@odin/core";
import crypto from "crypto";
import QRCode from "qrcode";
import { registerOdinHelpers } from "./helpers";

// Register typed helpers ({{moeda}}, {{data}}, {{soma}}, ...) once at module load.
registerOdinHelpers();

export async function generateVerificationQRCode(url: string): Promise<string> {
  return QRCode.toDataURL(url);
}

export interface ExtendedRenderOptions extends RenderOptions {
  verificationUrl?: string;
  documentId?: string;
  documentHash?: string;
  signers?: Array<{ name: string; email: string; order?: number }>;
}

// Footer HTML com Selo de Autenticidade para injeção direta no conteúdo
async function buildVerificationFooter(
  verificationUrl: string,
  documentHash?: string,
  signers?: Array<{ name: string; email: string; order?: number }>
): Promise<string> {
  try {
    const qrCode = await generateVerificationQRCode(verificationUrl);
    const dateStr = new Date().toLocaleDateString("pt-BR");
    
    const signersInfo = signers && signers.length > 0
      ? `<div style="font-size: 8px; margin-top: 4px; padding-top: 4px; border-top: 1px solid #e2e8f0;">
          <span style="color: #0f172a; font-weight: 500;">Signatários:</span>
          ${signers.map(s => `<span style="display: block; margin-left: 8px;">${s.order || ""}. ${s.name} (${s.email})</span>`).join("")}
        </div>`
      : "";

    return `
      <div style="font-family: sans-serif; font-size: 10px; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 24px 40px; color: #64748b; border-top: 2px solid #e2e8f0; margin-top: 40px; page-break-inside: avoid;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${qrCode}" style="width: 48px; height: 48px; display: block;" />
          <div>
            <div style="font-weight: bold; color: #0f172a; font-size: 11px;">Selo de Autenticidade ODIN</div>
            <div style="font-size: 9px; margin-top: 2px;">Validar em: <a href="${verificationUrl}" style="color: #3b82f6; text-decoration: none;">${verificationUrl}</a></div>
            <div style="font-size: 8px; opacity: 0.6; margin-top: 2px;">Hash DNA (SHA-256): ${documentHash || "calculando..."}</div>
            ${signersInfo}
          </div>
        </div>
        <div style="font-size: 9px; white-space: nowrap;">Gerado em: ${dateStr}</div>
      </div>
    `;
  } catch (error) {
    console.error("QR Code generation failed:", error);
    return `
      <div style="font-family: sans-serif; font-size: 10px; width: 100%; padding: 20px 40px; color: #64748b; border-top: 2px solid #e2e8f0; margin-top: 40px; text-align: center;">
        Selo de Autenticidade ODIN | Validar em: ${verificationUrl}
      </div>
    `;
  }
}

export async function renderDocument(
  template: string,
  data: Record<string, unknown>,
  options?: ExtendedRenderOptions
): Promise<{ content: Buffer | string; hash?: string; degraded?: boolean }> {
  const compiled = Handlebars.compile(template);
  let html = compiled(data);

  // Build verification footer if URL is provided
  let verificationFooter = "";
  let documentHash = "";

  if (options?.verificationUrl) {
    documentHash = crypto.createHash("sha256").update(html).digest("hex");
    verificationFooter = await buildVerificationFooter(options.verificationUrl, documentHash, options.signers);

    // Inject footer into HTML content
    if (html.includes("</body>")) {
      html = html.replace("</body>", verificationFooter + "\n</body>");
    } else {
      html = html + "\n" + verificationFooter;
    }
  }

  // HTML format: return inline with footer
  if (options?.format === "html") {
    return { content: html, hash: documentHash || undefined };
  }

  // JSON format: return debug info
  if (options?.format === "json") {
    return { content: JSON.stringify({ html, data }), hash: documentHash || undefined };
  }

  // PDF format: render HTML (already contains footer) to PDF via Puppeteer
  let browser;

  try {
    if (process.env.VERCEL) {
      // Dynamic require for Vercel serverless — uses chromium-min which downloads
      // the binary from a remote URL at runtime (avoids the 50MB function size limit)
      let chromium, puppeteerCore;
      try {
        chromium = require("@sparticuz/chromium-min");
        puppeteerCore = require("puppeteer-core");
      } catch (e) {
        console.error("Failed to load chromium modules:", e);
        throw new Error("Chromium not available in this environment");
      }

      // The remote chromium tarball for v131 — matches puppeteer-core@22.x
      const executablePath = await chromium.executablePath(
        "https://github.com/Sparticuz/chromium/releases/download/v131.0.0/chromium-v131.0.0-pack.tar"
      );

      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
      });
    } else {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    const page = await browser.newPage();

    // Inject print styles for better PDF rendering
    const printStyles = `
      <style>
        @media print {
          body { margin: 0; padding: 0; }
          .verification-footer {
            display: block !important;
            position: relative;
            bottom: auto;
          }
        }
        @page {
          margin: 20mm 20mm 30mm 20mm;
        }
      </style>
    `;

    await page.setContent(printStyles + html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: "20mm",
        bottom: "30mm",
        left: "20mm",
        right: "20mm",
      },
    });

    // Final hash from PDF binary
    const pdfHash = crypto.createHash("sha256").update(pdf).digest("hex");

    return { content: pdf as Buffer, hash: pdfHash };
  } catch (pdfError) {
    console.error("PDF generation failed, returning HTML:", pdfError);
    // Fallback: return HTML when PDF fails (e.g. Chromium unavailable in serverless)
    return { content: html, hash: documentHash || undefined, degraded: true };
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
export { registerOdinHelpers } from "./helpers";