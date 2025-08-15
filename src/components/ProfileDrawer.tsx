import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

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
  theme?: 'light' | 'warm' | 'dim' | 'custom';
  setTheme?: (t: 'light' | 'warm' | 'dim' | 'custom') => void;
};

const ProfileDrawer: React.FC<Props> = ({ show, onClose, faithModeEnabled, setFaithModeEnabled, sabbathMode, setSabbathMode, syncState, setSyncState, onResetDemo, theme = 'light', setTheme }) => {
  const readCustom = ()=>{
    try { const raw = localStorage.getItem('udn_theme_custom'); if(!raw) return null; return JSON.parse(raw); } catch { return null; }
  };
  const previews: Record<'light'|'warm'|'dim'|'custom', {appBg:string; accent:string; cardBg:string; controlBg:string; controlBorder:string}> = {
    light: { appBg: '#f8fafc', accent: '#b8403b', cardBg: '#ffffff', controlBg: '#ffffff', controlBorder: 'rgba(0,0,0,0.12)' },
    warm:  { appBg: '#fffaf4', accent: '#c2412d', cardBg: '#fff7ed', controlBg: '#ffffff', controlBorder: 'rgba(0,0,0,0.10)' },
    dim:   { appBg: '#0f172a', accent: '#334155', cardBg: '#111827', controlBg: '#0b1220', controlBorder: 'rgba(148,163,184,0.35)' },
    custom: (()=>{ const c = readCustom(); return c ? { appBg: c.appBg, accent: '#475569', cardBg: c.cardBg, controlBg: '#ffffff', controlBorder: 'rgba(0,0,0,0.12)' } : { appBg: '#f1f5f9', accent: '#475569', cardBg: '#ffffff', controlBg: '#ffffff', controlBorder: 'rgba(0,0,0,0.12)' }; })(),
  };
  const [openTheme, setOpenTheme] = useState(false);
  const [openModes, setOpenModes] = useState(false);
  const [openSync, setOpenSync] = useState(false);
  const [openData, setOpenData] = useState(false);
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
          {/* Theme collapsible */}
          <div>
            <button className="w-full flex items-center justify-between py-1" onClick={()=>setOpenTheme(v=>!v)}>
              <div className="text-base font-medium">Theme</div>
              <ChevronDown className={`w-4 h-4 transition-transform ${openTheme ? 'rotate-180' : ''}`} />
            </button>
            {openTheme && (
            <div className="mt-2 grid grid-cols-2 gap-3">
              {(['light','dim','warm','custom'] as const).map(t => (
                <button key={t} onClick={()=> setTheme && setTheme(t)} className={`rounded-xl border relative text-left ${theme===t ? 'ring-2 ring-blue-300' : ''}`} style={{ padding: 8, borderColor: '#e5e7eb' }}>
                  <div style={{ width: '100%', height: 84, borderRadius: 12, background: previews[t].appBg, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ height: 18, background: previews[t].accent }} />
                    <div style={{ position: 'absolute', top: 10, right: 10, height: 16, width: 36, borderRadius: 9999, background: previews[t].controlBg, border: `1px solid ${previews[t].controlBorder}` }} />
                    <div style={{ position: 'absolute', top: 36, left: 10, right: 10, height: 32, borderRadius: 12, background: previews[t].cardBg, boxShadow: '0 1px 0 rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }} />
                  </div>
                  <div className="mt-2 text-xs capitalize" style={{ color: '#4b5563' }}>{t}</div>
                </button>
              ))}
            </div>
            )}
            {openTheme && (
            <div className="pt-3">
              <label className="text-xs font-medium text-gray-500 block mb-1">Custom (photo)</label>
              <input type="file" accept="image/*" onChange={(e)=>{
                const file = e.target.files?.[0];
                if(!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const img = new Image();
                  img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const size = 150;
                    canvas.width = size; canvas.height = size;
                    const ctx = canvas.getContext('2d');
                    if(!ctx) return;
                    ctx.drawImage(img, 0, 0, size, size);
                    const { data } = ctx.getImageData(0,0,size,size);
                    // simple quantize: bin colors to 16 levels per channel
                    const buckets: Record<string, number> = {};
                    for(let i=0;i<data.length;i+=4){
                      const r = Math.round(data[i]/16)*16;
                      const g = Math.round(data[i+1]/16)*16;
                      const b = Math.round(data[i+2]/16)*16;
                      const key = `${r},${g},${b}`;
                      buckets[key] = (buckets[key]||0)+1;
                    }
                    const top = Object.entries(buckets).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k])=>k.split(',').map(n=>Number(n)) as [number,number,number]);
                    const toHex = (rgb:[number,number,number])=>`#${rgb.map(x=>x.toString(16).padStart(2,'0')).join('')}`;
                    const luminance = (rgb:[number,number,number])=>{ const [r,g,b]=rgb.map(v=>{v/=255; return v<=0.03928? v/12.92: Math.pow((v+0.055)/1.055,2.4);}); return 0.2126*r+0.7152*g+0.0722*b; };
                    const blend = (rgb:[number,number,number], t:number, to:[number,number,number])=> toHex([0,1,2].map(i=>Math.round(rgb[i]*(1-t)+to[i]*t)) as any);
                    const white:[number,number,number]=[255,255,255];
                    const black:[number,number,number]=[0,0,0];
                    const dominant = top[0] || [240,240,240];
                    const domLum = luminance(dominant);
                    const appBg = domLum>0.6 ? blend(dominant, 0.58, white) : blend(dominant, 0.7, black);
                    const contrast = (rgb:[number,number,number])=>{ const L1=domLum; const L2=luminance(rgb); const c=(Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05); return c; };
                    const textRgb = (top.slice(1)[0]) || (domLum>0.6? [15,23,42]: [226,232,240]);
                    const text = contrast(textRgb)>4.0 ? toHex(textRgb as any) : (domLum>0.6? '#0f172a':'#e2e8f0');
                    const cardBg = blend(dominant, domLum>0.6? 0.7: 0.28, white);
                    const cardBorder = 'rgba(148,163,184,0.35)';
                    const pillBg = domLum>0.6? 'rgba(0,0,0,0.06)':'rgba(255,255,255,0.08)';
                    const palette = { appBg, text, cardBg, cardBorder, pillBg, accentBg: '#475569', accentText: '#ffffff', controlBg: '#ffffff', controlText: '#1f2937', controlBorder: 'rgba(0,0,0,0.12)' };
                    localStorage.setItem('udn_theme','custom');
                    localStorage.setItem('udn_theme_custom', JSON.stringify(palette));
                    document.body.setAttribute('data-theme','custom');
                    document.body.style.setProperty('--app-bg', palette.appBg);
                    document.body.style.setProperty('--text', palette.text);
                    document.body.style.setProperty('--card-bg', palette.cardBg);
                    document.body.style.setProperty('--card-border', palette.cardBorder);
                    document.body.style.setProperty('--pill-bg', palette.pillBg);
                    document.body.style.setProperty('--accent-bg', palette.accentBg);
                    document.body.style.setProperty('--accent-text', palette.accentText);
                    document.body.style.setProperty('--control-bg', palette.controlBg);
                    document.body.style.setProperty('--control-text', palette.controlText);
                    document.body.style.setProperty('--control-border', palette.controlBorder);
                  };
                  img.src = reader.result as string;
                };
                reader.readAsDataURL(file);
              }} />
              <div className="mt-2 flex gap-2">
                <button className="px-2 py-1 text-xs border rounded" onClick={()=>{
                  const raw = localStorage.getItem('udn_theme_custom'); if(!raw) return; let p: any; try{ p=JSON.parse(raw);}catch{return;}
                  document.body.setAttribute('data-theme','custom');
                  ['--app-bg','--text','--card-bg','--card-border','--pill-bg','--accent-bg','--accent-text','--control-bg','--control-text','--control-border'].forEach(k=>document.body.style.removeProperty(k));
                  document.body.style.setProperty('--app-bg', p.appBg);
                  document.body.style.setProperty('--text', p.text);
                  document.body.style.setProperty('--card-bg', p.cardBg);
                  document.body.style.setProperty('--card-border', p.cardBorder);
                  document.body.style.setProperty('--pill-bg', p.pillBg);
                  document.body.style.setProperty('--accent-bg', p.accentBg);
                  document.body.style.setProperty('--accent-text', p.accentText);
                  document.body.style.setProperty('--control-bg', p.controlBg);
                  document.body.style.setProperty('--control-text', p.controlText);
                  document.body.style.setProperty('--control-border', p.controlBorder);
                  localStorage.setItem('udn_theme','custom');
                }}>Apply saved</button>
                <button className="px-2 py-1 text-xs border rounded" onClick={()=> setTheme && setTheme('light')}>Reset</button>
              </div>
            </div>
            )}
          </div>
          {/* Modes collapsible */}
          <div>
            <button className="w-full flex items-center justify-between py-1" onClick={()=>setOpenModes(v=>!v)}>
              <div className="text-base font-medium">Modes</div>
              <ChevronDown className={`w-4 h-4 transition-transform ${openModes ? 'rotate-180' : ''}`} />
            </button>
            {openModes && (
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-2"><input type="checkbox" checked={faithModeEnabled} onChange={(e)=>setFaithModeEnabled(e.target.checked)} /> Faith mode (show Anchors)</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={sabbathMode} onChange={(e)=>setSabbathMode(e.target.checked)} /> Sabbath mode (calm visuals)</label>
            </div>
            )}
          </div>
          {/* Sync collapsible */}
          <div>
            <button className="w-full flex items-center justify-between py-1" onClick={()=>setOpenSync(v=>!v)}>
              <div className="text-base font-medium">Sync status</div>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSync ? 'rotate-180' : ''}`} />
            </button>
            {openSync && (
            <div className="mt-2 flex items-center gap-3">
              {(['synced','pending','offline'] as const).map(s => (
                <label key={s} className="flex items-center gap-1">
                  <input type="radio" name="syncstate" checked={syncState===s} onChange={()=>setSyncState(s)} />
                  <span className="capitalize">{s}</span>
                </label>
              ))}
            </div>
            )}
          </div>
          {/* Data collapsible */}
          {onResetDemo && (
            <div>
              <button className="w-full flex items-center justify-between py-1" onClick={()=>setOpenData(v=>!v)}>
                <div className="text-base font-medium">Data</div>
                <ChevronDown className={`w-4 h-4 transition-transform ${openData ? 'rotate-180' : ''}`} />
              </button>
              {openData && (
              <div className="mt-2">
                <button className="text-sm px-3 py-2 border rounded-md" onClick={onResetDemo}>Reset demo data</button>
              </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;

