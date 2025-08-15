import React from 'react';
import { X } from 'lucide-react';

type Props = {
  show: boolean;
  onClose: () => void;
  faithModeEnabled: boolean;
  setFaithModeEnabled: (v: boolean) => void;
  sabbathMode: boolean;
  setSabbathMode: (v: boolean) => void;
  syncState: 'synced' | 'pending' | 'offline';
  setSyncState: (v: 'synced' | 'pending' | 'offline') => void;
  onResetDemo?: () => void;
  theme?: 'light' | 'warm' | 'dim' | 'aurora';
  setTheme?: (t: 'light' | 'warm' | 'dim' | 'aurora') => void;
};

const ProfileDrawer: React.FC<Props> = ({ show, onClose, faithModeEnabled, setFaithModeEnabled, sabbathMode, setSabbathMode, syncState, setSyncState, onResetDemo, theme = 'light', setTheme }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-80 max-w-[85vw] bg-white shadow-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Profile</h2>
          <button className="w-8 h-8 rounded-md border flex items-center justify-center" onClick={onClose} aria-label="Close profile"><X className="w-4 h-4"/></button>
        </div>
        <div className="space-y-5 text-sm text-gray-800">
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-500">Theme</div>
            <div className="grid grid-cols-2 gap-2">
              {(['light','warm','dim','aurora'] as const).map(t => (
                <button key={t} className={`px-3 py-2 rounded-md border text-left ${theme===t ? 'ring-2 ring-blue-300' : ''}`} onClick={()=> setTheme && setTheme(t)}>
                  <div className="text-sm capitalize">{t}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-500">Modes</div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={faithModeEnabled} onChange={(e)=>setFaithModeEnabled(e.target.checked)} /> Faith mode (show Anchors)</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={sabbathMode} onChange={(e)=>setSabbathMode(e.target.checked)} /> Sabbath mode (calm visuals)</label>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-500">Sync status</div>
            <div className="flex items-center gap-3">
              {(['synced','pending','offline'] as const).map(s => (
                <label key={s} className="flex items-center gap-1">
                  <input type="radio" name="syncstate" checked={syncState===s} onChange={()=>setSyncState(s)} />
                  <span className="capitalize">{s}</span>
                </label>
              ))}
            </div>
          </div>
          {onResetDemo && (
            <div className="pt-2">
              <button className="text-sm px-3 py-2 border rounded-md" onClick={onResetDemo}>Reset demo data</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;

