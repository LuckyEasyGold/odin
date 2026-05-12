import axios from 'axios';

export class Odin {
  private apiKey: string;
  private apiUrl: string;
  private client: any;

  constructor(apiKey: string, options: { apiUrl?: string } = {}) {
    this.apiKey = apiKey;
    this.apiUrl = options.apiUrl || 'http://localhost:3001/api/v1';
    
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * List all available document models
   */
  async listModels() {
    const response = await this.client.get('/models');
    return response.data;
  }

  /**
   * Get a specific model by ID or slug
   */
  async getModel(id: string) {
    const response = await this.client.get(`/models/${id}`);
    return response.data;
  }

  /**
   * Generate a document from a model
   */
  async generateDocument(modelId: string, inputs: any = {}, options: { format?: string } = {}) {
    const response = await this.client.post('/generate', {
      modelId,
      inputs,
      format: options.format || 'html'
    });
    return response.data;
  }

  /**
   * Get a download link for a generation
   */
  getDownloadUrl(generationId: string) {
    return `${this.apiUrl}/generations/${generationId}/download`;
  }
}

export default Odin;
