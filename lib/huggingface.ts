/**
 * Hugging Face API Integration
 * Handles text generation for Pokemon fusion names and descriptions
 */

import { env } from './env';

// Model options for free tier
export const HF_MODELS = {
  MISTRAL: 'mistralai/Mistral-7B-Instruct-v0.2',
  LLAMA: 'meta-llama/Llama-2-7b-chat-hf',
  ZEPHYR: 'HuggingFaceH4/zephyr-7b-beta',
} as const;

type HFModel = (typeof HF_MODELS)[keyof typeof HF_MODELS];

interface HFMessage {
  role: 'system' | 'user';
  content: string;
}

interface HFResponse {
  generated_text: string;
}

interface HFError {
  error: string;
}

/**
 * Hugging Face API Client
 */
export class HuggingFaceClient {
  private apiKey: string;
  private model: HFModel;

  constructor(model: HFModel = HF_MODELS.MISTRAL) {
    this.apiKey = env.HUGGINGFACE_API_KEY;
    this.model = model;
  }

  /**
   * Call Hugging Face Inference API
   * Uses the serverless inference API format
   */
  private async callAPI(prompt: string): Promise<string> {
    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${this.model}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.7,
              return_full_text: false,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HF API Error (${response.status}): ${errorText || response.statusText}`);
      }

      // Hugging Face returns an array with generated_text field
      const data = (await response.json()) as Array<{ generated_text: string }>;

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid response format from Hugging Face API');
      }

      const generatedText = data[0].generated_text;
      return generatedText.trim();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Hugging Face API call failed:', error.message);
        throw error;
      }
      throw new Error('Unknown error calling Hugging Face API');
    }
  }

  /**
   * Generate a creative fusion name from two Pokemon names
   *
   * @param pokemon1Name - First Pokemon's name
   * @param pokemon2Name - Second Pokemon's name
   * @returns Creative fusion name
   */
  async generateFusionName(pokemon1Name: string, pokemon2Name: string): Promise<string> {
    const prompt = `You are a creative Pokemon namer. Combine two Pokemon names to create a unique fusion name. Be creative but keep it readable. Return ONLY the fusion name, nothing else.

Create a fusion name for: ${pokemon1Name} + ${pokemon2Name}

Fusion name:`;

    const result = await this.callAPI(prompt);
    return result.trim();
  }

  /**
   * Generate 3 unique descriptions for a Pokemon fusion
   *
   * @param fusionName - The generated fusion name
   * @param pokemon1Name - First Pokemon's name
   * @param pokemon2Name - Second Pokemon's name
   * @returns Array of 3 unique descriptions
   */
  async generateFusionDescriptions(
    fusionName: string,
    pokemon1Name: string,
    pokemon2Name: string
  ): Promise<string[]> {
    const prompt = `You are a Pokemon description writer. Create 3 unique, creative descriptions of what a Pokemon fusion might look like. Each description should be 1-2 sentences. Return each description on a separate line numbered 1-3.

Describe the fusion "${fusionName}" (a combination of ${pokemon1Name} and ${pokemon2Name}). Provide 3 distinct visual descriptions.

1.`;

    const result = await this.callAPI(prompt);

    // Parse the response into 3 separate descriptions
    const descriptions = result
      .split('\n')
      .map((line) => line.replace(/^\d+\.\s*/, '').trim()) // Remove numbering
      .filter((line) => line.length > 0)
      .slice(0, 3);

    // Ensure we always have 3 descriptions
    while (descriptions.length < 3) {
      descriptions.push(`A unique fusion of ${pokemon1Name} and ${pokemon2Name}.`);
    }

    return descriptions;
  }
}

/**
 * Default Hugging Face client instance
 */
export const hfClient = new HuggingFaceClient();
