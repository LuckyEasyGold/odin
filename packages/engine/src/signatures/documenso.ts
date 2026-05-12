import { ISignatureProvider, SignatureDocumentOptions, SignatureResponse } from "./index";

export class DocumensoProvider implements ISignatureProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = "https://app.documenso.com/api/v2") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async createDocument(options: SignatureDocumentOptions): Promise<SignatureResponse> {
    // Note: In Node.js environment, we use native fetch if available (Node 18+)
    // Or we might need a library like form-data. 
    // Given the environment, we'll try to use standard Web API style.

    const formData = new FormData();
    
    const payload = {
      title: options.title,
      recipients: options.recipients.map((r, index) => ({
        name: r.name,
        email: r.email,
        role: "SIGNER",
        signingOrder: r.order || index + 1
      }))
    };

    formData.append("payload", JSON.stringify(payload));
    
    const fileBlob = new Blob([options.file], { type: "application/pdf" });
    formData.append("file", fileBlob, "document.pdf");

    const response = await fetch(`${this.baseUrl}/documents`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(`Documenso API error: ${response.status} - ${JSON.stringify(error)}`);
    }

    const data = (await response.json()) as any;
    const documentId = data.id;

    // Send the document for signature
    const sendResponse = await fetch(`${this.baseUrl}/documents/${documentId}/send`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    if (!sendResponse.ok) {
      throw new Error(`Failed to send Documenso document: ${sendResponse.status}`);
    }

    return {
      externalId: documentId,
      // Documenso returns the signing URLs in the recipients or via a separate call
      // For now we just return the ID
    };
  }
}
