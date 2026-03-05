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
   */
  private async callAPI(messages: HFMessage[]): Promise<string> {
    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${this.model}/v1/chat/completions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.model,
            messages,
            max_tokens: 500,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        const errorData = (await response.json()) as HFError;
        throw new Error(`HF API Error: ${errorData.error || response.statusText}`);
      }

      const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
      return data.choices[0]?.message?.content || '';
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
    const messages: HFMessage[] = [
      {
        role: 'system',
        content:
          'You are a creative Pokemon namer. Combine two Pokemon names to create a unique fusion name. Be creative but keep it readable. Return ONLY the fusion name, nothing else.',
      },
      {
        role: 'user',
        content: `Create a fusion name for: ${pokemon1Name} + ${pokemon2Name}`,
      },
    ];

    const result = await this.callAPI(messages);
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
    const messages: HFMessage[] = [
      {
        role: 'system',
        content:
          'You are a Pokemon description writer. Create 3 unique, creative descriptions of what a Pokemon fusion might look like. Each description should be 1-2 sentences. Return each description on a separate line.',
      },
      {
        role: 'user',
        content: `Describe the fusion "${fusionName}" (a combination of ${pokemon1Name} and ${pokemon2Name}). Provide 3 distinct visual descriptions.`,
      },
    ];

    const result = await this.callAPI(messages);

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
