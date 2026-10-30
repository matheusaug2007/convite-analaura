import { createClient } from '@supabase/supabase-js';
import type { GuestbookMessage, RsvpPayload } from '../types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True quando as variáveis de ambiente reais foram preenchidas. */
export const isSupabaseConfigured =
  !!url && !!key && !url.includes('seu-projeto') && !key.includes('sua-chave');

export const supabase = isSupabaseConfigured ? createClient(url!, key!) : null;

// ---- Fallback amigável (modo demonstração, salvo apenas no navegador) ----
export const LS_MESSAGES = 'convite_demo_messages';
export const LS_RSVP = 'convite_demo_rsvp';

function readLocal<T>(k: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(k) ?? '[]') as T[];
  } catch {
    return [];
  }
}

export async function submitRsvp(payload: RsvpPayload) {
  if (!supabase) {
    const list = readLocal<RsvpPayload>(LS_RSVP);
    localStorage.setItem(LS_RSVP, JSON.stringify([...list, payload]));
    return;
  }
  const { error } = await supabase.from('rsvp_guests').insert([payload]);
  if (error) throw error;
}

export async function fetchMessages(): Promise<GuestbookMessage[]> {
  if (!supabase) return readLocal<GuestbookMessage>(LS_MESSAGES).reverse();
  const { data, error } = await supabase
    .from('guestbook_messages')
    .select('id, created_at, author_name, message')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data as GuestbookMessage[];
}

export async function submitMessage(author_name: string, message: string) {
  if (!supabase) {
    const list = readLocal<GuestbookMessage>(LS_MESSAGES);
    const item: GuestbookMessage = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      author_name,
      message,
    };
    localStorage.setItem(LS_MESSAGES, JSON.stringify([...list, item]));
    return;
  }
  const { error } = await supabase.from('guestbook_messages').insert([{ author_name, message }]);
  if (error) throw error;
}

