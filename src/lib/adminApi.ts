import { LS_MESSAGES, LS_RSVP, isSupabaseConfigured, supabase } from './supabase';

export interface RsvpRow {
  id: string;
  created_at: string;
  guest_name: string;
  phone: string;
  status: 'confirmed' | 'declined';
  number_of_companions: number;
  companion_names: string[] | null;
  dietary_restrictions: string | null;
  confirmed_at: string | null;
}

export interface AdminMessage {
  id: string;
  created_at: string;
  author_name: string;
  message: string;
  is_approved: boolean;
}

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;
const ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || 'admin15';
const DEMO_FLAG = 'convite_admin_demo_ok';

function local<T>(k: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(k) ?? '[]') as T[];
  } catch {
    return [];
  }
}

/** Modo Supabase: login real via Supabase Auth. Modo demo: senha local. */
export async function hasSession(): Promise<boolean> {
  if (!supabase) return sessionStorage.getItem(DEMO_FLAG) === '1';
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

export async function login(password: string, email?: string): Promise<void> {
  if (!supabase) {
    if (password !== ADMIN_PASSWORD) throw new Error('Senha incorreta.');
    sessionStorage.setItem(DEMO_FLAG, '1');
    return;
  }
  const mail = (ADMIN_EMAIL || email || '').trim();
  const { error } = await supabase.auth.signInWithPassword({ email: mail, password });
  if (error) throw new Error('E-mail ou senha incorretos.');
}

export async function logout() {
  sessionStorage.removeItem(DEMO_FLAG);
  if (supabase) await supabase.auth.signOut();
}

/** Precisa pedir e-mail na tela? (somente com Supabase e sem VITE_ADMIN_EMAIL) */
export const needsEmail = isSupabaseConfigured && !ADMIN_EMAIL;

export async function fetchRsvps(): Promise<RsvpRow[]> {
  if (!supabase) {
    return local<Omit<RsvpRow, 'id' | 'created_at' | 'confirmed_at'>>(LS_RSVP).map((r, i) => ({
      ...r,
      id: String(i),
      created_at: new Date().toISOString(),
      confirmed_at: null,
      dietary_restrictions: r.dietary_restrictions ?? null,
      companion_names: r.companion_names ?? null,
    }));
  }
  const { data, error } = await supabase.from('rsvp_guests').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as RsvpRow[];
}

export async function fetchAllMessages(): Promise<AdminMessage[]> {
  if (!supabase) {
    return local<Partial<AdminMessage>>(LS_MESSAGES)
      .map((m) => ({ ...m, is_approved: m.is_approved ?? true }) as AdminMessage)
      .reverse();
  }
  const { data, error } = await supabase.from('guestbook_messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as AdminMessage[];
}

export async function setMessageApproval(id: string, is_approved: boolean) {
  if (!supabase) {
    const list = local<AdminMessage>(LS_MESSAGES).map((m) => (m.id === id ? { ...m, is_approved } : m));
    localStorage.setItem(LS_MESSAGES, JSON.stringify(list));
    return;
  }
  const { error } = await supabase.from('guestbook_messages').update({ is_approved }).eq('id', id);
  if (error) throw error;
}

/** Tempo real: escuta mudanças e chama o callback. Retorna função de limpeza. */
export function subscribeChanges(onChange: () => void): () => void {
  if (!supabase) return () => {};
  const channel = supabase
    .channel('admin-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvp_guests' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'guestbook_messages' }, onChange)
    .subscribe();
  return () => {
    supabase!.removeChannel(channel);
  };
}

const csvCell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export function exportRsvpCsv(rows: RsvpRow[]) {
  const header = ['Nome', 'Telefone', 'Status', 'Acompanhantes', 'Nomes dos acompanhantes', 'Data'];
  const lines = rows.map((r) =>
    [
      r.guest_name,
      r.phone,
      r.status === 'confirmed' ? 'Confirmado' : 'Não comparece',
      r.number_of_companions,
      (r.companion_names ?? []).join('; '),
      new Date(r.confirmed_at ?? r.created_at).toLocaleString('pt-BR'),
    ]
      .map(csvCell)
      .join(';'),
  );
  // BOM + ';' para abrir corretamente no Excel em pt-BR
  const blob = new Blob(['\uFEFF' + [header.map(csvCell).join(';'), ...lines].join('\r\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'confirmacoes-ana-laura-15anos.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

