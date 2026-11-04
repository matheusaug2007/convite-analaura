import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Download,
  Gift,
  Loader2,
  Lock,
  LogOut,
  Palette,
  Search,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import {
  RsvpRow,
  exportRsvpCsv,
  fetchRsvps,
  hasSession,
  login,
  logout,
  needsEmail,
  subscribeChanges,
} from '../lib/adminApi';
import { isSupabaseConfigured } from '../lib/supabase';
import ThemeEditor from './ThemeEditor';
import GiftsManager from './GiftsManager';
import ContinuousTabs from './ContinuousTabs';

const CARD = 'rounded-3xl border border-white/60 bg-white/85 shadow-sm shadow-stone-200/50 backdrop-blur-md';

const fmt = (d: string) =>
  new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

const waLink = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits.length <= 11 ? '55' + digits : digits}`;
};

function WhatsAppIcon({ size = 15 }: { size?: number }) {
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={submit} className={`${CARD} w-full max-w-sm space-y-4 p-6 text-center sm:p-8`}>
        <Lock className="mx-auto text-terracota" size={28} />
        <h1 className="font-display text-xl font-bold text-nude sm:text-2xl">Painel da Ana Laura</h1>
        <p className="text-xs font-light text-legenda">Acesso restrito à aniversariante e família</p>
        {needsEmail && (
          <input
            className="input !text-xs"
            type="email"
            required
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <input
          className="input !text-xs"
          type="password"
          required
          placeholder="Senha de acesso"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-xs text-rosa">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : 'Entrar no painel'}
        </button>
        {!isSupabaseConfigured && (
          <p className="text-[10px] font-light text-legenda">Modo demonstração: senha padrão em VITE_ADMIN_PASSWORD.</p>
        )}
      </form>
    </div>
  );
}

function StatCard({ icon, label, value, iconBg }: { icon: ReactNode; label: string; value: number; iconBg: string }) {
  return (
    <div className={`${CARD} flex items-center gap-3 p-3.5 sm:p-4`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xl font-bold leading-none text-tinta sm:text-2xl">{value}</p>
        <p className="mt-1 line-clamp-1 text-[11px] font-light text-legenda sm:text-xs">{label}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: RsvpRow['status'] }) {
  const ok = status === 'confirmed';
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
        ok ? 'bg-[#E4ECE1] text-[#4F6B4A]' : 'bg-[#F6E3DE] text-[#A8604F]'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-salvia' : 'bg-rosa'}`} />
      {ok ? 'Confirmado' : 'Não vai'}
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
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E4ECE1] text-[#4F6B4A] transition hover:bg-salvia hover:text-white"
    >
      <WhatsAppIcon size={14} />
    </a>
  );
}

function Phone({ phone }: { phone: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-xs text-tinta">{phone}</span>
      <WaButton phone={phone} />
    </span>
  );
}

function CompanionBadges({ r }: { r: RsvpRow }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-tinta">{r.number_of_companions}</span>
      {r.companion_names?.length ? (
        <div className="flex flex-wrap gap-1">
          {r.companion_names.map((n, i) => (
            <span key={i} className="rounded-full bg-[#ECE8F1] px-2 py-0.5 text-[10px] text-[#6D6283]">
              {n}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const TABS = [
  { id: 'dados', label: 'RSVP', fullLabel: 'Confirmações (RSVP)', icon: Users },
  { id: 'presentes', label: 'Presentes', fullLabel: 'Presentes & PIX', icon: Gift },
  { id: 'cores', label: 'Cores', fullLabel: 'Personalização de Cores', icon: Palette },
] as const;

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'dados' | 'presentes' | 'cores'>('dados');

  const load = useCallback(async () => {
    try {
      const r = await fetchRsvps();
      setRsvps(r);
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
    };
  }, [rsvps]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? rsvps.filter((r) => r.guest_name.toLowerCase().includes(q)) : rsvps;
  }, [rsvps, search]);

  return (
    <div className="mx-auto max-w-5xl px-3 py-4 sm:px-6 sm:py-6">
      {/* Cabeçalho Responsivo */}
      <header className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="truncate font-display text-lg font-bold text-terracota sm:text-2xl">
            Painel • Ana Laura 15 anos
          </h1>
          <p className="text-[11px] font-light text-legenda sm:text-xs">Atualização em tempo real</p>
        </div>
        <button onClick={onLogout} className="btn-outline shrink-0 !px-3 !py-1.5 !text-xs">
          <LogOut size={13} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </header>

      {error && <p className={`${CARD} mt-3 p-3 text-center text-xs text-nude`}>{error}</p>}

      {/* Navegação por Abas 100% Responsiva no Celular */}
      <ContinuousTabs tabs={TABS} value={tab} onChange={setTab} />

      {/* Conteúdo da Aba */}
      {tab === 'presentes' ? (
        <GiftsManager />
      ) : tab === 'cores' ? (
        <ThemeEditor />
      ) : loading ? (
        <Loader2 className="mx-auto mt-16 animate-spin text-terracota" size={32} />
      ) : (
        <div className="mt-5 space-y-6 pb-12">
          {/* Métricas Principais (lado a lado no mobile) */}
          <section className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <StatCard
              icon={<UserCheck size={20} className="text-[#5F7A5A]" />}
              iconBg="bg-[#E4ECE1]"
              label="Confirmadas"
              value={stats.people}
            />
            <StatCard
              icon={<UserX size={20} className="text-[#B9775E]" />}
              iconBg="bg-[#F5E4DA]"
              label="Não vão"
              value={stats.declined}
            />
          </section>

          {/* Lista de Confirmações */}
          <section className="space-y-3">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-base font-bold text-nude sm:text-xl">
                Convidados ({rsvps.length})
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1 sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-legenda" size={14} />
                  <input
                    className="input !py-2 !pl-8 !text-xs"
                    placeholder="Buscar nome..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button
                  className="btn-primary shrink-0 !px-3.5 !py-2 !text-xs"
                  onClick={() => exportRsvpCsv(filtered)}
                  disabled={!filtered.length}
                >
                  <Download size={13} />
                  <span className="hidden sm:inline">Exportar</span> CSV
                </button>
              </div>
            </div>

            {/* Visualização Mobile: Cartões Limpos */}
            <ul className="space-y-2.5 md:hidden">
              {filtered.map((r) => (
                <li key={r.id} className={`${CARD} p-3.5 text-xs`}>
                  <div className="flex items-start justify-between gap-2">
                    <strong className="text-sm font-semibold text-tinta">{r.guest_name}</strong>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-stone-200/50 pt-2 text-legenda">
                    <Phone phone={r.phone} />
                    <span>{fmt(r.confirmed_at ?? r.created_at)}</span>
                  </div>
                  {r.number_of_companions > 0 && (
                    <div className="mt-2 rounded-xl bg-white/70 p-2">
                      <p className="text-[11px] font-medium text-tinta">
                        Acompanhantes ({r.number_of_companions}):
                      </p>
                      {r.companion_names?.length ? (
                        <p className="mt-0.5 text-[11px] text-legenda">{r.companion_names.join(', ')}</p>
                      ) : null}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Visualização Desktop: Tabela */}
            <div className={`${CARD} hidden overflow-hidden md:block`}>
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
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-legenda">
                        {fmt(r.confirmed_at ?? r.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <p className="mt-6 text-center text-xs font-light text-legenda">Nenhum convidado encontrado.</p>
            )}
          </section>
        </div>
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
