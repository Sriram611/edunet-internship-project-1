/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useState} from 'react';
import {useStore} from '../store/useStore';

export default function Sidebar() {
  const {preferences, setPreferences, uploadedUserImage, setUploadedUserImage, designSettings, setDesignSettings, selectedColor, setSelectedColor, useReferenceModel, setUseReferenceModel} = useStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawImage = reader.result as string;
        setUploadedUserImage(rawImage);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#4a5568', '#718096', '#a0aec0', '#cbd5e0', '#edf2f7', 
    '#f7fafc', '#ebf8ff', '#bee3f8', '#90cdf4', '#63b3ed'
  ];

  return (
    <aside className="w-[360px] bg-white border-r border-gray-100 flex flex-col p-10 overflow-y-auto z-20">
      <div className="space-y-12">
        {/* Profile Section */}
        <section className="space-y-6">
          <div className={`space-y-4 transition-opacity duration-300 ${!useReferenceModel ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <p className="sidebar-item-label">Reference Identity</p>
            <div className="flex items-center space-x-6">
              <div className="relative w-24 h-24 bg-gray-50 rounded-[24px] overflow-hidden group border border-gray-100 shadow-sm">
                {uploadedUserImage ? (
                  <img src={uploadedUserImage} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <label className="absolute inset-0 bg-indigo-600/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer backdrop-blur-sm">
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">Update</span>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">Studio Model</p>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  Upload a clear, full-body portrait for accurate AI synthesis.
                </p>
              </div>
            </div>
          </div>
          
          {/* Toggle for Reference Model */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="space-y-0.5">
              <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">Use Reference Model</p>
              <p className="text-[9px] text-gray-400 font-medium">Generate on person vs product only</p>
            </div>
            <button 
              onClick={() => setUseReferenceModel(!useReferenceModel)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${useReferenceModel ? 'bg-indigo-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useReferenceModel ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="space-y-8">
          <div className="space-y-3">
            <label className="sidebar-item-label">Aesthetic Direction</label>
            <div className="relative">
              <select 
                value={preferences.preferredStyle}
                onChange={(e) => setPreferences({preferredStyle: e.target.value})}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[11px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none transition-all cursor-pointer"
              >
                <option>Streetwear</option>
                <option>Minimalist</option>
                <option>Vintage</option>
                <option>Bohemian</option>
                <option>Formal</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="sidebar-item-label">Market Positioning</label>
              <span className="text-[10px] font-black text-indigo-600 tracking-tighter">${preferences.budgetRange[0]} — ${preferences.budgetRange[1]}</span>
            </div>
            <input 
              type="range" 
              min="500" 
              max="5000" 
              step="100"
              value={preferences.budgetRange[1]}
              onChange={(e) => setPreferences({budgetRange: [500, parseInt(e.target.value)]})}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <label className="sidebar-item-label">Color Synthesis</label>
            <div className="grid grid-cols-5 gap-3">
              {colors.slice(0, 10).map((color, i) => (
                <button 
                  key={i} 
                  className={`w-full aspect-square rounded-xl border-2 transition-all duration-300 ${selectedColor === color ? 'border-indigo-600 scale-110 shadow-lg shadow-indigo-100' : 'border-transparent hover:scale-105 hover:border-gray-100'}`}
                  style={{backgroundColor: color}}
                  onClick={() => {
                    setSelectedColor(selectedColor === color ? null : color);
                    const newColors = preferences.preferredColors.includes(color)
                      ? preferences.preferredColors.filter(c => c !== color)
                      : [...preferences.preferredColors, color];
                    setPreferences({preferredColors: newColors});
                  }}
                />
              ))}
            </div>
            <p className="text-[9px] text-gray-400 font-medium leading-relaxed">
              Selected color will be injected into the AI generation prompt for realistic fabric dyeing.
            </p>
          </div>
        </section>

        {/* Optimization Section */}
        <section className="space-y-8">
          <h3 className="sidebar-item-label">AI Generation Tuning</h3>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Creativity</span>
                <span className="text-[10px] font-black text-indigo-600">{designSettings.creativity}%</span>
              </div>
              <input 
                type="range" 
                min="0"
                max="100"
                value={designSettings.creativity}
                onChange={(e) => setDesignSettings({creativity: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trend Alignment</span>
                <span className="text-[10px] font-black text-indigo-600">{designSettings.trendAlignment}%</span>
              </div>
              <input 
                type="range" 
                min="0"
                max="100"
                value={designSettings.trendAlignment}
                onChange={(e) => setDesignSettings({trendAlignment: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Minimalism</span>
                <span className="text-[10px] font-black text-indigo-600">{designSettings.minimalism}%</span>
              </div>
              <input 
                type="range" 
                min="0"
                max="100"
                value={designSettings.minimalism}
                onChange={(e) => setDesignSettings({minimalism: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
          </div>
        </section>

        <button className="w-full py-5 bg-indigo-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-xl shadow-indigo-100">
          Sync Preferences
        </button>
      </div>
    </aside>
  );
}
