/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {Design, UserPreferences, ChatMessage, DesignSettings, Product} from '../types';

interface Outfit {
  top: string | null;
  bottom: string | null;
  shoes: string | null;
}

interface AppState {
  uploadedUserImage: string | null; // Original uploaded photo
  setUploadedUserImage: (img: string | null) => void;
  generatedTryOnImage: string | null; // AI-generated try-on result
  setGeneratedTryOnImage: (img: string | null) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
  preferences: UserPreferences;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  designSettings: DesignSettings;
  setDesignSettings: (settings: Partial<DesignSettings>) => void;
  matchScore: number | null;
  setMatchScore: (score: number | null) => void;
  matchReasoning: string;
  setMatchReasoning: (reasoning: string) => void;
  refinedPrompt: string | null;
  setRefinedPrompt: (prompt: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  useReferenceModel: boolean;
  setUseReferenceModel: (val: boolean) => void;
  shoppingResults: Product[];
  setShoppingResults: (results: Product[]) => void;
  isSearching: boolean;
  setIsSearching: (val: boolean) => void;
  gallery: Design[];
  addToGallery: (design: Design) => void;
  removeFromGallery: (id: string) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  loadDesign: (design: Design) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      uploadedUserImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop",
      setUploadedUserImage: (img) => set({uploadedUserImage: img}),
      generatedTryOnImage: null,
      setGeneratedTryOnImage: (img) => set({generatedTryOnImage: img}),
      isGenerating: false,
      setIsGenerating: (val) => set({isGenerating: val}),
      preferences: {
        preferredStyle: 'Streetwear',
        preferredColors: ['#000000', '#333333', '#666666', '#999999'],
        budgetRange: [500, 2500],
      },
      setPreferences: (newPrefs) =>
        set((state) => ({preferences: {...state.preferences, ...newPrefs}})),
      designSettings: {
        creativity: 80,
        trendAlignment: 90,
        minimalism: 40,
      },
      setDesignSettings: (newSettings) =>
        set((state) => ({designSettings: {...state.designSettings, ...newSettings}})),
      matchScore: 88,
      setMatchScore: (score) => set({matchScore: score}),
      matchReasoning: 'Matches your streetwear style and color palette',
      setMatchReasoning: (reasoning) => set({matchReasoning: reasoning}),
      refinedPrompt: null,
      setRefinedPrompt: (prompt) => set({refinedPrompt: prompt}),
      selectedColor: null,
      setSelectedColor: (color) => set({selectedColor: color}),
      useReferenceModel: true,
      setUseReferenceModel: (val) => set({useReferenceModel: val}),
      shoppingResults: [],
      setShoppingResults: (results) => set({shoppingResults: results}),
      isSearching: false,
      setIsSearching: (val) => set({isSearching: val}),
      gallery: [],
      addToGallery: (design) =>
        set((state) => ({gallery: [design, ...state.gallery]})),
      removeFromGallery: (id) =>
        set((state) => ({gallery: state.gallery.filter((d) => d.id !== id)})),
      chatHistory: [
        {sender: 'ai', text: "Hello! Let's design your perfect outfit. What style are you thinking? Casual, streetwear, formal, or something else?"}
      ],
      addChatMessage: (message) => set((state) => ({chatHistory: [...state.chatHistory, message]})),
      clearChat: () => set({chatHistory: []}),
      loadDesign: (design) => set({
        generatedTryOnImage: design.imageUrl,
        refinedPrompt: design.prompt,
        preferences: design.preferences,
        designSettings: design.designSettings,
        matchScore: design.matchScore,
      }),
    }),
    {
      name: 'ai-fashion-studio-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        designSettings: state.designSettings,
        gallery: state.gallery,
        chatHistory: state.chatHistory,
        matchScore: state.matchScore,
        matchReasoning: state.matchReasoning,
        uploadedUserImage: state.uploadedUserImage,
        refinedPrompt: state.refinedPrompt,
        useReferenceModel: state.useReferenceModel,
      }),
    }
  )
);
