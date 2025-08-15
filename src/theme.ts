export type ThemeName = 'light' | 'warm' | 'dim' | 'custom';

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
    appBg: '#f2f5f7',
    text: '#0f172a',
    cardBg: '#ffffff',
    cardBorder: '#e5e7eb',
    pillBg: '#f1f5f9',
    accentBg: '#b8403b',
    accentText: '#ffffff',
    controlBg: '#ffffff',
    controlText: '#1f2937',
    controlBorder: 'rgba(0,0,0,0.12)'
  },
  warm: {
    appBg: '#fffaf4',
    text: '#2b2a28',
    cardBg: '#fff7ed',
    cardBorder: '#f5e0c3',
    pillBg: '#f9efe3',
    accentBg: '#c2412d',
    accentText: '#fff7ed',
    controlBg: '#ffffff',
    controlText: '#3f3f46',
    controlBorder: 'rgba(0,0,0,0.10)'
  },
  dim: {
    appBg: '#0f1115',
    text: '#e5e7eb',
    cardBg: '#161a1d',
    cardBorder: '#2a3036',
    pillBg: '#1f2429',
    accentBg: '#334155',
    accentText: '#e2e8f0',
    controlBg: '#0b1220',
    controlText: '#e2e8f0',
    controlBorder: 'rgba(148,163,184,0.35)'
  }
};

const SELECTION_KEY = 'udn_theme';
const CUSTOM_KEY = 'udn_theme_custom';

export const getStoredThemeName = (): ThemeName => (localStorage.getItem(SELECTION_KEY) as ThemeName) || 'light';
export const setStoredThemeName = (name: ThemeName) => localStorage.setItem(SELECTION_KEY, name);

export const getStoredCustomPalette = (): ThemePalette | null => {
  try { const raw = localStorage.getItem(CUSTOM_KEY); return raw ? JSON.parse(raw) as ThemePalette : null; } catch { return null; }
};
export const setStoredCustomPalette = (p: ThemePalette) => localStorage.setItem(CUSTOM_KEY, JSON.stringify(p));

export function applyPalette(p: ThemePalette, name: ThemeName) {
  const b = document.body;
  b.setAttribute('data-theme', name);
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

