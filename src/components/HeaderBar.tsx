import React from 'react';
import { Menu } from 'lucide-react';

type Props = {
  syncState: 'synced' | 'pending' | 'offline';
  onOpenFilters: () => void;
  onOpenProfile: () => void;
};

const HeaderBar: React.FC<Props> = ({ syncState, onOpenFilters, onOpenProfile }) => {
  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
      <div className="max-w-7xl mx-auto px-6 sm:px-9 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center" onClick={onOpenFilters} aria-label="Open filters">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Daily Navigator</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-1 rounded ${syncState === 'synced' ? 'bg-green-100 text-green-800' : syncState === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-700'}`}>{syncState}</span>
            <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200" aria-label="Profile" onClick={onOpenProfile}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-500"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input className="flex-1 bg-transparent outline-none text-sm" placeholder="Navigate life: water • call mom • choose one thing" />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22"/><path d="M5 8v8"/><path d="M19 8v8"/></svg>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;

