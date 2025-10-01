
import { GoogleGenAI, Chat } from "@google/genai";
import type { EducationLevel } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const baseInstruction = `You are AstroChat AI, an expert astronomer and enthusiastic educator. Your purpose is to provide clear, accurate, and engaging answers to questions about astronomy, astrophysics, and space exploration.
- When asked about a celestial object, try to include a fascinating fact.
- Structure your responses for readability using markdown (lists, bolding, etc.).
- Your passion for the cosmos should be evident in your tone.`;

const levelInstructions: Record<EducationLevel, string> = {
  'Elementary': "You are speaking to an elementary school student. Explain concepts in very simple terms, using fun analogies a child can understand. Avoid jargon and keep sentences short. Be very encouraging and excited!",
  'High School': "You are speaking to a high school student. You can use common scientific terms but should explain them clearly. Assume a baseline knowledge of science, but not advanced physics or math. Your goal is to make learning engaging and clear for a teenager.",
  'Intermediate': "You are speaking to a university-level student. Provide detailed, in-depth answers. You can use complex terminology and assume a strong foundation in physics and mathematics. Your answers should be precise, comprehensive, and suitable for someone studying astronomy or a related field."
};


export const createChatSession = (level: EducationLevel): Chat => {
  const systemInstruction = `${baseInstruction}\n\n**Audience Level Context:**\n${levelInstructions[level]}`;
  
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });
  return chat;
};

export const createImagePrompt = async (text: string): Promise<string> => {
    const systemInstruction = `You are an AI assistant that creates concise, descriptive, and visually rich prompts for an image generation model. Based on the following text about astronomy, create a single, clear, artistic prompt that captures the main subject and atmosphere. The prompt should be a single sentence or a short phrase, focusing on visual elements. Example style: "A breathtaking nebula with swirling clouds of pink and blue gas, newborn stars twinkling within, hyperrealistic, 8k". Do not add any extra text or explanations.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create an image prompt from this text: "${text}"`,
        config: {
            systemInstruction,
        }
    });

    return response.text.trim();
};


export const generateImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Astronomy, cinematic, epic, beautiful, high resolution. ${prompt}`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed or returned no images.");
    }
    
    return response.generatedImages[0].image.imageBytes;
};

export const generateCosmicEvolutionVideo = async (prompt: string): Promise<string> => {
  let operation = await ai.models.generateVideos({
    model: 'veo-2.0-generate-001',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
    }
  });

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }
  
  if (operation.error) {
    throw new Error(`Video generation failed: ${operation.error.message}`);
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  
  if (!downloadLink) {
    throw new Error("Video generation completed, but no video URI was found in the response. The operation may have failed silently.");
  }
  
  // The component will fetch this URI with the API key appended
  return `${downloadLink}&key=${API_KEY}`;
};
