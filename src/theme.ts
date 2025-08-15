export type ThemeName = 'light' | 'warm' | 'dark' | 'custom';

export type ThemePalette = {
  appBg: string;
  text: string;
  cardBg: string;
  cardBorder: string;
  pillBg: string;
  accentBg: string;
  accentText: string;
  controlBg: string;
  controlText: string;
  controlBorder: string;
};

export const defaultPalettes: Record<Exclude<ThemeName, 'custom'>, ThemePalette> = {
  light: {
    appBg: '#F2F2F7',
    text: '#111827',
    cardBg: '#FFFFFF',
    cardBorder: '#E5E5EA',
    pillBg: '#F2F2F7',
    accentBg: '#FFFFFF',
    accentText: '#111827',
    controlBg: '#F2F2F7',
    controlText: '#111827',
    controlBorder: '#E5E5EA'
  },
  warm: {
    appBg: '#fffaf4',
    text: '#2b2a28',
    cardBg: '#fff7ed',
    cardBorder: '#f5e0c3',
    pillBg: '#f9efe3',
    accentBg: '#fff7ed',
    accentText: '#2b2a28',
    controlBg: '#ffffff',
    controlText: '#3f3f46',
    controlBorder: 'rgba(0,0,0,0.10)'
  },
  dark: {
    appBg: '#000000',
    text: '#E5E7EB',
    cardBg: '#1C1C1E',
    cardBorder: '#2C2C2E',
    pillBg: '#2C2C2E',
    accentBg: '#1C1C1E',
    accentText: '#E5E7EB',
    controlBg: '#0B0B0C',
    controlText: '#E5E7EB',
    controlBorder: '#38383A'
  }
};

const SELECTION_KEY = 'udn_theme';
const CUSTOM_KEY = 'udn_theme_custom';

export const getStoredThemeName = (): ThemeName => {
  const raw = (localStorage.getItem(SELECTION_KEY) as string) || 'light';
  return (raw === 'dim' ? 'dark' : raw) as ThemeName;
};
export const setStoredThemeName = (name: ThemeName) => localStorage.setItem(SELECTION_KEY, name);

export const getStoredCustomPalette = (): ThemePalette | null => {
  try { const raw = localStorage.getItem(CUSTOM_KEY); return raw ? JSON.parse(raw) as ThemePalette : null; } catch { return null; }
};
export const setStoredCustomPalette = (p: ThemePalette) => localStorage.setItem(CUSTOM_KEY, JSON.stringify(p));

export function applyPalette(p: ThemePalette, name: ThemeName) {
  const b = document.body;
  b.setAttribute('data-theme', name);
  // Clear any stale inline vars first
  const keys = ['--app-bg','--text','--card-bg','--card-border','--pill-bg','--accent-bg','--accent-text','--control-bg','--control-text','--control-border'];
  keys.forEach(k=>b.style.removeProperty(k));
  b.style.setProperty('--app-bg', p.appBg);
  b.style.setProperty('--text', p.text);
  b.style.setProperty('--card-bg', p.cardBg);
  b.style.setProperty('--card-border', p.cardBorder);
  b.style.setProperty('--pill-bg', p.pillBg);
  b.style.setProperty('--accent-bg', p.accentBg);
  b.style.setProperty('--accent-text', p.accentText);
  b.style.setProperty('--control-bg', p.controlBg);
  b.style.setProperty('--control-text', p.controlText);
  b.style.setProperty('--control-border', p.controlBorder);
  // Force reflow to ensure CSS vars apply instantly across components
  void b.offsetHeight;
}

export function applyThemeName(name: ThemeName) {
  if (name === 'custom') {
    const p = getStoredCustomPalette();
    if (p) applyPalette(p, 'custom');
    else applyPalette(defaultPalettes.light, 'light');
  } else {
    applyPalette(defaultPalettes[name], name);
  }
  setStoredThemeName(name);
}

export function applyCustomAndSave(p: ThemePalette) {
  setStoredCustomPalette(p);
  setStoredThemeName('custom');
  applyPalette(p, 'custom');
}

