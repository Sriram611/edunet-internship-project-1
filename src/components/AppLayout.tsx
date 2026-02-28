/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {NavLink, Outlet} from 'react-router-dom';
import {useStore} from '../store/useStore';

export default function AppLayout() {
  const {uploadedUserImage} = useStore();
  const navItems = [
    {name: 'Home', path: '/'},
    {name: 'Generate', path: '/generate'},
    {name: 'Gallery', path: '/gallery'},
    {name: 'Profile', path: '/profile'},
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-[#fcfcfc] text-[#111827]">
      {/* Top Navigation */}
      <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-12 z-30 sticky top-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="flex items-baseline">
            <span className="font-serif text-2xl font-black uppercase tracking-tight text-gray-900">Vogue</span>
            <span className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 ml-1.5">AI</span>
          </h1>
        </div>
        <nav className="flex items-center space-x-10">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({isActive}) => 
                `text-[10px] font-black uppercase tracking-[0.2em] transition-all pb-1 border-b-2 ${
                  isActive 
                    ? 'text-indigo-600 border-indigo-600' 
                    : 'text-gray-400 border-transparent hover:text-gray-900'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
          <NavLink to="/profile" className="w-10 h-10 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 cursor-pointer hover:border-indigo-200 transition-all">
            <img src={uploadedUserImage || "https://picsum.photos/seed/user/100/100"} alt="User" className="w-full h-full object-cover" />
          </NavLink>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
