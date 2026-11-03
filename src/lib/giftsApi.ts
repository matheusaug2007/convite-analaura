import { supabase } from './supabase';

export interface GiftItem {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  emoji?: string | null;
  image_url?: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface GiftContribution {
  id: string;
  created_at: string;
  gift_id?: string | null;
  gift_title: string;
  amount: number;
  giver_name: string;
  message?: string | null;
}

export interface PixConfig {
  pixKey: string;
  holderName: string;
  city: string;
  whatsapp: string;
}

export const DEFAULT_PIX_CONFIG: PixConfig = {
  pixKey: '',
  holderName: 'Ana Laura Martins',
  city: 'MANDAGUARI',
  whatsapp: '',
};

export const DEFAULT_GIFTS: GiftItem[] = [
  {
    id: 'default-1',
    title: 'Dia de Spa & Salão de Beleza',
    description: 'Para relaxar e brilhar ainda mais no grande dia',
    price: 120,
    image_url: null,
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'default-2',
    title: 'Bolsa Tiracolo de Festa',
    description: 'Um acessório especial para guardar recordações',
    price: 150,
    image_url: null,
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'default-3',
    title: 'Perfume Floral Importado',
    description: 'Fragrância doce e inesquecível como os 15 anos',
    price: 180,
    image_url: null,
    is_active: true,
    sort_order: 3,
  },
  {
    id: 'default-4',
    title: 'Ensaio Fotográfico Extra',
    description: 'Mais cliques para eternizar essa fase mágica',
    price: 200,
    image_url: null,
    is_active: true,
    sort_order: 4,
  },
  {
    id: 'default-5',
    title: 'Cota para Viagem dos Sonhos',
    description: 'Ajude a realizar uma viagem inesquecível',
    price: 250,
    image_url: null,
    is_active: true,
    sort_order: 5,
  },
  {
    id: 'default-6',
    title: 'Mimo Carinhoso',
    description: 'Um presente especial para a debutante',
    price: 80,
    image_url: null,
    is_active: true,
    sort_order: 6,
  },
];

const LS_GIFTS = 'convite_gifts_catalog';
const LS_CONTRIBUTIONS = 'convite_gift_contributions';
const LS_PIX = 'convite_pix_config';

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Compacta uma foto selecionada do celular/computador e devolve em Base64 leve (JPEG ~35KB).
 */
export function compressImageFile(file: File, maxWidth = 600, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

// ---- Chave PIX Única do Evento (site_settings key='pix_config' + localStorage) ----

export async function fetchPixConfig(): Promise<PixConfig> {
  const local = readLocal<PixConfig>(LS_PIX, DEFAULT_PIX_CONFIG);
  if (!supabase) return local;
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'pix_config')
      .maybeSingle();
    if (!error && data?.value) {
      const merged = { ...DEFAULT_PIX_CONFIG, ...(data.value as Partial<PixConfig>) };
      localStorage.setItem(LS_PIX, JSON.stringify(merged));
      return merged;
    }
  } catch {
    // fallback local
  }
  return local;
}

export async function savePixConfig(cfg: PixConfig): Promise<{ remote: boolean }> {
  localStorage.setItem(LS_PIX, JSON.stringify(cfg));
  if (!supabase) return { remote: false };
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'pix_config', value: cfg, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  return { remote: !error };
}

// ---- Catálogo de Presentes (gift_items + fallback local) ----

export async function fetchGifts(includeInactive = false): Promise<GiftItem[]> {
  const local = readLocal<GiftItem[]>(LS_GIFTS, DEFAULT_GIFTS);
  if (!supabase) {
    return includeInactive ? local : local.filter((g) => g.is_active);
  }
  try {
    let q = supabase
      .from('gift_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (!includeInactive) q = q.eq('is_active', true);
    const { data, error } = await q;
    if (!error && data && data.length > 0) {
      const items = data.map((row) => ({
        ...row,
        price: Number(row.price),
      })) as GiftItem[];
      return items;
    }
  } catch {
    // fallback local
  }
  return includeInactive ? local : local.filter((g) => g.is_active);
}

export async function createGift(item: Omit<GiftItem, 'id' | 'sort_order'>): Promise<void> {
  const local = readLocal<GiftItem[]>(LS_GIFTS, DEFAULT_GIFTS);
  const newItem: GiftItem = {
    ...item,
    id: crypto.randomUUID(),
    sort_order: local.length + 1,
  };
  localStorage.setItem(LS_GIFTS, JSON.stringify([...local, newItem]));

  if (!supabase) return;
  const { error } = await supabase.from('gift_items').insert([
    {
      title: item.title,
      description: item.description || null,
      price: item.price,
      emoji: '🎁',
      image_url: item.image_url || null,
      is_active: item.is_active,
      sort_order: local.length + 1,
    },
  ]);
  if (error) throw error;
}

export async function updateGift(id: string, patch: Partial<GiftItem>): Promise<void> {
  const local = readLocal<GiftItem[]>(LS_GIFTS, DEFAULT_GIFTS).map((g) => (g.id === id ? { ...g, ...patch } : g));
  localStorage.setItem(LS_GIFTS, JSON.stringify(local));

  if (!supabase || id.startsWith('default-')) return;
  const { error } = await supabase.from('gift_items').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteGift(id: string): Promise<void> {
  const local = readLocal<GiftItem[]>(LS_GIFTS, DEFAULT_GIFTS).filter((g) => g.id !== id);
  localStorage.setItem(LS_GIFTS, JSON.stringify(local));

  if (!supabase || id.startsWith('default-')) return;
  const { error } = await supabase.from('gift_items').delete().eq('id', id);
  if (error) throw error;
}

// ---- Contribuições / Presentes Avisados ----

export async function submitGiftContribution(payload: {
  gift_id?: string;
  gift_title: string;
  amount: number;
  giver_name: string;
  message?: string;
}): Promise<void> {
  const local = readLocal<GiftContribution[]>(LS_CONTRIBUTIONS, []);
  const entry: GiftContribution = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    gift_id: payload.gift_id ?? null,
    gift_title: payload.gift_title,
    amount: payload.amount,
    giver_name: payload.giver_name,
    message: payload.message ?? null,
  };
  localStorage.setItem(LS_CONTRIBUTIONS, JSON.stringify([entry, ...local]));

  if (!supabase) return;
  const isUuid = payload.gift_id && !payload.gift_id.startsWith('default-');
  await supabase.from('gift_contributions').insert([
    {
      gift_id: isUuid ? payload.gift_id : null,
      gift_title: payload.gift_title,
      amount: payload.amount,
      giver_name: payload.giver_name,
      message: payload.message || null,
    },
  ]);
}

export async function fetchGiftContributions(): Promise<GiftContribution[]> {
  const local = readLocal<GiftContribution[]>(LS_CONTRIBUTIONS, []);
  if (!supabase) return local;
  try {
    const { data, error } = await supabase
      .from('gift_contributions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      return data.map((r) => ({ ...r, amount: Number(r.amount) })) as GiftContribution[];
    }
  } catch {
    // fallback local
  }
  return local;
}
