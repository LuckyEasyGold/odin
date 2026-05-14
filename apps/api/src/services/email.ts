export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  async sendEmail(options: EmailOptions): Promise<void> {
    console.log("-----------------------------------------");
    console.log(`[EMAIL SIMULADO] Enviando para: ${options.to}`);
    console.log(`Assunto: ${options.subject}`);
    console.log(`Corpo: ${options.html}`);
    console.log("-----------------------------------------");
    
    // Futura integração com Resend, SendGrid, etc.
    return Promise.resolve();
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
      `
    });
  }
}

export const emailService = new EmailService();
