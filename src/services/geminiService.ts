/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleGenAI, Chat, Type} from '@google/genai';
import {Product} from '../types';

const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (!key) {
    console.warn('GEMINI_API_KEY not found in process.env or import.meta.env.VITE_GEMINI_API_KEY');
  }
  return key;
};

const ai = new GoogleGenAI({apiKey: getApiKey() || ''});

const chat = ai.chats.create({
  model: 'gemini-3-flash-preview',
  config: {
    systemInstruction: `You are an expert fashion stylist. Your goal is to help the user craft the perfect, detailed prompt to generate their ideal clothing design. Ask clarifying questions, suggest creative ideas, and guide them towards a descriptive prompt. Once you have a good prompt, end your message with the exact prompt suggestion.`,
  },
});

export async function startChat(message: string): Promise<string> {
  try {
    const response = await chat.sendMessage({message});
    return response.text;
  } catch (error) {
    console.error('Error in chat:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
}

let stylistChat: Chat | null = null;

async function getStylistChat() {
  if (stylistChat) {
    return stylistChat;
  }
  stylistChat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are an expert fashion stylist. Your goal is to help a user design a piece of clothing. 
      1. Ask clarifying questions about style, material, color, and fit (one at a time).
      2. Maintain a friendly, professional tone.
      3. After every response, internally keep track of the "Current Refined Design Prompt".
      4. If the user seems ready or you have enough info, suggest a final design.
      
      IMPORTANT: At the end of every response, include a hidden block with the current best design prompt in this format: [PROMPT: your detailed design prompt here]`,
    },
  });
  return stylistChat;
}

export async function getAIStylistResponse(message: string, imageBase64?: string): Promise<{text: string; refinedPrompt: string | null}> {
  try {
    const chat = await getStylistChat();
    let response;
    
    if (imageBase64) {
      const imagePart = {
        inlineData: {
          data: imageBase64.split(',')[1],
          mimeType: 'image/png',
        },
      };
      response = await chat.sendMessage({
        message: [
          { text: message },
          imagePart
        ]
      });
    } else {
      response = await chat.sendMessage({message});
    }
    
    const text = response.text ?? 'Sorry, I am unable to respond.';
    
    // Extract the refined prompt if present
    const promptMatch = text.match(/\[PROMPT: (.*?)\]/);
    const refinedPrompt = promptMatch ? promptMatch[1] : null;
    
    // Clean up the text for display (remove the hidden prompt tag)
    const cleanText = text.replace(/\[PROMPT: .*?\]/, '').trim();
    
    return { text: cleanText, refinedPrompt };
  } catch (error) {
    console.error('Error getting stylist response:', error);
    return { text: 'Sorry, an error occurred.', refinedPrompt: null };
  }
}

export async function getMatchScore(prompt: string, preferences: any, designSettings: any): Promise<{score: number; reasoning: string}> {
  const analysisPrompt = `
    Analyze the following fashion design prompt and user preferences, then return a match score and reasoning.
    - User's Prompt: "${prompt}"
    - User's Preferences:
      - Style: ${preferences.preferredStyle}
      - Colors: ${preferences.preferredColors.join(', ')}
      - Budget: $${preferences.budgetRange[0]} - $${preferences.budgetRange[1]}
    - Design Settings:
      - Creativity: ${designSettings.creativity}%
      - Minimalism: ${designSettings.minimalism}%
      - Trend Alignment: ${designSettings.trendAlignment}%

    Based on this, provide a percentage score of how well the described design matches the user's preferences and current general fashion trends. 
    Also provide a brief reasoning for your score.

    Return ONLY a JSON object in the format: {"score": <number>, "reasoning": "<string>"}
  `;

  try {
    const response = await ai.models.generateContent({model: 'gemini-3-flash-preview', contents: analysisPrompt});
    const jsonString = response.text.match(/\{.*\}/s)?.[0] ?? '{}';
    const result = JSON.parse(jsonString);
    return { score: result.score || 0, reasoning: result.reasoning || 'Could not be determined.' };
  } catch (error) {
    console.error('Error getting match score:', error);
    return { score: 0, reasoning: 'An error occurred during analysis.' };
  }
}

export async function searchSimilarProducts(clothingPrompt: string): Promise<Product[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find 4 real, available online store links from the INDIAN market (e.g., Myntra, Ajio, Flipkart, Amazon.in, Tata CLiQ) for clothing that matches this description: ${clothingPrompt}. 
      
      CRITICAL REQUIREMENTS:
      1. Return a JSON array of objects.
      2. Each object MUST have: id, title, price (number in Indian Rupees - INR), image (URL), and link (URL).
      3. The 'image' URL MUST be a direct, high-quality public image URL. 
      4. Ensure the links are from Indian e-commerce domains (.in or specific Indian retailers).
      5. If no exact match is found, suggest similar items available in India.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              price: { type: Type.NUMBER },
              image: { type: Type.STRING },
              link: { type: Type.STRING },
            },
            required: ['id', 'title', 'price', 'image', 'link'],
          },
        },
      },
    });

    const text = response.text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const results = JSON.parse(jsonStr);
    return results;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}
export async function generateTryOnImage(userPhotoBase64: string | null, clothingPrompt: string): Promise<string | null> {
  try {
    const parts: any[] = [];
    
    if (userPhotoBase64) {
      parts.push({
        inlineData: {
          data: userPhotoBase64.split(',')[1],
          mimeType: 'image/png',
        },
      });
      parts.push({
        text: `Professional E-commerce Virtual Try-on: 
        Generate a high-resolution, professional fashion photograph of the person in the provided photo wearing the following design: ${clothingPrompt}.
        
        Key Requirements:
        1. Background: Clean, solid white studio background.
        2. Lighting: Natural, soft studio lighting with subtle shadows to define form.
        3. Fabric Texture: Highly detailed and realistic fabric textures.
        4. Fit & Proportions: The clothing must perfectly follow the person's body contours, pose, and perspective.
        5. Consistency: Maintain the person's facial features, hair, skin tone, and original pose exactly.
        6. Quality: Sharp resolution, professional color grading.`,
      });
    } else {
      parts.push({
        text: `Professional E-commerce Product Photography: 
        Generate a high-resolution, professional fashion photograph of the following clothing design: ${clothingPrompt}.
        
        Key Requirements:
        1. Presentation: The clothing should be displayed on a high-end invisible mannequin (ghost mannequin) or as a perfectly styled flat lay.
        2. Background: Clean, solid white studio background.
        3. Lighting: Natural, soft studio lighting with subtle shadows to define form and depth.
        4. Fabric Texture: Highly detailed and realistic fabric textures (e.g., matte cotton, silk sheen, denim grain).
        5. Quality: Sharp resolution, professional color grading, and e-commerce catalog quality.`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    return null;
  } catch (error) {
    console.error('Error generating try-on image:', error);
    return null;
  }
}
