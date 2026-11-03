import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FallingPetals } from './BotanicalDecorations';

export default function EnvelopeCover({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpen, 1750);
  };

  return (
    <motion.div
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      aria-label="Toque para abrir o convite de 15 anos da Ana Laura Martins"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleOpen();
      }}
      className="fixed inset-0 z-50 flex cursor-pointer select-none flex-col items-center justify-center overflow-hidden px-5"
      style={{ backgroundColor: 'var(--bg-color)' }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.75, ease: 'easeInOut' }}
    >
      {/* Moldura floral botânica ao fundo */}
      <div
        className="pointer-events-none absolute inset-0 mx-auto h-full w-full max-w-[540px] bg-[length:100%_100%] bg-center bg-no-repeat opacity-95"
        style={{
          backgroundImage: "url('/assets/fundo-floral.jpg')",
          mixBlendMode: 'multiply',
        }}
        aria-hidden
      />

      {/* Brilho central suave para destacar o envelope */}
      <div
        className="pointer-events-none absolute h-80 w-80 rounded-full opacity-60 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(255,250,244,0.95) 0%, rgba(247,239,228,0) 70%)',
        }}
        aria-hidden
      />

      <AnimatePresence>{opening && <FallingPetals />}</AnimatePresence>

      {/* Cabeçalho superior com o nome da aniversariante */}
      <motion.div
        className="relative z-10 mb-8 flex flex-col items-center text-center"
        animate={opening ? { opacity: 0, y: -16 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-2xl font-semibold tracking-wide text-terracota sm:text-3xl">
          Ana Laura Martins
        </h1>
        <p className="mt-1 text-[11px] font-light tracking-[0.25em] text-nude">
          XV ANOS • 26.12.2026
        </p>
      </motion.div>

      {/* Envelope de Papelaria Fina 3D */}
      <motion.div
        className="relative z-10 w-full max-w-[310px] sm:max-w-[340px]"
         style={{ perspective: '1200px' }}
        animate={
          opening
            ? { scale: 1.08, y: 24, opacity: 0 }
            : { y: [0, -5, 0] }
        }
        transition={
          opening
            ? { duration: 1.35, delay: 0.4, ease: 'easeInOut' }
            : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {/* Sombra de apoio do envelope no papel */}
        <div
          className="pointer-events-none absolute -bottom-5 left-6 right-6 h-8 rounded-full opacity-50 blur-xl"
          style={{ backgroundColor: '#B57B5C' }}
          aria-hidden
        />

        <div className="relative aspect-[4/3] w-full rounded-2xl">
          {/* Interior do envelope (fundo escuro sutil) */}
          <div
            className="absolute inset-0 rounded-2xl border border-[#DFC3AE]/80 shadow-[0_18px_45px_rgba(148,96,68,0.24)]"
            style={{
              background: 'linear-gradient(180deg, #DEC2AC 0%, #E9D2BF 100%)',
            }}
          />

          {/* Cartão interno do convite (sobe quando o envelope abre) */}
          <motion.div
            className="absolute inset-x-3.5 top-3 bottom-3 z-10 flex flex-col items-center justify-center rounded-xl border border-[#EFE2D4] bg-[#FDF9F3] px-4 text-center shadow-md"
            initial={{ y: 0 }}
            animate={opening ? { y: -62, scale: 1.02 } : { y: 0 }}
            transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute inset-1.5 rounded-lg border border-terracota/20" />
            <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-legenda">
              Venha celebrar
            </span>
            <span className="mt-0.5 font-display text-2xl font-semibold text-terracota">
              15 Anos
            </span>
            <span className="mt-0.5 text-[11px] font-light tracking-widest text-nude">
              Ana Laura
            </span>
          </motion.div>

          {/* Dobras laterais do envelope (esquerda e direita) */}
          <div
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl"
            aria-hidden
          >
            {/* Aba lateral esquerda */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(0 0, 52% 52%, 0 100%)',
                background: 'linear-gradient(135deg, #F6E9DC 0%, #ECD7C5 100%)',
                filter: 'drop-shadow(2px 0 4px rgba(140,92,65,0.12))',
              }}
            />
            {/* Aba lateral direita */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(100% 0, 48% 52%, 100% 100%)',
                background: 'linear-gradient(225deg, #F4E6D8 0%, #E9D3C0 100%)',
                filter: 'drop-shadow(-2px 0 4px rgba(140,92,65,0.12))',
              }}
            />
            {/* Aba inferior do envelope (bolso frontal) */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(0 100%, 50% 45%, 100% 100%)',
                background: 'linear-gradient(0deg, #F2E2D2 0%, #FAF0E6 100%)',
                filter: 'drop-shadow(0 -3px 6px rgba(140,92,65,0.14))',
              }}
            />
            {/* Filete de acabamento fino nas bordas do bolso */}
            <svg
              viewBox="0 0 400 300"
              className="absolute inset-0 h-full w-full opacity-35"
              fill="none"
            >
              <path
                d="M 0 300 L 200 135 L 400 300"
                stroke="#B87D5E"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
            </svg>
          </div>

          {/* Aba Superior (Tampa 3D que abre) */}
          <motion.div
            className=" pointer-events-none absolute inset-x-0 top-0 z-30 h-[58%] origin-top"
            style={{
              transformStyle: 'preserve-3d',
              filter: 'drop-shadow(0 6px 10px rgba(135,85,58,0.22))',
            }}
            animate={opening ? { rotateX: 180, zIndex: 5 } : { rotateX: 0, zIndex: 30 }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          >
            <div
              className="h-full w-full rounded-t-2xl"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                background: 'linear-gradient(180deg, #ECCFB8 0%, #DFB99C 65%, #D5AA8A 100%)',
              }}
            />
            {/* Linha interna dourada/terracota acompanhando a aba superior */}
            <svg
              viewBox="0 0 400 175"
              className="absolute inset-0 h-full w-full opacity-45"
              fill="none"
            >
              <path
                d="M 14 6 L 200 164 L 386 6"
                stroke="#FFF8F0"
                strokeWidth="1.5"
              />
            </svg>
          </motion.div>

          {/* Lacre de Cera Centralizado (Wax Seal) */}
          <div className="absolute inset-0 z-40 flex items-center justify-center pt-3">
            <motion.div
              animate={
                opening
                  ? { scale: 0.2, opacity: 0, rotate: -15 }
                  : { scale: [1, 1.05, 1] }
              }
              transition={
                opening
                  ? { duration: 0.35, ease: 'easeIn' }
                  : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
              }
              className="relative flex h-20 w-20 items-center justify-center sm:h-22 sm:w-22"
            >
              {/* Halo pulsante externo */}
              <span
                className="absolute inset-0 animate-ping rounded-full opacity-20"
                style={{ backgroundColor: 'var(--primary-color)', animationDuration: '3s' }}
              />

              {/* Corpo esculpido do lacre de cera em SVG */}
              <svg
                viewBox="0 0 120 120"
                className="h-full w-full drop-shadow-[0_8px_16px_rgba(120,68,42,0.42)]"
              >
                <defs>
                  <radialGradient id="waxGrad" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#DCA284" />
                    <stop offset="55%" stopColor="#C88A6B" />
                    <stop offset="100%" stopColor="#9E6244" />
                  </radialGradient>
                  <radialGradient id="waxInner" cx="65%" cy="70%" r="65%">
                    <stop offset="0%" stopColor="#B87858" />
                    <stop offset="100%" stopColor="#93593C" />
                  </radialGradient>
                </defs>

                {/* Borda orgânica de cera derretida */}
                <path
                  d="M60 4 C73 4, 83 8, 94 16 C105 24, 114 35, 115 49 C117 63, 113 76, 105 88 C97 100, 86 110, 72 114 C58 118, 44 115, 31 109 C18 103, 9 92, 5 78 C1 64, 3 49, 9 36 C15 23, 25 12, 38 7 C46 4, 53 4, 60 4 Z"
                  fill="url(#waxGrad)"
                  stroke="#F7E6D7"
                  strokeWidth="1.5"
                  strokeOpacity="0.6"
                />

                {/* Cavidade interna prensada do sinete */}
                <circle
                  cx="60"
                  cy="60"
                  r="41"
                  fill="url(#waxInner)"
                  stroke="#ECC5AE"
                  strokeWidth="1.4"
                  strokeOpacity="0.75"
                />

                {/* Anel pontilhado de joalheria */}
                <circle
                  cx="60"
                  cy="60"
                  r="36"
                  fill="none"
                  stroke="#F9E8DA"
                  strokeWidth="1"
                  strokeDasharray="2.2 3.2"
                  strokeOpacity="0.7"
                />

                {/* Raminhos botânicos laterais dentro do lacre */}
                <path
                  d="M34 68 C31 60, 32 51, 37 44 M34 62 L30 58 M34 54 L31 49 M36 48 L39 45"
                  stroke="#FBECE0"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.75"
                />
                <path
                  d="M86 68 C89 60, 88 51, 83 44 M86 62 L90 58 M86 54 L89 49 M84 48 L81 45"
                  stroke="#FBECE0"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.75"
                />

                {/* Estrela superior minimalista */}
                <circle cx="60" cy="34" r="1.5" fill="#FFF5EC" opacity="0.85" />
              </svg>

              {/* Numeral 15 centralizado no lacre */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-0.5 text-white">
                <span className="font-display text-2xl font-semibold leading-none tracking-tight drop-shadow-[0_1px_2px_rgba(85,42,20,0.5)]">
                  15
                </span>
                <span className="mt-0.5 text-[7px] font-medium uppercase tracking-[0.28em] text-[#FBECE0]/90">
                  ANOS
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
