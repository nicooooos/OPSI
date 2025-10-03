
import { GoogleGenAI, Chat } from "@google/genai";
import type { EducationLevel } from '../types';

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

export const generateVisualizationCode = async (): Promise<string> => {
    const systemInstruction = `You are an expert web developer specializing in creative and scientific visualizations. Your task is to generate a single, self-contained HTML file with embedded CSS and JavaScript. This file should create a visually engaging, animated representation of the cosmic evolution from the Big Bang to the present day.

- The visualization must be a **linear, non-looping animation** that progresses through distinct phases.
- The animation should start automatically on load and have a clear beginning and end.
- Sequence of events to visualize:
    1.  **The Big Bang:** Start with an intensely bright, singular point that rapidly expands (Inflation).
    2.  **The Dark Ages & First Stars:** Transition to a dark space with cooling particles, eventually leading to the ignition of the first, brilliant, massive stars.
    3.  **Galaxy Formation:** Show these stars clustering together, forming early galaxies that swirl and merge.
    4.  **Present Day:** Conclude with a view of a mature, complex galaxy like the Milky Way, with diverse stars and planetary systems, which then remains as a static final scene.
- The visualization must be responsive and fill its container. Use a dark, cosmic theme.
- DO NOT use any external libraries (like p5.js, three.js), images, or fonts. All assets must be generated with vanilla JS/CSS/HTML (e.g., canvas, svg, css animations).
- The code must be a complete HTML document, starting with \`<!DOCTYPE html>\` and ending with \`</html>\`.
- Ensure the animation is performant and lightweight.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate the Big Bang visualization code now.',
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
