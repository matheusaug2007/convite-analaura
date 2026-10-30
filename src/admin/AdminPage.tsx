import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Download, Eye, EyeOff, Heart, Loader2, LogOut, Lock, MessageCircle, Quote, Search, UserCheck, UserX } from 'lucide-react';
import {
  AdminMessage,
  RsvpRow,
  exportRsvpCsv,
  fetchAllMessages,
  fetchRsvps,
  hasSession,
  login,
  logout,
  needsEmail,
  setMessageApproval,
  subscribeChanges,
} from '../lib/adminApi';
import { isSupabaseConfigured } from '../lib/supabase';

/** Base de card: borda fina semi-transparente + sombra suave. */
const CARD = 'rounded-3xl border border-white/60 bg-white/80 shadow-sm shadow-stone-200/50 backdrop-blur-md';

const fmt = (d: string) => new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const waLink = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits.length <= 11 ? '55' + digits : digits}`;
};

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M12.04 2a9.93 9.93 0 0 0-8.5 15.1L2 22l5.04-1.5A9.94 9.94 0 1 0 12.04 2Zm0 18.1a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3 .88.9-2.92-.2-.31a8.1 8.1 0 1 1 6.73 3.66Zm4.45-6.07c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06a6.6 6.6 0 0 1-1.95-1.2 7.3 7.3 0 0 1-1.35-1.68c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.8-.2-.47-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.1 3.64.57.25 1.02.4 1.37.5.58.18 1.1.16 1.52.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

function Login({ onOk }: { onOk: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(password, email);
      onOk();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={submit} className={`${CARD} w-full max-w-sm space-y-4 p-8 text-center`}>
        <Lock className="mx-auto text-terracota" size={32} />
        <h1 className="font-display text-2xl font-bold text-nude">Painel da Ana Laura</h1>
        <p className="text-sm font-light text-legenda">Acesso restrito à família</p>
        {needsEmail && (
          <input className="input" type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        )}
        <input className="input" type="password" required placeholder="Senha de acesso" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-rosa">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Entrar'}
        </button>
        {!isSupabaseConfigured && (
          <p className="text-[11px] font-light text-legenda">Modo demonstração: senha definida em VITE_ADMIN_PASSWORD.</p>
        )}
      </form>
    </div>
  );
}

function StatCard({ icon, label, value, iconBg }: { icon: ReactNode; label: string; value: number; iconBg: string }) {
  return (
    <div className={`${CARD} flex items-center gap-3 p-4`}>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>{icon}</div>
      <div>
        <p className="text-2xl font-semibold leading-none text-tinta">{value}</p>
        <p className="mt-1 text-xs font-light text-legenda">{label}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: RsvpRow['status'] }) {
  const ok = status === 'confirmed';
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        ok ? 'bg-[#E4ECE1] text-[#4F6B4A]' : 'bg-[#F6E3DE] text-[#A8604F]'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-salvia' : 'bg-rosa'}`} />
      {ok ? 'Confirmado' : 'Não comparece'}
    </span>
  );
}

