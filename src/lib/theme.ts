import { supabase } from './supabase';

export interface ThemeColors {
  bg: string; // fundo principal
  primary: string; // destaques: títulos e numeral 15
  button: string; // botões de ação
  text2: string; // texto secundário
}

export const DEFAULT_THEME: ThemeColors = {
  bg: '#F7EFE4',
  primary: '#C88A6B',
  button: '#C88A6B',
  text2: '#7B736E',
};

const LS_THEME = 'convite_theme';
export const isHex = (v: string) => /^#[0-9a-fA-F]{6}$/.test(v);

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

function sanitize(t: Partial<ThemeColors> | null | undefined): ThemeColors {
  const out = { ...DEFAULT_THEME };
  (Object.keys(out) as (keyof ThemeColors)[]).forEach((k) => {
    const v = t?.[k];
    if (typeof v === 'string' && isHex(v)) out[k] = v;
  });
  return out;
}

/** Aplica as cores no :root como variáveis CSS (hex + canais RGB para o Tailwind). */
export function applyTheme(t: ThemeColors) {
  const s = document.documentElement.style;
  s.setProperty('--bg-color', t.bg);
  s.setProperty('--primary-color', t.primary);
  s.setProperty('--button-color', t.button);
  s.setProperty('--text-secondary', t.text2);
  s.setProperty('--bg-rgb', rgb(t.bg));
  s.setProperty('--primary-rgb', rgb(t.primary));
  s.setProperty('--button-rgb', rgb(t.button));
  s.setProperty('--text2-rgb', rgb(t.text2));
}

export function loadLocalTheme(): ThemeColors | null {
  try {
    const raw = localStorage.getItem(LS_THEME);
    return raw ? sanitize(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function saveLocalTheme(t: ThemeColors) {
  localStorage.setItem(LS_THEME, JSON.stringify(t));
}

async function fetchRemoteTheme(): Promise<ThemeColors | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'theme').maybeSingle();
  if (error || !data) return null;
  return sanitize(data.value as Partial<ThemeColors>);
}

/** Salva no localStorage (sempre) e no Supabase (se disponível). Retorna se o remoto foi salvo. */
export async function saveTheme(t: ThemeColors): Promise<{ remote: boolean }> {
  saveLocalTheme(t);
  if (!supabase) return { remote: false };
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'theme', value: t, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  return { remote: !error };
}

/** Carrega o tema atual (remoto > local > padrão). */
export async function getCurrentTheme(): Promise<ThemeColors> {
  return (await fetchRemoteTheme()) ?? loadLocalTheme() ?? DEFAULT_THEME;
}

/** Aplica o cache local na hora (sem flash) e depois sincroniza com o Supabase. */
export function initTheme() {
  applyTheme(loadLocalTheme() ?? DEFAULT_THEME);
  fetchRemoteTheme()
    .then((remote) => {
      if (remote) {
        applyTheme(remote);
        saveLocalTheme(remote);
      }
    })
    .catch(() => {});
}

