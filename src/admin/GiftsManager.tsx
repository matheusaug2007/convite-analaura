import { FormEvent, useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { DEFAULT_PIX_CONFIG, PixConfig, fetchPixConfig, savePixConfig } from '../lib/giftsApi';
import { PHONE_ERROR, formatPhone, isValidPhone } from '../lib/phone';

const CARD = 'rounded-3xl border border-white/60 bg-white/80 shadow-sm shadow-stone-200/50 backdrop-blur-md';

/** Configuração do PIX exibido na seção "Sugestões de presentes". */
export default function GiftsManager() {
  const [pix, setPix] = useState<PixConfig>(DEFAULT_PIX_CONFIG);
  const [loading, setLoading] = useState(true);
  const [whatsappTouched, setWhatsappTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetchPixConfig().then((p) => {
      setPix({ ...p, whatsapp: formatPhone(p.whatsapp) });
      setLoading(false);
    });
  }, []);

  // WhatsApp é opcional: só é inválido se estiver preenchido errado
  const whatsappInvalid = whatsappTouched && pix.whatsapp !== '' && !isValidPhone(pix.whatsapp);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (pix.whatsapp !== '' && !isValidPhone(pix.whatsapp)) {
      setWhatsappTouched(true);
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const { remote } = await savePixConfig(pix);
      setMsg(
        remote
          ? { ok: true, text: 'Chave PIX salva! Já aparece na seção de presentes do convite.' }
          : { ok: false, text: 'Salvo neste aparelho. Rode supabase/site_settings.sql para publicar.' },
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader2 className="mx-auto mt-16 animate-spin text-terracota" size={32} />;
  }

  return (
    <div className="mt-4 pb-12 sm:mt-6">
      <form onSubmit={handleSave} className={`${CARD} space-y-3 p-4 sm:space-y-4 sm:p-5`}>
        <div>
          <h2 className="text-base font-bold text-nude sm:text-lg">Chave PIX</h2>
          <p className="text-xs font-light text-legenda">
            Aparece na seção &ldquo;Sugestões de presentes&rdquo;. O convidado copia com 1 toque.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-tinta">
              Chave PIX (Telefone, E-mail, CPF ou Aleatória)
            </label>
            <input
              className="input font-mono !text-xs sm:!text-sm"
              required
              placeholder="Ex: 44999999999 ou seu@email.com"
              value={pix.pixKey}
              onChange={(e) => setPix({ ...pix, pixKey: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-tinta">Nome do titular da conta</label>
            <input
              className="input !text-xs sm:!text-sm"
              required
              placeholder="Ex: Ana Laura Martins"
              value={pix.holderName}
              onChange={(e) => setPix({ ...pix, holderName: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-tinta">Cidade do titular</label>
            <input
              className="input !text-xs sm:!text-sm"
              placeholder="Mandaguari - PR"
              value={pix.city}
              onChange={(e) => setPix({ ...pix, city: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-tinta">
              WhatsApp para recados (opcional)
            </label>
            <input
              className={`input !text-xs sm:!text-sm ${whatsappInvalid ? '!border-rosa focus:!ring-rosa/30' : ''}`}
              type="tel"
              inputMode="numeric"
              maxLength={15}
              placeholder="(44) 99999-9999"
              aria-invalid={whatsappInvalid}
              value={pix.whatsapp}
              onChange={(e) => setPix({ ...pix, whatsapp: formatPhone(e.target.value) })}
              onBlur={() => setWhatsappTouched(true)}
            />
            {whatsappInvalid && <p className="mt-1 text-[11px] text-[#B25E52]">{PHONE_ERROR}</p>}
          </div>
        </div>

        {msg && (
          <p className={`rounded-2xl px-3 py-2 text-xs ${msg.ok ? 'bg-[#E4ECE1] text-[#4F6B4A]' : 'bg-[#F6E3DE] text-[#A8604F]'}`}>
            {msg.text}
          </p>
        )}

        <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar
        </button>
      </form>
    </div>
  );
}
