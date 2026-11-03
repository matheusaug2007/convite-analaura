import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import {
  Check,
  Eye,
  EyeOff,
  Gift,
  ImageIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  DEFAULT_PIX_CONFIG,
  GiftContribution,
  GiftItem,
  PixConfig,
  compressImageFile,
  createGift,
  deleteGift,
  fetchGiftContributions,
  fetchGifts,
  fetchPixConfig,
  formatBRL,
  savePixConfig,
  updateGift,
} from '../lib/giftsApi';

const CARD = 'rounded-3xl border border-white/60 bg-white/80 shadow-sm shadow-stone-200/50 backdrop-blur-md';

export default function GiftsManager() {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [contributions, setContributions] = useState<GiftContribution[]>([]);
  const [pix, setPix] = useState<PixConfig>(DEFAULT_PIX_CONFIG);
  const [loading, setLoading] = useState(true);
  const [savingPix, setSavingPix] = useState(false);
  const [pixMsg, setPixMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Novo presente (sem emoji, com upload de foto real)
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const [compressing, setCompressing] = useState(false);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const [g, c, p] = await Promise.all([fetchGifts(true), fetchGiftContributions(), fetchPixConfig()]);
    setGifts(g);
    setContributions(c);
    setPix(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSavePix = async (e: FormEvent) => {
    e.preventDefault();
    setSavingPix(true);
    setPixMsg(null);
    try {
      const { remote } = await savePixConfig(pix);
      setPixMsg(
        remote
          ? { ok: true, text: 'Chave PIX única salva com sucesso! Ela vale para todos os presentes.' }
          : { ok: false, text: 'Salvo neste aparelho. Rode supabase/site_settings.sql para publicar.' },
      );
    } finally {
      setSavingPix(false);
    }
  };

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressing(true);
    try {
      const base64 = await compressImageFile(file, 600, 0.82);
      setPhotoDataUrl(base64);
    } catch {
      alert('Não foi possível carregar a imagem. Tente outra foto.');
    } finally {
      setCompressing(false);
    }
  };

  const handleAddGift = async (e: FormEvent) => {
    e.preventDefault();
    const numericPrice = parseFloat(price.replace(',', '.'));
    if (!title.trim() || isNaN(numericPrice) || numericPrice < 0) return;
    setAdding(true);
    try {
      await createGift({
        title: title.trim(),
        description: description.trim() || null,
        price: numericPrice,
        image_url: photoDataUrl || null,
        is_active: true,
      });
      setTitle('');
      setPrice('');
      setDescription('');
      setPhotoDataUrl('');
      await load();
    } finally {
      setAdding(false);
    }
  };

  const handleToggleActive = async (item: GiftItem) => {
    await updateGift(item.id, { is_active: !item.is_active });
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este presente da lista?')) return;
    await deleteGift(id);
    await load();
  };

  const totalReceived = contributions.reduce((acc, c) => acc + c.amount, 0);

  if (loading) {
    return <Loader2 className="mx-auto mt-16 animate-spin text-terracota" size={32} />;
  }

  return (
    <div className="mt-4 space-y-4 pb-12 sm:mt-6 sm:space-y-6">
      {/* Resumo em cards compactos no celular */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        <div className={`${CARD} col-span-2 flex items-center gap-3 p-3 sm:col-span-1 sm:p-4`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E4ECE1] text-[#4F6B4A] sm:h-12 sm:w-12">
            <Gift size={20} className="sm:hidden" />
            <Gift size={22} className="hidden sm:block" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xl font-bold leading-none text-tinta sm:text-2xl">{formatBRL(totalReceived)}</p>
            <p className="mt-1 text-[11px] font-light text-legenda sm:text-xs">Total em mimos recebidos</p>
          </div>
        </div>

        <div className={`${CARD} flex items-center gap-2.5 p-3 sm:p-4`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F5E4DA] text-[#B9775E] sm:h-12 sm:w-12">
            <Check size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-bold leading-none text-tinta sm:text-2xl">{contributions.length}</p>
            <p className="mt-1 text-[11px] font-light text-legenda sm:text-xs">Mimos avisados</p>
          </div>
        </div>

        <div className={`${CARD} flex items-center gap-2.5 p-3 sm:p-4`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ECE8F1] text-[#7F719A] sm:h-12 sm:w-12">
            <ImageIcon size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-bold leading-none text-tinta sm:text-2xl">{gifts.filter((g) => g.is_active).length}</p>
            <p className="mt-1 text-[11px] font-light text-legenda sm:text-xs">Presentes ativos</p>
          </div>
        </div>
      </div>

      {/* 1. Chave PIX ÚNICA para todo o evento */}
      <form onSubmit={handleSavePix} className={`${CARD} space-y-3 p-4 sm:space-y-4 sm:p-5`}>
        <div>
          <h2 className="text-base font-bold text-nude sm:text-lg">1. Chave PIX Única do Evento</h2>
          <p className="text-xs font-light text-legenda">
            Esta chave PIX é exibida em todos os presentes. O convidado copia com 1 toque no celular.
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
            <label className="mb-1 block text-xs font-medium text-tinta">Nome do Titular da Conta</label>
            <input
              className="input !text-xs sm:!text-sm"
              required
              placeholder="Ex: Ana Laura Martins"
              value={pix.holderName}
              onChange={(e) => setPix({ ...pix, holderName: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-tinta">WhatsApp para receber comprovante (opcional)</label>
            <input
              className="input !text-xs sm:!text-sm"
              placeholder="Ex: 44999999999"
              value={pix.whatsapp}
              onChange={(e) => setPix({ ...pix, whatsapp: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-tinta">Cidade do Titular</label>
            <input
              className="input !text-xs sm:!text-sm"
              placeholder="Mandaguari - PR"
              value={pix.city}
              onChange={(e) => setPix({ ...pix, city: e.target.value })}
            />
          </div>
        </div>

        {pixMsg && (
          <p className={`rounded-2xl px-3 py-2 text-xs ${pixMsg.ok ? 'bg-[#E4ECE1] text-[#4F6B4A]' : 'bg-[#F6E3DE] text-[#A8604F]'}`}>
            {pixMsg.text}
          </p>
        )}

        <button type="submit" disabled={savingPix} className="btn-primary w-full sm:w-auto">
          {savingPix ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar Chave PIX
        </button>
      </form>

      {/* 2. Adicionar Presente com FOTO REAL */}
      <form onSubmit={handleAddGift} className={`${CARD} space-y-3 p-4 sm:space-y-4 sm:p-5`}>
        <div>
          <h2 className="text-base font-bold text-nude sm:text-lg">2. Adicionar Novo Presente</h2>
          <p className="text-xs font-light text-legenda">
            Envie a foto do presente direto da câmera ou galeria do celular.
          </p>
        </div>

        {/* Upload de Foto */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-tinta">Foto do presente:</label>
          {photoDataUrl ? (
            <div className="relative inline-block">
              <img
                src={photoDataUrl}
                alt="Prévia do presente"
                className="h-24 w-24 rounded-2xl border border-stone-200 object-cover shadow-sm sm:h-28 sm:w-28"
              />
              <button
                type="button"
                onClick={() => setPhotoDataUrl('')}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rosa text-white shadow-xs hover:brightness-90"
                title="Remover foto"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-terracota/30 bg-white/70 transition hover:border-terracota hover:bg-white sm:w-72">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={compressing}
              />
              {compressing ? (
                <Loader2 className="animate-spin text-terracota" size={20} />
              ) : (
                <>
                  <Upload className="text-terracota" size={20} />
                  <span className="mt-1 text-xs font-medium text-nude">
                    Toque para escolher foto
                  </span>
                  <span className="text-[10px] text-legenda">Galeria ou Câmera</span>
                </>
              )}
            </label>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-tinta">Nome do presente</label>
            <input
              className="input !text-xs sm:!text-sm"
              required
              placeholder="Ex: Perfume Floral Importado"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-tinta">Valor em R$</label>
            <input
              className="input !text-xs sm:!text-sm"
              required
              placeholder="Ex: 180,00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-tinta">Descrição curta (opcional)</label>
          <input
            className="input !text-xs sm:!text-sm"
            placeholder="Ex: Para brilhar na festa"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" disabled={adding || compressing} className="btn-primary w-full sm:w-auto">
          {adding ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Salvar Presente na Vitrine
        </button>
      </form>

      {/* 3. Catálogo de Presentes */}
      <section className={`${CARD} p-4 sm:p-5`}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-nude sm:text-lg">3. Presentes na Vitrine ({gifts.length})</h2>
        </div>

        {gifts.length === 0 ? (
          <p className="mt-3 text-xs font-light text-legenda">Nenhum presente cadastrado ainda.</p>
        ) : (
          <ul className="mt-3 divide-y divide-stone-200/60">
            {gifts.map((g) => (
              <li
                key={g.id}
                className={`flex flex-col gap-2.5 py-3 sm:flex-row sm:items-center sm:justify-between ${
                  g.is_active ? '' : 'opacity-50'
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  {g.image_url ? (
                    <img
                      src={g.image_url}
                      alt={g.title}
                      className="h-12 w-12 shrink-0 rounded-xl object-cover shadow-xs"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FBF3EC] text-terracota">
                      <Gift size={20} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-tinta">{g.title}</p>
                    <p className="text-xs font-bold text-terracota">{formatBRL(g.price)}</p>
                    {g.description && <p className="line-clamp-1 text-[11px] text-legenda">{g.description}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-stone-100 pt-2 sm:border-0 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(g)}
                    className="btn-outline !px-2.5 !py-1 !text-xs sm:!px-3 sm:!py-1.5"
                  >
                    {g.is_active ? (
                      <>
                        <EyeOff size={13} /> Ocultar
                      </>
                    ) : (
                      <>
                        <Eye size={13} /> Exibir
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(g.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-rosa/50 px-2.5 py-1 text-xs font-medium text-[#B25E52] transition hover:bg-rosa/10 sm:px-3 sm:py-1.5"
                  >
                    <Trash2 size={13} /> Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 4. Histórico de Mimos Avisados */}
      <section className={`${CARD} p-4 sm:p-5`}>
        <h2 className="text-base font-bold text-nude sm:text-lg">
          4. Presentes Avisados pelos Convidados ({contributions.length})
        </h2>
        {contributions.length === 0 ? (
          <p className="mt-3 text-xs font-light text-legenda">
            Quando um convidado fizer o PIX e clicar em &ldquo;Já fiz o PIX! Avisar Ana Laura&rdquo;, o registro aparecerá aqui.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-stone-200/60">
            {contributions.map((c) => (
              <li key={c.id} className="flex flex-col gap-1.5 py-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-tinta">
                    {c.giver_name} <span className="font-normal text-legenda">presenteou com</span> <span className="text-terracota font-medium">{c.gift_title}</span>
                  </p>
                  {c.message && <p className="mt-0.5 line-clamp-2 text-xs italic text-legenda">&ldquo;{c.message}&rdquo;</p>}
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-stone-100 pt-1 sm:border-0 sm:pt-0 sm:text-right">
                  <span className="rounded-full bg-[#E4ECE1] px-2.5 py-0.5 text-xs font-bold text-[#4F6B4A]">
                    {formatBRL(c.amount)}
                  </span>
                  <p className="text-[10px] text-legenda">
                    {new Date(c.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
