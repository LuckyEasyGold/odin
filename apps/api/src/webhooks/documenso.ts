import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { dispatchWebhook } from "../lib/webhooks";

const prisma = new PrismaClient();

export async function handleDocumensoWebhook(req: Request, res: Response) {
  const event = req.body;
  
  // Documenso Webhook payload usually has 'type' and 'data'
  // Event types: DOCUMENT_SIGNED, DOCUMENT_COMPLETED, DOCUMENT_REJECTED
  
  console.log(`[Webhook] Documenso event received: ${event.type}`);
  
  const documentId = event.data?.document?.id || event.data?.id;
  if (!documentId) {
    return res.status(400).json({ error: "No document ID found in webhook" });
  }

  try {
    const generation = await prisma.generation.findFirst({
      where: { externalSignatureId: documentId }
    });

    if (!generation) {
      console.warn(`[Webhook] No generation found for Documenso document: ${documentId}`);
      return res.status(200).json({ message: "Ignored" });
    }

    let statusUpdate = {};
    let shouldNotify = false;

    switch (event.type) {
      case "DOCUMENT_SIGNED":
        statusUpdate = { signatureStatus: "PARTIALLY_SIGNED" };
        // Update individual signer if email is provided in event
        if (event.data?.recipient?.email) {
            await prisma.signer.updateMany({
                where: { 
                    generationId: generation.id,
                    email: event.data.recipient.email 
                },
                data: { status: "SIGNED", signedAt: new Date() }
            });
        }
        break;
      case "DOCUMENT_COMPLETED":
        statusUpdate = { 
            status: "SIGNED", 
            signatureStatus: "COMPLETED",
            signedAt: new Date()
        };
        await prisma.signer.updateMany({
            where: { generationId: generation.id },
            data: { status: "SIGNED" }
        });
        shouldNotify = true;
        break;
      case "DOCUMENT_REJECTED":
        statusUpdate = { signatureStatus: "REJECTED" };
        shouldNotify = true;
        break;
    }

    if (Object.keys(statusUpdate).length > 0) {
      const updated = await prisma.generation.update({
        where: { id: generation.id },
        data: statusUpdate
      });

      if (shouldNotify && updated.userId) {
        dispatchWebhook(updated.userId, "document.signed", {
          generationId: updated.id,
          status: updated.status,
          signatureStatus: updated.signatureStatus
        });
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("[Webhook] Error processing Documenso webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
