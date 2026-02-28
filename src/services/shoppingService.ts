/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {Product} from '../types';
import {GoogleGenAI} from '@google/genai';

const API_URL = 'https://fakestoreapi.com/products';
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export async function getSimilarProductsWithScores(prompt: string): Promise<(Product & { similarity: number })[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch products');
    const allProducts: any[] = await response.json();
    const clothingProducts = allProducts.filter(
      (p) => p.category === "men's clothing" || p.category === "women's clothing"
    );

    const analysisPrompt = `
      Analyze the following list of products and determine how similar each one is to the user's design prompt.
      - User's Design Prompt: "${prompt}"
      - Product List: ${JSON.stringify(clothingProducts.map(p => ({id: p.id, title: p.title, description: p.description})))}

      Return ONLY a JSON object with product IDs as keys and their similarity score (0-100) as values, like this:
      {"<product_id>": <similarity_score>, "<product_id>": <similarity_score>, ...}
    `;

    const aiResponse = await ai.models.generateContent({model: 'gemini-3-flash-preview', contents: analysisPrompt});
    const jsonString = aiResponse.text.match(/\{.*\}/s)?.[0] ?? '{}';
    const scores = JSON.parse(jsonString);

    const matchedProducts: (Product & { similarity: number })[] = clothingProducts
      .map(p => ({ 
        id: String(p.id),
        title: p.title,
        price: p.price,
        image: p.image,
        link: `https://example.com/products/${p.id}`,
        similarity: scores[p.id] || 0 
      }))
      .filter(p => p.similarity > 50)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 4);

    return matchedProducts;
  } catch (error) {
    console.error('Error getting similar products with scores:', error);
    return [];
  }
}
