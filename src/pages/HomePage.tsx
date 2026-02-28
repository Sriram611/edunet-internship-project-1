/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {Link} from 'react-router-dom';

export default function HomePage() {
  const features = [
    {
      title: "AI Stylist",
      description: "Chat with our multi-modal AI to refine your design vision. Upload sketches or inspiration images for tailored suggestions.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    },
    {
      title: "Virtual Try-on",
      description: "Upload your portrait to see designs instantly synthesized onto your body with realistic lighting and proportions.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: "Indian Market Sync",
      description: "Instantly find matching styles from top Indian retailers like Myntra, Ajio, and Flipkart in Indian Rupees (₹).",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      title: "Printify Ready",
      description: "Download your high-resolution designs or bridge directly to Printify to start physical production.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      )
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Define Your Vision",
      text: "Start a conversation with the AI Stylist. Describe your style or upload an inspiration image to create a design blueprint."
    },
    {
      num: "02",
      title: "Upload Reference",
      text: "Provide a clear portrait for the Virtual Try-on engine to accurately synthesize the garment onto your identity."
    },
    {
      num: "03",
      title: "Generate & Refine",
      text: "Click Generate to see your vision come to life. Refine colors, styles, and creativity settings in real-time."
    },
    {
      num: "04",
      title: "Shop or Produce",
      text: "Browse matching styles in the Indian market or download your design to start production on Printify."
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#fcfcfc] custom-scrollbar">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_70%)]"></div>
        <div className="max-w-5xl w-full text-center space-y-12 relative z-10 animate-slide-up">
          <h1 className="flex flex-col items-center">
            <span className="font-serif text-[80px] md:text-[140px] font-black uppercase tracking-tighter text-gray-900 leading-[0.8] select-none">Vogue</span>
            <span className="font-sans text-xs md:text-sm font-black uppercase tracking-[0.8em] text-indigo-600 mt-8 select-none">AI Studio • India Edition</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium">
            The future of fashion is conversational. Design, visualize, and shop your dream outfits with the world's most advanced AI synthesis engine.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 pt-6">
            <Link to="/generate" className="w-full sm:w-auto px-12 py-6 bg-indigo-600 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.3em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 hover:-translate-y-1 active:scale-95">
              Enter Studio
            </Link>
            <Link to="/gallery" className="w-full sm:w-auto px-12 py-6 bg-white text-gray-900 border border-gray-100 rounded-[24px] text-xs font-black uppercase tracking-[0.3em] hover:bg-gray-50 transition-all shadow-sm active:scale-95">
              View Collection
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-12 py-24 border-t border-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="space-y-8 sticky top-24">
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">How It <span className="text-indigo-600">Works</span></h2>
              <p className="text-gray-400 font-medium uppercase text-[10px] tracking-[0.4em]">Your Journey from Concept to Reality</p>
            </div>
            <p className="text-lg text-gray-500 leading-relaxed">
              Vogue AI Studio combines advanced multi-modal LLMs with high-fidelity image synthesis to bridge the gap between imagination and fashion.
            </p>
            <div className="pt-8">
              <Link to="/generate" className="inline-flex items-center space-x-4 text-indigo-600 font-black uppercase text-[10px] tracking-widest group">
                <span>Start your first design</span>
                <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-12">
            {steps.map((step, i) => (
              <div key={i} className="flex space-x-8 group">
                <span className="text-4xl font-serif font-black text-gray-100 group-hover:text-indigo-100 transition-colors duration-500">{step.num}</span>
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 py-32 px-12">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black tracking-tighter uppercase">Studio <span className="text-indigo-600">Features</span></h2>
            <p className="text-gray-400 font-medium uppercase text-[10px] tracking-[0.4em]">Professional Grade Fashion Tools</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  {feature.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">{feature.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed font-medium">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-12 text-center">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-3xl font-black tracking-tighter uppercase">Ready to redefine your <span className="text-indigo-600">Wardrobe?</span></h2>
          <Link to="/generate" className="inline-block px-16 py-6 bg-gray-900 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl shadow-gray-200 hover:-translate-y-1">
            Launch Studio
          </Link>
        </div>
      </section>
    </div>
  );
}
