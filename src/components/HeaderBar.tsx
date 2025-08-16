import React from 'react';
import { Menu } from 'lucide-react';

type Props = {
  onOpenFilters: () => void;
  onOpenProfile: () => void;
};

const HeaderBar: React.FC<Props> = ({ onOpenFilters, onOpenProfile }) => {
  return (
    <div className="sticky top-0 z-50 border-b" style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)', borderColor: 'rgba(255,255,255,0.12)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-9 py-3">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-lg border flex items-center justify-center" style={{ background: 'var(--control-bg)', borderColor: 'var(--control-border)', color: 'var(--control-text)' }} onClick={onOpenFilters} aria-label="Open filters">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center gap-2 rounded-full px-4 py-2" style={{ background: 'var(--control-bg)', color: 'var(--control-text)', border: '1px solid var(--control-border)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input className="flex-1 bg-transparent outline-none text-sm" placeholder="Navigate life …" />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22"/><path d="M5 8v8"/><path d="M19 8v8"/></svg>
          </div>
          <button className="w-12 h-12 rounded-full flex items-center justify-center border" style={{ background: 'var(--control-bg)', borderColor: 'var(--control-border)', color: 'var(--control-text)' }} aria-label="Profile" onClick={onOpenProfile}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;

