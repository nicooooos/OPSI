import { GoogleGenAI, Chat } from "@google/genai";
import type { EducationLevel } from '../types';
import type { CosmicEvent } from "../components/CosmicTimeline";

// Fix: Use process.env.API_KEY as per the guidelines to resolve TypeScript error and align with requirements.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // Fix: Update error message to reflect the use of API_KEY.
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const baseInstruction = `You are AstroChat AI, an expert astronomer and enthusiastic educator. Your purpose is to provide clear, accurate, and engaging answers to questions about astronomy, astrophysics, and space exploration.
- When asked about a celestial object, try to include a fascinating fact.
- Structure your responses for readability using markdown (lists, bolding, etc.).
- Your passion for the cosmos should be evident in your tone.
- For mathematical formulas, use LaTeX syntax. Enclose inline formulas with single dollar signs (e.g., $E=mc^2$) and block formulas with double dollar signs (e.g., $$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$).`;

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

export const generateVisualizationCode = async (event: CosmicEvent): Promise<string> => {
    const systemInstruction = `You are an expert web developer specializing in creative and scientific visualizations. Your task is to generate a single, self-contained HTML file with embedded CSS and JavaScript to visualize a specific event in cosmic history.

- The visualization must be a short, engaging, and looping animation that clearly represents the provided event.
- The visualization must be responsive and fill its container. Use a dark, cosmic theme.
- DO NOT use any external libraries (like p5.js, three.js), images, or fonts. All assets must be generated with vanilla JS/CSS/HTML (e.g., canvas, svg, css animations).
- The code must be a complete HTML document, starting with \`<!DOCTYPE html>\` and ending with \`</html>\`.
- Ensure the animation is performant and lightweight.
- The animation should be directly related to the event title and description.`;
    
    const userPrompt = `Generate a visualization for the event titled "${event.name}".

Here are the detailed instructions for the animation:
${event.visualizationPrompt}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction,
            temperature: 0.7,
        }
    });

    // Clean up response, remove markdown fences if they exist
    let code = response.text.trim();
    if (code.startsWith('```html')) {
        code = code.substring(7, code.length - 3).trim();
    } else if (code.startsWith('```')) {
         code = code.substring(3, code.length - 3).trim();
    }

    return code;
};