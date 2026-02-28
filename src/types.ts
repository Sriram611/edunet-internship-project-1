/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DesignSettings {
  creativity: number;
  trendAlignment: number;
  minimalism: number;
}

export interface Design {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  matchScore: number;
  preferences: UserPreferences;
  designSettings: DesignSettings;
}

export interface UserPreferences {
  preferredStyle: string;
  preferredColors: string[];
  budgetRange: [number, number];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  link: string;
  similarity?: number;
}
