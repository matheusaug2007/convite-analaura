import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { Check, ChevronDown, ChevronUp, Copy, Gift, Heart, Loader2, X } from 'lucide-react';
import {
  DEFAULT_PIX_CONFIG,
  GiftItem,
  PixConfig,
  fetchGifts,
  fetchPixConfig,
  formatBRL,
  submitGiftContribution,
} from '../lib/giftsApi';

function fireGiftConfetti() {
  const colors = ['#C88A6B', '#E8A598', '#A599B5', '#8EA08A', '#FFFFFF'];
  confetti({ particleCount: 90, spread: 70, origin: { y: 0.65 }, colors });
}

type PriceFilter = 'all' | 'under100' | '100to200' | 'above200';
const INITIAL_VISIBLE_COUNT = 4;

export default function GiftsSection() {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [pixConfig, setPixConfig] = useState<PixConfig>(DEFAULT_PIX_CONFIG);
  const [selected, setSelected] = useState<GiftItem | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [giverName, setGiverName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentDone, setSentDone] = useState(false);

  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchGifts(false).then(setGifts);
    fetchPixConfig().then(setPixConfig);
  }, []);

  // Trava a rolagem da página quando o modal do PIX estiver aberto
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selected]);

  const filteredGifts = useMemo(() => {
    return gifts.filter((g) => {
      if (priceFilter === 'under100') return g.price <= 100;
      if (priceFilter === '100to200') return g.price > 100 && g.price <= 200;
      if (priceFilter === 'above200') return g.price > 200;
      return true;
    });
  }, [gifts, priceFilter]);

  const visibleGifts = useMemo(() => {
    if (isExpanded || filteredGifts.length <= INITIAL_VISIBLE_COUNT) {
      return filteredGifts;
    }
    return filteredGifts.slice(0, INITIAL_VISIBLE_COUNT);
  }, [filteredGifts, isExpanded]);

  const openModal = (g: GiftItem) => {
    setSelected(g);
    setCopiedKey(false);
    setSentDone(false);
  };

  const closeModal = () => {
    setSelected(null);
    setSentDone(false);
  };

  const copyPixKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 3000);
    } catch {
      // fallback
    }
  };

  const handleConfirmPix = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected || !giverName.trim()) return;
    setSending(true);
    try {
      await submitGiftContribution({
        gift_id: selected.id,
        gift_title: selected.title,
        amount: selected.price,
        giver_name: giverName.trim(),
        message: message.trim() || undefined,
      });
      setSentDone(true);
      fireGiftConfetti();
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="presentes" className="relative z-10 px-6 py-12">
      <h2 className="section-title">Lista de presentes</h2>
      <p className="mt-1 text-center text-xs font-light text-legenda">
        Escolha um presente para a Ana Laura e contribua via PIX 🌸
      </p>

      {/* Pílulas de filtro por faixa de valor */}
      {gifts.length > 4 && (
        <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'under100', label: 'Até R$ 100' },
            { id: '100to200', label: 'R$ 100 – 200' },
            { id: 'above200', label: 'R$ 200+' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setPriceFilter(f.id as PriceFilter);
                setIsExpanded(false);
              }}
              className={`rounded-full px-3 py-1.5 font-medium transition ${
                priceFilter === f.id
                  ? 'bg-terracota text-white shadow-xs'
                  : 'border border-terracota/20 bg-white/70 text-legenda hover:bg-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Grade de presentes com fotos reais */}
      <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3">
        {visibleGifts.map((g) => (
          <div
            key={g.id}
            className="glass flex flex-col justify-between overflow-hidden p-3 text-center transition hover:-translate-y-0.5"
          >
            <div>
              {g.image_url ? (
                <div className="mx-auto mb-2.5 h-28 w-full overflow-hidden rounded-xl bg-stone-100">
                  <img
                    src={g.image_url}
                    alt={g.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="mx-auto mb-2.5 flex h-20 w-full items-center justify-center rounded-xl bg-[#FBF3EC] text-terracota">
                  <Gift size={26} />
                </div>
              )}
              <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-tinta">{g.title}</h3>
              {g.description && (
                <p className="mt-1 line-clamp-1 text-[10px] font-light text-legenda">{g.description}</p>
              )}
            </div>

            <div className="mt-2.5 pt-1">
              <p className="text-sm font-bold text-terracota">{formatBRL(g.price)}</p>
              <button
                type="button"
                onClick={() => openModal(g)}
                className="btn-primary mt-2 w-full !py-2 !text-[11px]"
              >
                <Gift size={13} /> Presentear via PIX
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botão de expansão */}
      {filteredGifts.length > INITIAL_VISIBLE_COUNT && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-outline !py-2 !text-xs"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={15} /> Mostrar menos presentes
              </>
            ) : (
              <>
                <ChevronDown size={15} /> Ver todos os presentes ({filteredGifts.length} mimos)
              </>
            )}
          </button>
        </div>
      )}

      {/* MODAL 100% OPACO E ISOLADO VIA PORTAL (sem QR Code, apenas PIX limpo) */}
      {selected &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
            onClick={closeModal}
          >
            <div
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/90 bg-[#FAF6F0] p-6 text-center shadow-2xl"
              style={{ backgroundColor: '#FAF6F0' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botão Fechar */}
              <button
                type="button"
                onClick={closeModal}
                aria-label="Fechar"
                className="absolute right-4 top-4 rounded-full p-1.5 text-legenda transition hover:bg-black/5"
              >
                <X size={20} />
              </button>

              {sentDone ? (
                <div className="py-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-salvia text-white">
                    <Check size={28} />
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-nude">Mimo registrado com carinho!</h3>
                  <p className="mt-1 text-xs text-legenda">
                    A Ana Laura e a família agradecem pelo carinho inesquecível! 🌸
                  </p>
                  {pixConfig.whatsapp && (
                    <a
                      href={`https://wa.me/55${pixConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Olá! Acabei de enviar o presente "${selected.title}" (${formatBRL(selected.price)}) via PIX para os 15 anos da Ana Laura! 🌸 — ${giverName}`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline mt-4 w-full !text-xs"
                    >
                      Enviar comprovante no WhatsApp (opcional)
                    </a>
                  )}
                  <button type="button" onClick={closeModal} className="btn-primary mt-3 w-full">
                    Voltar ao convite
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Foto ou Ícone do Presente */}
                  {selected.image_url ? (
                    <img
                      src={selected.image_url}
                      alt={selected.title}
                      className="mx-auto h-24 w-24 rounded-2xl border border-stone-200 object-cover shadow-sm"
                    />
                  ) : (
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-terracota shadow-sm">
                      <Gift size={28} />
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-tinta">{selected.title}</h3>
                    <p className="text-2xl font-extrabold text-terracota">{formatBRL(selected.price)}</p>
                  </div>

                  {/* Bloco de Chave PIX Única */}
                  {pixConfig.pixKey ? (
                    <div className="rounded-2xl border border-stone-200 bg-white p-3.5 text-left">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-legenda">
                        Chave PIX para transferência:
                      </p>
                      <p className="my-1 break-all font-mono text-sm font-bold text-tinta">
                        {pixConfig.pixKey}
                      </p>
                      <p className="text-[11px] text-legenda">
                        Titular: <strong className="text-tinta">{pixConfig.holderName || 'Ana Laura Martins'}</strong>
                        {pixConfig.city && <span> • {pixConfig.city}</span>}
                      </p>

                      <button
                        type="button"
                        onClick={() => copyPixKey(pixConfig.pixKey)}
                        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#E4ECE1] py-2 text-xs font-semibold text-[#4F6B4A] transition hover:bg-salvia hover:text-white"
                      >
                        {copiedKey ? <Check size={14} /> : <Copy size={14} />}
                        {copiedKey ? 'Chave PIX copiada! ✓' : 'Copiar Chave PIX'}
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-terracota/40 bg-white p-3 text-xs text-legenda">
                      A chave PIX será cadastrada pela família no painel <code>/admin</code>.
                    </div>
                  )}

                  {/* Formulário de Notificação à Debutante */}
                  <form onSubmit={handleConfirmPix} className="space-y-2.5 pt-1 text-left">
                    <label className="block text-xs font-medium text-tinta">
                      Após fazer o PIX, diga quem enviou o presente:
                    </label>
                    <input
                      className="input !py-2.5 !text-xs"
                      required
                      placeholder="Seu nome (ou nome da família)"
                      value={giverName}
                      onChange={(e) => setGiverName(e.target.value)}
                    />
                    <input
                      className="input !py-2.5 !text-xs"
                      placeholder="Mensagem carinhosa junto ao presente (opcional)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type="submit" disabled={sending} className="btn-primary w-full !py-2.5">
                      {sending ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <>
                          <Heart size={15} /> Já fiz o PIX! Avisar Ana Laura
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
