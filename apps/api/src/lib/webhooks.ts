import axios from "axios";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function dispatchWebhook(userId: string, event: string, payload: any) {
  try {
    const webhooks = await prisma.webhook.findMany({
      where: { userId, isActive: true }
    });

    for (const hook of webhooks) {
      if (hook.events.includes(event)) {
        const timestamp = Date.now().toString();
        const body = JSON.stringify({ event, payload, timestamp });
        
        // Generate HMAC signature for security
        const signature = crypto
          .createHmac("sha256", hook.secret)
          .update(timestamp + body)
          .digest("hex");

        // Fire and forget (don't await to avoid blocking API)
        axios.post(hook.url, body, {
          headers: {
            "Content-Type": "application/json",
            "x-odin-signature": signature,
            "x-odin-timestamp": timestamp
          },
          timeout: 5000
        }).catch(err => {
          console.error(`Webhook failed for ${hook.url}:`, err.message);
        });
      }
    }
  } catch (error) {
    console.error("Webhook dispatch error:", error);
  }
}
