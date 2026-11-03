import { useEffect, useState } from 'react';
import { Check, Loader2, RotateCcw, Save } from 'lucide-react';
import { DEFAULT_THEME, ThemeColors, applyTheme, getCurrentTheme, isHex, saveTheme } from '../lib/theme';

const FIELDS: { key: keyof ThemeColors; label: string; hint: string }[] = [
  { key: 'bg', label: 'Cor de fundo principal', hint: 'Papel/linho do convite' },
  { key: 'primary', label: 'Cor primária dos destaques', hint: 'Títulos e numeral 15' },
  { key: 'button', label: 'Cor dos botões de ação', hint: 'Confirmar presença, Enviar' },
  { key: 'text2', label: 'Cor do texto secundário', hint: 'Legendas e textos de apoio' },
];

const CARD = 'rounded-3xl border border-white/60 bg-white/80 shadow-sm shadow-stone-200/50 backdrop-blur-md';

function ColorField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-stone-200/60 bg-white/70 p-3 transition hover:bg-white sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      {/* Seletor visual de cor com swatch + Título e Dica */}
      <div className="flex min-w-0 items-center gap-3">
        <label
          className="relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-stone-300/80 shadow-xs transition active:scale-95 hover:brightness-105"
          style={{ backgroundColor: isHex(value) ? value : '#C88A6B' }}
          title={`Toque para escolher ${label}`}
        >
          <input
            type="color"
            value={isHex(value) ? value : '#000000'}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            aria-label={label}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-tinta sm:text-sm">{label}</p>
          <p className="text-[11px] font-light text-legenda">{hint}</p>
        </div>
      </div>

      {/* Input de código HEX com tamanho travado e não-quebrável */}
      <div className="flex items-center justify-between gap-2 border-t border-stone-100 pt-2 sm:border-0 sm:pt-0 sm:justify-end">
        <span className="text-[11px] font-medium text-legenda sm:hidden">Código HEX:</span>
        <input
          value={text}
          maxLength={7}
          spellCheck={false}
          onChange={(e) => {
            let v = e.target.value.trim();
            if (v && !v.startsWith('#')) v = '#' + v;
            setText(v);
            if (isHex(v)) onChange(v.toUpperCase());
          }}
          className={`w-24 shrink-0 rounded-xl border bg-white px-2.5 py-1.5 text-center font-mono text-xs uppercase outline-none transition focus:border-stone-400 focus:ring-1 focus:ring-stone-200 ${
            isHex(text) ? 'border-stone-200 text-tinta' : 'border-rosa text-rosa'
          }`}
          aria-label={`${label} (HEX)`}
        />
      </div>
    </div>
  );
}

export default function ThemeEditor() {
  const [colors, setColors] = useState<ThemeColors>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    getCurrentTheme().then((t) => {
      setColors(t);
      setLoading(false);
    });
  }, []);

  // Pré-visualização instantânea em todo o site
  const update = (key: keyof ThemeColors, v: string) => {
    const next = { ...colors, [key]: v };
    setColors(next);
    applyTheme(next);
    setMsg(null);
  };

  const save = async () => {
    setSaving(true);
    try {
      const { remote } = await saveTheme(colors);
      setMsg(
        remote
          ? { ok: true, text: 'Cores salvas! O convite já reflete as mudanças.' }
          : { ok: false, text: 'Salvo só neste aparelho. Para publicar, rode supabase/site_settings.sql e entre com o usuário admin.' },
      );
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    setColors(DEFAULT_THEME);
    applyTheme(DEFAULT_THEME);
    const { remote } = await saveTheme(DEFAULT_THEME);
    setMsg({ ok: remote, text: remote ? 'Paleta original restaurada.' : 'Paleta original restaurada neste aparelho.' });
  };

  if (loading) return <Loader2 className="mx-auto mt-16 animate-spin text-terracota" size={32} />;

  return (
    <div className="mt-4 grid gap-4 pb-12 sm:mt-6 sm:gap-6 md:grid-cols-2">
      {/* Controles de Cores */}
      <section className={`${CARD} space-y-4 p-4 sm:space-y-5 sm:p-5`}>
        <div>
          <h2 className="text-base font-bold text-nude sm:text-xl">Personalização de cores</h2>
          <p className="text-xs font-light text-legenda">Toque no quadrado de cor ou digite o código HEX</p>
        </div>

        <div className="space-y-2.5">
          {FIELDS.map((f) => (
            <ColorField key={f.key} label={f.label} hint={f.hint} value={colors[f.key]} onChange={(v) => update(f.key, v)} />
          ))}
        </div>

        {msg && (
          <p className={`flex items-start gap-2 rounded-2xl px-3 py-2 text-xs sm:text-sm ${msg.ok ? 'bg-[#E4ECE1] text-[#4F6B4A]' : 'bg-[#F6E3DE] text-[#A8604F]'}`}>
            {msg.ok && <Check size={16} className="mt-0.5 shrink-0" />} {msg.text}
          </p>
        )}

        <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
          <button onClick={save} disabled={saving} className="btn-primary w-full">
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar cores
          </button>
          <button onClick={reset} className="btn-outline w-full">
            <RotateCcw size={16} /> Restaurar padrão
          </button>
        </div>
      </section>

      {/* Pré-visualização do Convite */}
      <section className={`${CARD} p-4 sm:p-5`}>
        <h2 className="text-sm font-semibold text-tinta">Pré-visualização do Convite</h2>
        <p className="text-[11px] font-light text-legenda">Veja em tempo real como o convite vai aparecer</p>

        <div
          className="relative mt-3 overflow-hidden rounded-2xl p-5 text-center shadow-inner sm:p-8"
          style={{ backgroundColor: colors.bg }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[length:100%_100%] bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/fundo-floral.jpg')",
              mixBlendMode: 'multiply',
            }}
          />
          <div className="relative z-10">
            <p className="text-[10px] font-medium tracking-[0.25em] sm:text-xs" style={{ color: colors.primary }}>
              venha comemorar
            </p>
            <p className="my-1 text-6xl font-semibold leading-none sm:text-8xl" style={{ color: colors.primary }}>
              15
            </p>
            <p className="font-display text-lg font-medium tracking-widest sm:text-xl" style={{ color: colors.primary }}>
              ANA LAURA
            </p>
            <p className="mt-2 text-xs font-light sm:text-sm" style={{ color: colors.text2 }}>
              Sábado, 26 de dezembro às 19h
              <br className="sm:hidden" /> • Crystal Eventos
            </p>
            <span
              className="mt-4 inline-block rounded-full px-5 py-2 text-xs font-semibold text-white shadow-sm sm:px-6 sm:py-2.5 sm:text-sm"
              style={{ background: colors.button }}
            >
              Confirmar presença
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