function WaButton({ phone }: { phone: string }) {
  return (
    <a
      href={waLink(phone)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Abrir WhatsApp de ${phone}`}
      title="Abrir no WhatsApp"
      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E4ECE1] text-[#4F6B4A] transition hover:bg-salvia hover:text-white"
    >
      <WhatsAppIcon size={14} />
    </a>
  );
}

function Phone({ phone }: { phone: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-tinta">{phone}</span>
      <WaButton phone={phone} />
    </span>
  );
}

function CompanionBadges({ r }: { r: RsvpRow }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium text-tinta">{r.number_of_companions}</span>
      {r.companion_names?.length ? (
        <div className="flex flex-wrap gap-1">
          {r.companion_names.map((n, i) => (
            <span key={i} className="rounded-full bg-[#ECE8F1] px-2.5 py-0.5 text-xs text-[#6D6283]">
              {n}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [r, m] = await Promise.all([fetchRsvps(), fetchAllMessages()]);
      setRsvps(r);
      setMessages(m);
      setError('');
    } catch {
      setError('Não foi possível carregar os dados. Confira se o arquivo supabase/admin.sql foi executado.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsub = subscribeChanges(load);
    const poll = setInterval(load, 30000);
    return () => {
      unsub();
      clearInterval(poll);
    };
  }, [load]);

  const stats = useMemo(() => {
    const confirmed = rsvps.filter((r) => r.status === 'confirmed');
    return {
      people: confirmed.reduce((s, r) => s + 1 + r.number_of_companions, 0),
      declined: rsvps.filter((r) => r.status === 'declined').length,
      messages: messages.length,
    };
  }, [rsvps, messages]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? rsvps.filter((r) => r.guest_name.toLowerCase().includes(q)) : rsvps;
  }, [rsvps, search]);

  const moderate = async (id: string, approved: boolean) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_approved: approved } : m)));
    try {
      await setMessageApproval(id, approved);
    } catch {
      setError('Não foi possível atualizar o recado.');
      load();
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-terracota">Painel • Ana Laura 15 anos</h1>
          <p className="text-xs font-light text-legenda">Atualização em tempo real</p>
        </div>
        <button onClick={onLogout} className="btn-outline !px-4 !py-2">
          <LogOut size={16} /> Sair
        </button>
      </header>

      {error && <p className={`${CARD} mt-4 p-3 text-center text-sm text-nude`}>{error}</p>}

      {loading ? (
        <Loader2 className="mx-auto mt-16 animate-spin text-terracota" size={32} />
      ) : (
        <>
          <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard icon={<UserCheck size={22} className="text-[#5F7A5A]" />} iconBg="bg-[#E4ECE1]" label="Pessoas confirmadas" value={stats.people} />
            <StatCard icon={<UserX size={22} className="text-[#B9775E]" />} iconBg="bg-[#F5E4DA]" label="Não comparecem" value={stats.declined} />
            <StatCard icon={<MessageCircle size={22} className="text-[#7F719A]" />} iconBg="bg-[#ECE8F1]" label="Recados no mural" value={stats.messages} />
          </section>

          <section className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-xl font-bold text-nude">Confirmações ({rsvps.length})</h2>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-legenda" size={16} />
                  <input className="input !pl-9" placeholder="Buscar convidado..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <button className="btn-primary !px-4" onClick={() => exportRsvpCsv(filtered)} disabled={!filtered.length}>
                  <Download size={16} /> <span className="hidden sm:inline">Exportar</span> CSV
                </button>
              </div>
            </div>

            {/* Mobile: cartões */}
            <ul className="mt-4 space-y-3 md:hidden">
              {filtered.map((r) => (
                <li key={r.id} className={`${CARD} p-4 text-sm`}>
                  <div className="flex items-start justify-between gap-2">
                    <strong className="text-tinta">{r.guest_name}</strong>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="mt-2">
                    <Phone phone={r.phone} />
                  </div>
                  <div className="mt-3 space-y-2 text-xs text-legenda">
                    <div>
                      <p className="mb-0.5">Acompanhantes</p>
                      <CompanionBadges r={r} />
                    </div>
                    <p>{fmt(r.confirmed_at ?? r.created_at)}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Desktop: tabela */}
            <div className={`${CARD} mt-4 hidden overflow-hidden md:block`}>
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F6EEE6]/70 text-[11px] uppercase tracking-wider text-legenda">
                  <tr>
                    {['Convidado', 'Telefone', 'Status', 'Acompanhantes', 'Data'].map((h) => (
                      <th key={h} className="px-4 py-3 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-terracota/10">
                  {filtered.map((r) => (
                    <tr key={r.id} className="align-middle transition hover:bg-[#FAF6F0]/80">
                      <td className="px-4 py-3 font-semibold text-tinta">{r.guest_name}</td>
                      <td className="px-4 py-3">
                        <Phone phone={r.phone} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3">
                        <CompanionBadges r={r} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-legenda">{fmt(r.confirmed_at ?? r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <p className="mt-6 text-center text-sm font-light text-legenda">Nenhuma confirmação encontrada.</p>}
          </section>

          <section className="mt-10 pb-10">
            <h2 className="font-display text-xl font-bold text-nude">Mural de recados ({messages.length})</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className={`relative flex flex-col rounded-2xl border border-white/60 bg-gradient-to-br from-white to-[#FBF3EC] p-5 shadow-sm shadow-stone-200/50 transition ${
                    m.is_approved ? '' : 'opacity-60'
                  }`}
                >
                  <Quote className="absolute left-4 top-4 text-terracota/25" size={26} />
                  <button
                    onClick={() => moderate(m.id, !m.is_approved)}
                    title={m.is_approved ? 'Ocultar do mural' : 'Aprovar no mural'}
                    aria-label={m.is_approved ? 'Ocultar recado' : 'Aprovar recado'}
                    className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-legenda transition hover:bg-terracota/10 hover:text-nude"
                  >
                    {m.is_approved ? <EyeOff size={13} /> : <Eye size={13} />}
                    {m.is_approved ? 'Ocultar' : 'Aprovar'}
                  </button>
                  <p className="mt-6 flex-1 break-words font-display text-base font-medium leading-relaxed text-tinta">{m.message}</p>
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-terracota/15 pt-3 text-xs text-legenda">
                    <span>
                      <strong className="font-semibold text-terracota">{m.author_name}</strong> • {fmt(m.created_at)}
                    </span>
                    <span className={m.is_approved ? 'text-[#5F7A5A]' : 'text-[#B25E52]'}>{m.is_approved ? 'Visível' : 'Oculto'}</span>
                  </div>
                </li>
              ))}
              {messages.length === 0 && (
                <li className="flex items-center justify-center gap-2 text-sm font-light text-legenda sm:col-span-2">
                  <Heart size={14} /> Nenhum recado ainda.
                </li>
              )}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [state, setState] = useState<'checking' | 'out' | 'in'>('checking');

  useEffect(() => {
    hasSession().then((ok) => setState(ok ? 'in' : 'out'));
  }, []);

  if (state === 'checking') return <Loader2 className="mx-auto mt-24 animate-spin text-terracota" size={32} />;
  if (state === 'out') return <Login onOk={() => setState('in')} />;
  return (
    <Dashboard
      onLogout={async () => {
        await logout();
        setState('out');
      }}
    />
  );
}
