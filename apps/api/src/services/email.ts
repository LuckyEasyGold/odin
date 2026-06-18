export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private readonly resendApiKey = process.env.RESEND_API_KEY;
  private readonly emailFrom = process.env.EMAIL_FROM;

  private get isConfigured(): boolean {
    return Boolean(this.resendApiKey && this.emailFrom);
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    if (!this.isConfigured) {
      console.warn("[EMAIL DISABLED] Missing RESEND_API_KEY or EMAIL_FROM. Email not sent.");
      console.warn(`[EMAIL DISABLED] To: ${options.to} | Subject: ${options.subject}`);
      return;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: this.emailFrom,
        to: [options.to],
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to send email (${response.status}): ${errorBody}`);
    }
  }

  async sendSignatureRequest(to: string, signerName: string, documentName: string, signUrl: string): Promise<void> {
    return this.sendEmail({
      to,
      subject: `Assinatura Pendente: ${documentName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">ODIN SIGN</h2>
          <p>Olá, <strong>${signerName}</strong>.</p>
          <p>Você foi convidado para assinar o documento: <strong>${documentName}</strong>.</p>
          <div style="margin: 30px 0;">
            <a href="${signUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Assinar Documento Agora</a>
          </div>
          <p style="font-size: 12px; color: #666;">Este link é único e pessoal. Não o compartilhe com ninguém.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 10px; color: #999;">ODIN - Infraestrutura Aberta para Documentos</p>
        </div>
      `,
    });
  }
}

export const emailService = new EmailService();
