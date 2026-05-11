import { z } from "zod";
export declare const fieldTypeSchema: z.ZodEnum<["text", "number", "currency", "date", "select", "textarea", "boolean", "email", "cpf", "cnpj", "phone"]>;
export declare const calculationRoleSchema: z.ZodEnum<["cost_base", "intermediary_fee", "tax_percentage", "discount", "final_price"]>;
export declare const fieldSchema: z.ZodObject<{
    key: z.ZodString;
    type: z.ZodEnum<["text", "number", "currency", "date", "select", "textarea", "boolean", "email", "cpf", "cnpj", "phone"]>;
    label: z.ZodString;
    required: z.ZodBoolean;
    placeholder: z.ZodOptional<z.ZodString>;
    helpText: z.ZodOptional<z.ZodString>;
    defaultValue: z.ZodOptional<z.ZodUnknown>;
    options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    validation: z.ZodOptional<z.ZodObject<{
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
        pattern: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        min?: number | undefined;
        max?: number | undefined;
        pattern?: string | undefined;
    }, {
        min?: number | undefined;
        max?: number | undefined;
        pattern?: string | undefined;
    }>>;
    calculationRole: z.ZodOptional<z.ZodEnum<["cost_base", "intermediary_fee", "tax_percentage", "discount", "final_price"]>>;
}, "strip", z.ZodTypeAny, {
    key: string;
    type: "number" | "boolean" | "text" | "currency" | "date" | "select" | "textarea" | "email" | "cpf" | "cnpj" | "phone";
    label: string;
    required: boolean;
    placeholder?: string | undefined;
    helpText?: string | undefined;
    defaultValue?: unknown;
    options?: string[] | undefined;
    validation?: {
        min?: number | undefined;
        max?: number | undefined;
        pattern?: string | undefined;
    } | undefined;
    calculationRole?: "cost_base" | "intermediary_fee" | "tax_percentage" | "discount" | "final_price" | undefined;
}, {
    key: string;
    type: "number" | "boolean" | "text" | "currency" | "date" | "select" | "textarea" | "email" | "cpf" | "cnpj" | "phone";
    label: string;
    required: boolean;
    placeholder?: string | undefined;
    helpText?: string | undefined;
    defaultValue?: unknown;
    options?: string[] | undefined;
    validation?: {
        min?: number | undefined;
        max?: number | undefined;
        pattern?: string | undefined;
    } | undefined;
    calculationRole?: "cost_base" | "intermediary_fee" | "tax_percentage" | "discount" | "final_price" | undefined;
}>;
export declare const licenseSchema: z.ZodEnum<["MIT", "Apache-2.0", "GPL-3.0", "CC-BY-SA"]>;
export declare const complianceStatusSchema: z.ZodEnum<["verified", "needsReview", "unknown"]>;
export declare const modelFeaturesSchema: z.ZodObject<{
    hasIntermediation: z.ZodBoolean;
    requiresLegalReview: z.ZodBoolean;
    supportsSignature: z.ZodBoolean;
    supportsBlockchain: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    hasIntermediation: boolean;
    requiresLegalReview: boolean;
    supportsSignature: boolean;
    supportsBlockchain: boolean;
}, {
    hasIntermediation: boolean;
    requiresLegalReview: boolean;
    supportsSignature: boolean;
    supportsBlockchain: boolean;
}>;
export declare const complianceSchema: z.ZodObject<{
    status: z.ZodEnum<["verified", "needsReview", "unknown"]>;
    validatedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    validatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "verified" | "needsReview" | "unknown";
    validatedBy?: string[] | undefined;
    validatedAt?: string | undefined;
}, {
    status: "verified" | "needsReview" | "unknown";
    validatedBy?: string[] | undefined;
    validatedAt?: string | undefined;
}>;
export declare const modelSchema: z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodString;
    subcategory: z.ZodOptional<z.ZodString>;
    version: z.ZodString;
    template: z.ZodString;
    schema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    fields: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        type: z.ZodEnum<["text", "number", "currency", "date", "select", "textarea", "boolean", "email", "cpf", "cnpj", "phone"]>;
        label: z.ZodString;
        required: z.ZodBoolean;
        placeholder: z.ZodOptional<z.ZodString>;
        helpText: z.ZodOptional<z.ZodString>;
        defaultValue: z.ZodOptional<z.ZodUnknown>;
        options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        validation: z.ZodOptional<z.ZodObject<{
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
            pattern: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            min?: number | undefined;
            max?: number | undefined;
            pattern?: string | undefined;
        }, {
            min?: number | undefined;
            max?: number | undefined;
            pattern?: string | undefined;
        }>>;
        calculationRole: z.ZodOptional<z.ZodEnum<["cost_base", "intermediary_fee", "tax_percentage", "discount", "final_price"]>>;
    }, "strip", z.ZodTypeAny, {
        key: string;
        type: "number" | "boolean" | "text" | "currency" | "date" | "select" | "textarea" | "email" | "cpf" | "cnpj" | "phone";
        label: string;
        required: boolean;
        placeholder?: string | undefined;
        helpText?: string | undefined;
        defaultValue?: unknown;
        options?: string[] | undefined;
        validation?: {
            min?: number | undefined;
            max?: number | undefined;
            pattern?: string | undefined;
        } | undefined;
        calculationRole?: "cost_base" | "intermediary_fee" | "tax_percentage" | "discount" | "final_price" | undefined;
    }, {
        key: string;
        type: "number" | "boolean" | "text" | "currency" | "date" | "select" | "textarea" | "email" | "cpf" | "cnpj" | "phone";
        label: string;
        required: boolean;
        placeholder?: string | undefined;
        helpText?: string | undefined;
        defaultValue?: unknown;
        options?: string[] | undefined;
        validation?: {
            min?: number | undefined;
            max?: number | undefined;
            pattern?: string | undefined;
        } | undefined;
        calculationRole?: "cost_base" | "intermediary_fee" | "tax_percentage" | "discount" | "final_price" | undefined;
    }>, "many">;
    tags: z.ZodArray<z.ZodString, "many">;
    rating: z.ZodNumber;
    ratingCount: z.ZodNumber;
    downloads: z.ZodNumber;
    forks: z.ZodNumber;
    license: z.ZodEnum<["MIT", "Apache-2.0", "GPL-3.0", "CC-BY-SA"]>;
    createdBy: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    isActive: z.ZodBoolean;
    features: z.ZodObject<{
        hasIntermediation: z.ZodBoolean;
        requiresLegalReview: z.ZodBoolean;
        supportsSignature: z.ZodBoolean;
        supportsBlockchain: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        hasIntermediation: boolean;
        requiresLegalReview: boolean;
        supportsSignature: boolean;
        supportsBlockchain: boolean;
    }, {
        hasIntermediation: boolean;
        requiresLegalReview: boolean;
        supportsSignature: boolean;
        supportsBlockchain: boolean;
    }>;
    compliance: z.ZodObject<{
        status: z.ZodEnum<["verified", "needsReview", "unknown"]>;
        validatedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        validatedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "verified" | "needsReview" | "unknown";
        validatedBy?: string[] | undefined;
        validatedAt?: string | undefined;
    }, {
        status: "verified" | "needsReview" | "unknown";
        validatedBy?: string[] | undefined;
        validatedAt?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    slug: string;
    name: string;
    category: string;
    version: string;
    template: string;
    schema: Record<string, unknown>;
    fields: {
        key: string;
        type: "number" | "boolean" | "text" | "currency" | "date" | "select" | "textarea" | "email" | "cpf" | "cnpj" | "phone";
        label: string;
        required: boolean;
        placeholder?: string | undefined;
        helpText?: string | undefined;
        defaultValue?: unknown;
        options?: string[] | undefined;
        validation?: {
            min?: number | undefined;
            max?: number | undefined;
            pattern?: string | undefined;
        } | undefined;
        calculationRole?: "cost_base" | "intermediary_fee" | "tax_percentage" | "discount" | "final_price" | undefined;
    }[];
    tags: string[];
    rating: number;
    ratingCount: number;
    downloads: number;
    forks: number;
    license: "MIT" | "Apache-2.0" | "GPL-3.0" | "CC-BY-SA";
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
        validatedBy?: string[] | undefined;
        validatedAt?: string | undefined;
    };
    description?: string | undefined;
    subcategory?: string | undefined;
}, {
    id: string;
    slug: string;
    name: string;
    category: string;
    version: string;
    template: string;
    schema: Record<string, unknown>;
    fields: {
        key: string;
        type: "number" | "boolean" | "text" | "currency" | "date" | "select" | "textarea" | "email" | "cpf" | "cnpj" | "phone";
        label: string;
        required: boolean;
        placeholder?: string | undefined;
        helpText?: string | undefined;
        defaultValue?: unknown;
        options?: string[] | undefined;
        validation?: {
            min?: number | undefined;
            max?: number | undefined;
            pattern?: string | undefined;
        } | undefined;
        calculationRole?: "cost_base" | "intermediary_fee" | "tax_percentage" | "discount" | "final_price" | undefined;
    }[];
    tags: string[];
    rating: number;
    ratingCount: number;
    downloads: number;
    forks: number;
    license: "MIT" | "Apache-2.0" | "GPL-3.0" | "CC-BY-SA";
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
        validatedBy?: string[] | undefined;
        validatedAt?: string | undefined;
    };
    description?: string | undefined;
    subcategory?: string | undefined;
}>;
export declare const ratingValueSchema: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>, z.ZodLiteral<5>]>;
export declare const ratingSchema: z.ZodObject<{
    id: z.ZodString;
    modelId: z.ZodString;
    userId: z.ZodString;
    rating: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>, z.ZodLiteral<5>]>;
    comment: z.ZodOptional<z.ZodString>;
    weight: z.ZodNumber;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    rating: 1 | 2 | 3 | 4 | 5;
    createdAt: string;
    modelId: string;
    userId: string;
    weight: number;
    comment?: string | undefined;
}, {
    id: string;
    rating: 1 | 2 | 3 | 4 | 5;
    createdAt: string;
    modelId: string;
    userId: string;
    weight: number;
    comment?: string | undefined;
}>;
export declare const apiKeySchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    name: z.ZodString;
    keyHash: z.ZodString;
    lastUsedAt: z.ZodOptional<z.ZodString>;
    rateLimitPerHour: z.ZodNumber;
    createdAt: z.ZodString;
    isActive: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: string;
    isActive: boolean;
    userId: string;
    keyHash: string;
    rateLimitPerHour: number;
    lastUsedAt?: string | undefined;
}, {
    id: string;
    name: string;
    createdAt: string;
    isActive: boolean;
    userId: string;
    keyHash: string;
    rateLimitPerHour: number;
    lastUsedAt?: string | undefined;
}>;
export declare const generationSchema: z.ZodObject<{
    id: z.ZodString;
    modelId: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
    inputs: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    outputHtml: z.ZodOptional<z.ZodString>;
    outputPdfUrl: z.ZodOptional<z.ZodString>;
    outputJson: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    checksum: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    modelId: string;
    inputs: Record<string, unknown>;
    userId?: string | undefined;
    outputHtml?: string | undefined;
    outputPdfUrl?: string | undefined;
    outputJson?: Record<string, unknown> | undefined;
    checksum?: string | undefined;
}, {
    id: string;
    createdAt: string;
    modelId: string;
    inputs: Record<string, unknown>;
    userId?: string | undefined;
    outputHtml?: string | undefined;
    outputPdfUrl?: string | undefined;
    outputJson?: Record<string, unknown> | undefined;
    checksum?: string | undefined;
}>;
export declare const packageManifestSchema: z.ZodObject<{
    manifestVersion: z.ZodString;
    name: z.ZodString;
    version: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodString;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    license: z.ZodString;
    entry: z.ZodString;
    schema: z.ZodString;
    fields: z.ZodOptional<z.ZodString>;
    styles: z.ZodOptional<z.ZodString>;
    fixtures: z.ZodOptional<z.ZodString>;
    readme: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    category: string;
    version: string;
    schema: string;
    license: string;
    manifestVersion: string;
    entry: string;
    description?: string | undefined;
    fields?: string | undefined;
    tags?: string[] | undefined;
    styles?: string | undefined;
    fixtures?: string | undefined;
    readme?: string | undefined;
}, {
    name: string;
    category: string;
    version: string;
    schema: string;
    license: string;
    manifestVersion: string;
    entry: string;
    description?: string | undefined;
    fields?: string | undefined;
    tags?: string[] | undefined;
    styles?: string | undefined;
    fixtures?: string | undefined;
    readme?: string | undefined;
}>;
export declare const documentTemplateSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    version: z.ZodString;
    schema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    template: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    version: string;
    template: string;
    schema: Record<string, unknown>;
}, {
    id: string;
    name: string;
    version: string;
    template: string;
    schema: Record<string, unknown>;
}>;
export declare const renderOptionsSchema: z.ZodObject<{
    format: z.ZodOptional<z.ZodEnum<["html", "pdf", "json"]>>;
    language: z.ZodOptional<z.ZodString>;
    variables: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    format?: "html" | "pdf" | "json" | undefined;
    language?: string | undefined;
    variables?: Record<string, unknown> | undefined;
}, {
    format?: "html" | "pdf" | "json" | undefined;
    language?: string | undefined;
    variables?: Record<string, unknown> | undefined;
}>;
