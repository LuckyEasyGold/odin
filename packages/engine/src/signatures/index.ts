export interface SignatureRecipient {
  name: string;
  email: string;
  order?: number;
}

export interface SignatureDocumentOptions {
  title: string;
  file: Buffer;
  recipients: SignatureRecipient[];
}

export interface SignatureResponse {
  externalId: string;
  url?: string;
}

export interface ISignatureProvider {
  createDocument(options: SignatureDocumentOptions): Promise<SignatureResponse>;
  // cancelDocument(externalId: string): Promise<void>;
}

export * from "./documenso";
