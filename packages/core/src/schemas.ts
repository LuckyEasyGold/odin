import { z } from "zod";

export const fieldTypeSchema = z.enum([
  "text",
  "number",
  "currency",
  "date",
  "select",
  "textarea",
  "boolean",
  "email",
  "cpf",
  "cnpj",
  "phone",
]);

export const calculationRoleSchema = z.enum([
  "cost_base",
  "intermediary_fee",
  "tax_percentage",
  "discount",
  "final_price",
]);

export const fieldSchema = z.object({
  key: z.string(),
  type: fieldTypeSchema,
  label: z.string(),
  required: z.boolean(),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  defaultValue: z.unknown().optional(),
  options: z.array(z.string()).optional(),
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
    })
    .optional(),
  calculationRole: calculationRoleSchema.optional(),
});

export const licenseSchema = z.enum(["MIT", "Apache-2.0", "GPL-3.0", "CC-BY-SA"]);

export const complianceStatusSchema = z.enum(["verified", "needsReview", "unknown"]);

export const modelFeaturesSchema = z.object({
  hasIntermediation: z.boolean(),
  requiresLegalReview: z.boolean(),
  supportsSignature: z.boolean(),
  supportsBlockchain: z.boolean(),
});

export const complianceSchema = z.object({
  status: complianceStatusSchema,
  validatedBy: z.array(z.string()).optional(),
  validatedAt: z.string().optional(),
});

export const modelSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.string(),
  categoryId: z.string().optional(),
  subcategory: z.string().optional(),
  version: z.string(),
  template: z.string(),
  schema: z.record(z.unknown()),
  fields: z.array(fieldSchema),
  tags: z.array(z.string()),
  rating: z.number(),
  ratingCount: z.number(),
  downloads: z.number(),
  forks: z.number(),
  license: licenseSchema,
  price: z.number(),
  isVerified: z.boolean(),
  complianceScore: z.number(),
  curatorNote: z.string().optional(),
  country: z.string(),
  isPublic: z.boolean(),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isActive: z.boolean(),
  guidance: z.string().optional(),
  variableHints: z.record(z.string()).optional(),
  features: modelFeaturesSchema,
  compliance: complianceSchema,
});

export const ratingValueSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);

export const ratingSchema = z.object({
  id: z.string(),
  modelId: z.string(),
  userId: z.string(),
  rating: ratingValueSchema,
  comment: z.string().optional(),
  isTechnical: z.boolean().optional(),
  isApproval: z.boolean().optional(),
  weight: z.number(),
  createdAt: z.string(),
});

export const apiKeySchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  keyHash: z.string(),
  lastUsedAt: z.string().optional(),
  rateLimitPerHour: z.number(),
  createdAt: z.string(),
  isActive: z.boolean(),
});

export const generationSchema = z.object({
  id: z.string(),
  modelId: z.string(),
  userId: z.string().optional(),
  inputs: z.record(z.unknown()),
  outputHtml: z.string().optional(),
  outputPdfUrl: z.string().optional(),
  outputJson: z.record(z.unknown()).optional(),
  checksum: z.string().optional(),
  externalSignatureId: z.string().optional(),
  signatureStatus: z.string().optional(),
  signedAt: z.string().optional(),
  ipAddress: z.string().optional(),
  status: z.string().optional(),
  createdAt: z.string(),
});

export const packageManifestSchema = z.object({
  manifestVersion: z.string(),
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  license: z.string(),
  entry: z.string(),
  schema: z.string(),
  fields: z.string().optional(),
  styles: z.string().optional(),
  fixtures: z.string().optional(),
  readme: z.string().optional(),
});

export const documentTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  schema: z.record(z.unknown()),
  template: z.string(),
});

export const renderOptionsSchema = z.object({
  format: z.enum(["html", "pdf", "json"]).optional(),
  language: z.string().optional(),
  variables: z.record(z.unknown()).optional(),
});