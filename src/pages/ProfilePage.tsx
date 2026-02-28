/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useStore} from '../store/useStore';

export default function ProfilePage() {
  const {preferences, setPreferences, uploadedUserImage} = useStore();

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-[#f0f4f8]">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Profile Settings</h2>
          <p className="text-gray-500 font-medium">Manage your personal fashion preferences</p>
        </div>

        <div className="glass-card rounded-[40px] p-10 space-y-10">
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Account Information</h3>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-3xl bg-gray-100 overflow-hidden border border-gray-200">
                <img src={uploadedUserImage || "https://picsum.photos/seed/user/200/200"} alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-gray-900">Fashion Visionary</p>
                <p className="text-sm text-gray-500">visionary@aifashion.studio</p>
                <button className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">Change Avatar</button>
              </div>
            </div>
          </section>

          <section className="space-y-6 pt-10 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Fashion Profile</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Default Style</label>
                <select 
                  value={preferences.preferredStyle}
                  onChange={(e) => setPreferences({preferredStyle: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition-all"
                >
                  <option>Streetwear</option>
                  <option>Minimalist</option>
                  <option>Vintage</option>
                  <option>Bohemian</option>
                  <option>Formal</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Budget Preference</label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700">
                  Up to ${preferences.budgetRange[1]}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6 pt-10 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
            <div className="space-y-4">
              {[
                {label: 'New Style Recommendations', desc: 'Get notified when AI finds new styles matching your profile'},
                {label: 'Trend Alerts', desc: 'Stay updated with the latest fashion trends in your area'},
                {label: 'Design Completion', desc: 'Receive a notification when your complex designs are ready'}
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-10 flex justify-end">
            <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
