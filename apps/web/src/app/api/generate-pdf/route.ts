import { type NextRequest, NextResponse } from "next/server";
import { renderDocument } from "@odin/engine";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { generationId } = await req.json();

    if (!generationId) {
      return NextResponse.json({ error: "generationId is required" }, { status: 400 });
    }

    const generation = await prisma.generation.findUnique({
      where: { id: generationId },
      include: { model: true },
    });

    if (!generation || !generation.model) {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 });
    }

    const webUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_WEB_URL || "https://odin-web-snowy.vercel.app";
    const verificationUrl = `${webUrl}/verify/${generationId}`;

    const { content, degraded } = await renderDocument(
      generation.model.template,
      generation.inputs as Record<string, unknown>,
      {
        format: "pdf",
        verificationUrl,
        documentId: generationId,
        signers: (generation as any).signers ?? [],
      }
    );

    if (degraded || typeof content === "string") {
      // PDF failed, return HTML fallback
      return new NextResponse(content as string, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-ODIN-Degraded": "pdf-fallback-html",
        },
      });
    }

    const buf = content as Buffer;
    return new Response(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=documento-${generationId}.pdf`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "PDF generation failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
