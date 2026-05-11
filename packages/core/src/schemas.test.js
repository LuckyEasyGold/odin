import { describe, it, expect } from "vitest";
import { documentTemplateSchema, modelSchema, fieldSchema } from "../src/schemas";
describe("Core Schemas", () => {
    it("should validate a document template", () => {
        const validTemplate = {
            id: "test-template",
            name: "Test Template",
            version: "1.0.0",
            schema: { type: "object" },
            template: "<h1>{{title}}</h1>"
        };
        const result = documentTemplateSchema.safeParse(validTemplate);
        expect(result.success).toBe(true);
    });
    it("should validate a model", () => {
        const validModel = {
            id: "123",
            slug: "test-model",
            name: "Test Model",
            category: "test",
            version: "1.0.0",
            template: "<h1>{{title}}</h1>",
            schema: { type: "object" },
            fields: [],
            tags: [],
            rating: 0,
            ratingCount: 0,
            downloads: 0,
            forks: 0,
            license: "MIT",
            createdBy: "user-1",
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
            isActive: true,
            features: {
                hasIntermediation: false,
                requiresLegalReview: false,
                supportsSignature: false,
                supportsBlockchain: false
            },
            compliance: {
                status: "unknown"
            }
        };
        const result = modelSchema.safeParse(validModel);
        expect(result.success).toBe(true);
    });
    it("should validate a field", () => {
        const validField = {
            key: "title",
            type: "text",
            label: "Title",
            required: true
        };
        const result = fieldSchema.safeParse(validField);
        expect(result.success).toBe(true);
    });
});
