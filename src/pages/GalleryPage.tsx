/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useStore} from '../store/useStore';
import {useNavigate} from 'react-router-dom';

export default function GalleryPage() {
  const {gallery, removeFromGallery, loadDesign} = useStore();
  const navigate = useNavigate();

  const handleReopen = (design: any) => {
    loadDesign(design);
    navigate('/generate');
  };

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Your Collection</h2>
            <p className="text-gray-500 font-medium">Archived designs and match scores</p>
          </div>
        </div>

        {gallery.length === 0 ? (
          <div className="h-96 bg-white rounded-[40px] border border-gray-100 flex flex-col items-center justify-center space-y-4 text-gray-300 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Your collection is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {gallery.map((design) => (
              <div key={design.id} className="bg-white rounded-[32px] overflow-hidden group animate-slide-up flex flex-col h-full border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
                <div className="aspect-[3/4] relative overflow-hidden bg-gray-50">
                  <img 
                    src={design.imageUrl} 
                    alt={design.prompt} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    loading="lazy"
                  />
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl text-[10px] font-black text-indigo-600 shadow-xl border border-gray-50 z-10">
                    {design.matchScore}% MATCH
                  </div>
                  <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-4 z-20 backdrop-blur-[2px]">
                    <button 
                      onClick={() => handleReopen(design)}
                      className="p-4 bg-indigo-600 rounded-2xl text-white hover:scale-110 transition-transform shadow-xl shadow-indigo-200"
                      title="Reopen and Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => removeFromGallery(design.id)}
                      className="p-4 bg-white rounded-2xl text-red-500 hover:scale-110 transition-transform shadow-xl border border-gray-100"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-8 space-y-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{new Date(design.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <span className="px-3 py-1 bg-indigo-50 rounded-full text-[8px] font-black text-indigo-600 uppercase tracking-widest">{design.preferences.preferredStyle}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-600 leading-relaxed line-clamp-3 flex-1">
                    {design.prompt}
                  </p>
                  <div className="pt-4 flex items-center justify-between border-t border-gray-50">
                    <div className="flex -space-x-2">
                      {design.preferences.preferredColors.slice(0, 3).map((c, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{backgroundColor: c}} />
                      ))}
                      {design.preferences.preferredColors.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-400 shadow-sm">
                          +{design.preferences.preferredColors.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-[10px] font-black text-indigo-600 uppercase tracking-tighter">
                      <span>View Details</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
