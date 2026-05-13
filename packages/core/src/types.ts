export interface Field {
  key: string;
  type:
    | "text"
    | "number"
    | "currency"
    | "date"
    | "select"
    | "textarea"
    | "boolean"
    | "email"
    | "cpf"
    | "cnpj"
    | "phone";
  label: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: unknown;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  calculationRole?:
    | "cost_base"
    | "intermediary_fee"
    | "tax_percentage"
    | "discount"
    | "final_price";
}

export interface Model {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  version: string;
  template: string;
  schema: Record<string, unknown>;
  fields: Field[];
  tags: string[];
  rating: number;
  ratingCount: number;
  downloads: number;
  forks: number;
  license: "MIT" | "Apache-2.0" | "GPL-3.0" | "CC-BY-SA";
  price: number;
  isVerified: boolean;
  complianceScore: number;
  curatorNote?: string;
  country: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  features: {
    hasIntermediation: boolean;
    requiresLegalReview: boolean;
    supportsSignature: boolean;
    supportsBlockchain: boolean;
  };
  compliance: {
    status: "verified" | "needsReview" | "unknown";
    validatedBy?: string[];
    validatedAt?: string;
  };
}

export interface Generation {
  id: string;
  modelId: string;
  userId?: string;
  inputs: Record<string, unknown>;
  outputHtml?: string;
  outputPdfUrl?: string;
  outputJson?: Record<string, unknown>;
  documentHash?: string;
  externalSignatureId?: string;
  signatureStatus?: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  modelId: string;
  userId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  weight: number;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  keyHash: string;
  lastUsedAt?: string;
  rateLimitPerHour: number;
  createdAt: string;
  isActive: boolean;
}

export interface PackageManifest {
  manifestVersion: string;
  name: string;
  version: string;
  description?: string;
  category: string;
  tags?: string[];
  license: string;
  entry: string;
  schema: string;
  fields?: string;
  styles?: string;
  fixtures?: string;
  readme?: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  version: string;
  schema: Record<string, unknown>;
  template: string;
}

export interface RenderOptions {
  format?: "html" | "pdf" | "json";
  language?: string;
  variables?: Record<string, unknown>;
}