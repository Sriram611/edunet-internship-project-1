/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useStore} from '../store/useStore';
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function MainCanvas() {
  const {uploadedUserImage, generatedTryOnImage, matchScore, isGenerating, addToGallery, preferences, designSettings, refinedPrompt, useReferenceModel, shoppingResults, isSearching} = useStore();
  const [isSaved, setIsSaved] = useState(false);

  const handleDownload = () => {
    if (generatedTryOnImage) {
      const link = document.createElement('a');
      link.href = generatedTryOnImage;
      link.download = `vogue-ai-design-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrintify = () => {
    // Redirect to Printify's custom product creation page
    // This is a generic link as deep linking to their designer requires an API integration
    window.open('https://printify.com/app/products', '_blank');
  };

  const handleSaveToGallery = () => {
    if (generatedTryOnImage) {
      addToGallery({
        id: Math.random().toString(36).substr(2, 9),
        prompt: refinedPrompt || 'AI Try-on Design',
        imageUrl: generatedTryOnImage,
        createdAt: new Date().toISOString(),
        matchScore: matchScore || 0,
        preferences: preferences,
        designSettings: designSettings,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <main className="flex-1 h-full relative bg-[#fcfcfc] overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-6xl mx-auto p-8 md:p-16 space-y-12">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tighter uppercase">Studio <span className="text-indigo-600">Preview</span></h2>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">High-fidelity AI Synthesis Engine</p>
          </div>
          {matchScore > 0 && (
            <div className="flex items-center space-x-4 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-right">
                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Match Score</p>
                <p className="text-sm font-black text-indigo-600">{matchScore}%</p>
              </div>
              <div className="w-10 h-10">
                <CircularProgressbar 
                  value={matchScore} 
                  strokeWidth={12}
                  styles={buildStyles({
                    pathColor: '#4f46e5',
                    trailColor: '#f3f4f6',
                  })}
                />
              </div>
            </div>
          )}
        </div>

        {/* Try-on Display */}
        <div className="relative min-h-[600px] flex items-center justify-center p-8 md:p-12 bg-white rounded-[48px] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={isGenerating ? 'generating' : generatedTryOnImage ? 'tryon' : uploadedUserImage ? 'photo' : 'empty'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full relative flex items-center justify-center"
            >
              {isGenerating ? (
                <div className="flex flex-col items-center space-y-8">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-gray-50 rounded-full"></div>
                    <div className="absolute inset-0 w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.4em] font-black text-indigo-600 animate-pulse">Synthesizing Fabric</p>
                    <p className="text-[10px] text-gray-400 font-medium">Optimizing studio lighting & proportions...</p>
                  </div>
                </div>
              ) : generatedTryOnImage ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center space-y-12">
                  <div className="relative w-full flex items-center justify-center">
                    <img 
                      src={generatedTryOnImage} 
                      alt="Try-on Result" 
                      className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-lg" 
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={handleDownload}
                      className="p-5 bg-white text-gray-900 rounded-[24px] border border-gray-100 shadow-xl hover:bg-gray-50 transition-all group active:scale-95"
                      title="Download Design"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>

                    <button 
                      onClick={handleSaveToGallery}
                      disabled={isSaved}
                      className={`px-12 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center space-x-3 group active:scale-95 ${
                        isSaved 
                          ? 'bg-emerald-500 text-white shadow-emerald-200' 
                          : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                          <span>Archive</span>
                        </>
                      )}
                    </button>

                    <button 
                      onClick={handlePrintify}
                      className="px-10 py-5 bg-emerald-600 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center space-x-3 group active:scale-95"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      <span>Printify</span>
                    </button>
                  </div>
                </div>
              ) : (useReferenceModel && uploadedUserImage) ? (
                <div className="relative w-full h-full flex items-center justify-center p-12">
                  <div className="relative group">
                    <img src={uploadedUserImage} alt="User Photo" className="max-w-full max-h-[60vh] object-contain rounded-3xl opacity-20 grayscale transition-all group-hover:opacity-30" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                      <div className="w-16 h-16 rounded-[24px] bg-white shadow-xl flex items-center justify-center border border-gray-50">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 bg-white px-8 py-3 rounded-full shadow-sm border border-gray-50">Identity Verified</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-8 text-gray-200">
                  <div className="w-32 h-32 rounded-[40px] border-2 border-dashed border-gray-100 flex items-center justify-center">
                    <svg className="w-12 h-12 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14v10m0 0l-8-4m8 4l8-4m-8 4L4 17" />
                    </svg>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300">
                      {useReferenceModel ? 'Studio Awaiting Reference' : 'Product Design Mode Active'}
                    </p>
                    <p className="text-[10px] text-gray-300 font-medium">
                      {useReferenceModel ? 'Upload a professional portrait to begin' : 'Generating clothing on studio mannequin'}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Shopping Section */}
        {(isSearching || shoppingResults.length > 0) ? (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Shop Similar Styles (India)</h3>
                <p className="text-[9px] text-gray-400 font-medium uppercase tracking-widest">
                  {isSearching ? 'Scanning Indian market (Myntra, Ajio, Flipkart)...' : 'Curated from top Indian retailers'}
                </p>
              </div>
            </div>
            
            {isSearching ? (
              <div className="grid grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm animate-pulse">
                    <div className="aspect-[3/4] rounded-[24px] bg-gray-50 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {shoppingResults.map((product) => (
                  <a 
                    key={product.id} 
                    href={product.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group bg-white p-5 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
                  >
                    <div className="aspect-[3/4] rounded-[32px] overflow-hidden bg-gray-50 mb-6 relative">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.id}/400/600`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
                    </div>
                    <div className="space-y-2 px-2">
                      <p className="text-[11px] font-bold text-gray-900 line-clamp-2 leading-relaxed group-hover:text-indigo-600 transition-colors">{product.title}</p>
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-xs font-black text-indigo-600">₹{product.price}</p>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 group-hover:text-indigo-400 transition-colors">View Store</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : generatedTryOnImage && !isSearching && (
          <div className="p-12 bg-indigo-50 rounded-[48px] border border-indigo-100 flex flex-col items-center text-center space-y-6 animate-slide-up">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">No exact matches in Indian stores?</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">Don't worry! You can use Printify to bring this exact design to life on high-quality apparel.</p>
            </div>
            <button 
              onClick={handlePrintify}
              className="px-10 py-5 bg-indigo-600 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
            >
              Start Production on Printify
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
