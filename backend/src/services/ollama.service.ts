import axios from 'axios';
import { logger } from '../utils/logger';

interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    parameter_size: string;
    quantization_level: string;
  };
}

class OllamaService {
  private baseUrl: string;
  private currentModel: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';
    this.currentModel = process.env.OLLAMA_DEFAULT_MODEL || 'llama2';
  }

  async listModels(): Promise<OllamaModel[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`);
      return response.data.models;
    } catch (error) {
      logger.error('Error fetching Ollama models:', error);
      throw new Error('Failed to fetch Ollama models');
    }
  }

  async setCurrentModel(modelName: string): Promise<void> {
    try {
      // Verify model exists
      const models = await this.listModels();
      const modelExists = models.some(model => model.name === modelName);
      
      if (!modelExists) {
        throw new Error(`Model ${modelName} not found`);
      }

      this.currentModel = modelName;
      logger.info(`Set current Ollama model to: ${modelName}`);
    } catch (error) {
      logger.error('Error setting current model:', error);
      throw error;
    }
  }

  async getCurrentModel(): Promise<string> {
    return this.currentModel;
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: this.currentModel,
        prompt,
        stream: false
      });

      return response.data.response;
    } catch (error) {
      logger.error('Error generating content with Ollama:', error);
      throw new Error('Failed to generate content');
    }
  }

  async checkModelHealth(modelName: string): Promise<boolean> {
    try {
      await axios.post(`${this.baseUrl}/api/generate`, {
        model: modelName,
        prompt: 'test',
        stream: false
      });
      return true;
    } catch (error) {
      logger.error(`Model ${modelName} health check failed:`, error);
      return false;
    }
  }
}

export const ollamaService = new OllamaService();
