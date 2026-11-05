import { useEffect, useState } from 'react';
import { Footprints, Gem, MessageCircle, Shirt } from 'lucide-react';
import { DEFAULT_PIX_CONFIG, PixConfig, fetchPixConfig } from '../lib/giftsApi';
import InlineToast from './InlineToast';

/** Preferências da aniversariante (fixas: não mudam durante a festa). */
const SIZES = [
  { icon: Shirt, label: 'Roupas', value: 'P ou PP' },
  { icon: Footprints, label: 'Calçados', value: '37' },
  { icon: Gem, label: 'Acessórios', value: 'Dourado e Prata' },
];

const LIKES = ['Cremes', 'Perfumes', 'Vestidos', 'Blusinhas', 'Berloques'];

/** Filete com um pequeno losango no centro, separador de seções. */
function Ornament() {
  return (
    <div className="flex items-center justify-center gap-2.5" aria-hidden="true">
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-terracota/50" />
      <span className="h-1.5 w-1.5 rotate-45 bg-terracota/70" />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-terracota/50" />
    </div>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-center text-[10px] font-medium uppercase tracking-[0.28em] text-legenda">{children}</p>
  );
}

export default function GiftsSection() {
  const [pix, setPix] = useState<PixConfig>(DEFAULT_PIX_CONFIG);

  useEffect(() => {
    fetchPixConfig().then(setPix);
  }, []);

  const whatsappDigits = pix.whatsapp.replace(/\D/g, '');

  return (
    <section id="presentes" className="relative z-10 px-5 py-12">
      {/* Uma única "carta": papel opaco para o texto ler bem sobre as flores */}
      <div className="relative mx-auto max-w-md rounded-[2rem] bg-[#FFFBF6]/95 px-6 pb-10 pt-11 shadow-[0_14px_44px_rgba(179,123,92,0.22)]">
        <div
          className="pointer-events-none absolute inset-2.5 rounded-[1.6rem] border border-terracota/25"
          aria-hidden="true"
        />

        <div className="relative">
          <h2 className="section-title">Sugestões de presentes</h2>
          <div className="mt-4">
            <Ornament />
          </div>

          <p className="mx-auto mt-6 max-w-[17.5rem] text-center font-serif text-[1.15rem] italic leading-snug text-tinta">
            Se você deseja me presentear, deixo aqui algumas preferências que podem ajudar na sua escolha.
          </p>

          {/* Tamanhos e cor: uma linha só, separada por filetes */}
          <div className="mt-8 grid grid-cols-3 divide-x divide-terracota/20">
            {SIZES.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center px-1 text-center">
                <Icon size={18} strokeWidth={1.5} className="text-terracota" />
                <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.2em] text-legenda">{label}</p>
                <p className="mt-0.5 font-serif text-[1.35rem] font-semibold leading-none text-nude">{value}</p>
              </div>
            ))}
          </div>

          {/* Alergia: aviso discreto, mas impossível de não ver */}
          <p className="mx-auto mt-7 max-w-[19rem] text-center text-[13px] leading-relaxed text-tinta">
            <span className="font-semibold text-[#A8604F]">Tenho alergia a níquel.</span> Prefiro peças douradas e
            livres desse material.
          </p>

          <div className="mt-8">
            <Ornament />
          </div>

          {/* O que ela gosta: texto corrido, sem caixinhas */}
          <div className="mt-7">
            <Eyebrow>Eu gosto muito de</Eyebrow>
            <p className="mx-auto mt-3 max-w-[19rem] text-center font-serif text-[1.3rem] font-medium leading-relaxed text-nude">
              {LIKES.map((item, i) => (
                <span key={item}>
                  {item}
                  {i < LIKES.length - 1 && <span className="mx-1.5 text-terracota/60">·</span>}{' '}
                </span>
              ))}
              <span className="font-normal italic text-tinta">e outros mimos</span>
            </p>
          </div>

          <div className="mt-8">
            <Ornament />
          </div>

          {/* PIX: uma linha compacta, aberta na tela */}
          <div className="mt-7">
            <Eyebrow>Via Pix, se preferir</Eyebrow>

            {pix.pixKey ? (
              <>
                <div className="mt-3.5">
                  <InlineToast text={pix.pixKey} />
                </div>
                <p className="mt-2.5 text-center text-[11px] text-legenda">
                  Titular: <span className="font-medium text-tinta">{pix.holderName}</span>
                </p>
              </>
            ) : (
              <p className="mt-3 text-center font-serif text-base italic text-legenda">
                A chave Pix será disponibilizada em breve.
              </p>
            )}

            {whatsappDigits && (
              <a
                href={`https://wa.me/55${whatsappDigits}?text=${encodeURIComponent(
                  'Olá! Quero mandar um carinho para a Ana Laura nos 15 anos 🌸',
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mx-auto mt-4 flex w-fit items-center gap-1.5 text-xs font-medium text-nude underline decoration-terracota/40 underline-offset-4"
              >
                <MessageCircle size={14} /> Quer deixar um recado? Fale no WhatsApp
              </a>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
