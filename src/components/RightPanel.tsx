/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useState, useRef, useEffect} from 'react';
import {useStore} from '../store/useStore';
import {generateTryOnImage, getMatchScore, getAIStylistResponse, searchSimilarProducts} from '../services/geminiService';

import {Link} from 'react-router-dom';

export default function RightPanel() {
  const {
    preferences, 
    designSettings, 
    uploadedUserImage, 
    setGeneratedTryOnImage, 
    setMatchScore, 
    setMatchReasoning, 
    chatHistory, 
    addChatMessage, 
    isGenerating, 
    setIsGenerating,
    refinedPrompt,
    setRefinedPrompt,
    selectedColor,
    useReferenceModel,
    setShoppingResults,
    setIsSearching
  } = useStore();
  
  const [input, setInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [chatHistory]);

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendChat = async () => {
    if ((!input.trim() && !attachedImage) || isChatting) return;

    const userMsg = {sender: 'user' as const, text: input || (attachedImage ? "[Attached Image]" : "")};
    addChatMessage(userMsg);
    const currentInput = input;
    const currentImage = attachedImage;
    setInput('');
    setAttachedImage(null);
    setIsChatting(true);

    try {
      const {text, refinedPrompt: newRefinedPrompt} = await getAIStylistResponse(currentInput, currentImage || undefined);
      addChatMessage({sender: 'ai', text});
      if (newRefinedPrompt) {
        setRefinedPrompt(newRefinedPrompt);
      }
    } catch (error) {
      console.error('Chat failed:', error);
      addChatMessage({sender: 'ai', text: "I'm sorry, I'm having trouble connecting right now."});
    } finally {
      setIsChatting(false);
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    if (useReferenceModel && !uploadedUserImage) return;

    setIsGenerating(true);
    
    // Combine user preferences, tuning, and the AI-refined prompt
    const tuningPrompt = `Creativity: ${designSettings.creativity}%, Trend: ${designSettings.trendAlignment}%, Minimalism: ${designSettings.minimalism}%`;
    const basePrompt = refinedPrompt || "a stylish outfit";
    const colorPrompt = selectedColor ? `in ${selectedColor} color` : "";
    const finalPrompt = `${basePrompt} ${colorPrompt}, in a ${preferences.preferredStyle} style. Optimization: ${tuningPrompt}. Professional studio photography, white background.`;
    
    try {
      const tryOnResult = await generateTryOnImage(useReferenceModel ? uploadedUserImage : null, finalPrompt);
      if (tryOnResult) {
        setGeneratedTryOnImage(tryOnResult);
        const {score, reasoning} = await getMatchScore(finalPrompt, preferences, designSettings);
        setMatchScore(score);
        setMatchReasoning(reasoning);
        
        // Search for similar products
        setIsSearching(true);
        const products = await searchSimilarProducts(finalPrompt);
        setShoppingResults(products);
        setIsSearching(false);
        
        addChatMessage({
          sender: 'ai', 
          text: "I've generated your design! You can see it in the main preview. What do you think?"
        });
      }
    } catch (error) {
      console.error('Generation failed:', error);
      addChatMessage({sender: 'ai', text: "I encountered an error while generating the try-on image."});
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <aside className="w-[420px] bg-white border-l border-gray-100 flex flex-col p-10 overflow-hidden z-20">
      <div className="flex-1 flex flex-col space-y-10 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">AI Stylist</h3>
            <p className="text-[10px] text-gray-400 font-medium">Conversational Design Engine</p>
          </div>
          <Link to="/gallery" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">Collection</Link>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col space-y-8 overflow-y-auto pr-4 custom-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              <div className="flex items-start space-x-4 max-w-[90%]">
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center overflow-hidden border border-indigo-100 shrink-0">
                    <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=100&h=100&q=80" alt="AI Stylist" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className={`p-5 rounded-2xl text-[13px] leading-relaxed font-medium ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-100' : 'bg-gray-50 text-gray-600 rounded-tl-none border border-gray-100'}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isChatting && (
            <div className="flex justify-start">
              <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 flex items-center space-x-2">
                <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Current Refined Prompt Display */}
        {refinedPrompt && (
          <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Active Blueprint</p>
            </div>
            <p className="text-[11px] text-gray-600 font-medium leading-relaxed italic">"{refinedPrompt}"</p>
          </div>
        )}

        {/* Input Area */}
        <div className="space-y-6">
          {attachedImage && (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <img src={attachedImage} alt="Attached" className="w-full h-full object-cover" />
              <button 
                onClick={() => setAttachedImage(null)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Refine your design vision..."
              className="w-full p-5 pl-14 pr-24 bg-gray-50 border border-gray-100 rounded-[24px] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-gray-300"
              disabled={isChatting}
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center space-x-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isChatting}
                className="text-gray-300 hover:text-indigo-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileAttach} 
                className="hidden" 
                accept="image/*" 
              />
              <button 
                onClick={handleSendChat}
                disabled={isChatting || (!input.trim() && !attachedImage)}
                className="text-indigo-600 hover:text-indigo-700 disabled:opacity-20 transition-all"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || (useReferenceModel && !uploadedUserImage)}
              className={`w-full py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center space-x-3 ${
                (useReferenceModel && !uploadedUserImage) 
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 hover:-translate-y-1'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <span>{useReferenceModel ? 'Generate Studio Try-on' : 'Generate Product Design'}</span>
                </>
              )}
            </button>
            {(useReferenceModel && !uploadedUserImage) && (
              <p className="text-[9px] text-center text-red-400 font-black uppercase tracking-widest">
                Identity reference required for synthesis
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
