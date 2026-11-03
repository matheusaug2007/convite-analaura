import { motion } from 'framer-motion';

/**
 * Hero do convite virtual sobreposto diretamente ao fundo floral (BotanicalDecorations).
 * Segue a hierarquia fiel da arte oficial, 100% em Poppins e integrado às variáveis de cor do tema.
 */
export default function HeroSection() {
  return (
    <section id="topo" className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-8 py-14 text-center">
      {/* Texto em arco suave: "venha comemorar" */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="-mb-6 w-64 sm:w-72"
      >
        <svg viewBox="0 0 360 95" className="w-full overflow-visible" aria-hidden>
          <defs>
            <path id="hero-arc" d="M 20 82 Q 180 6 340 82" fill="none" />
          </defs>
          <text
            style={{ fill: 'var(--primary-color)', fontFamily: 'Poppins, sans-serif' }}
            fontSize="20"
            fontWeight="400"
            letterSpacing="3.5"
            textAnchor="middle"
          >
            <textPath href="#hero-arc" startOffset="50%">
              venha comemorar
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* Numeral 15 em destaque */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15 }}
        style={{ color: 'var(--primary-color)' }}
        className="select-none font-display text-[7.5rem] font-semibold leading-none tracking-tight drop-shadow-[2px_4px_6px_rgba(179,123,92,0.25)] sm:text-[9rem]"
      >
        15
      </motion.h1>

      {/* Nome: ANA LAURA */}
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        style={{ color: 'var(--primary-color)' }}
        className="mt-2 font-display text-2xl font-medium uppercase tracking-[0.28em] sm:text-3xl"
      >
        ANA LAURA
      </motion.h2>

      {/* Bloco de Data e Horário fiel e delicado */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.55 }}
        style={{ color: 'var(--primary-color)' }}
        className="mt-6 w-full max-w-[290px]"
      >
        <p className="text-xs font-normal uppercase tracking-[0.36em]">DEZEMBRO</p>

        <div className="relative my-2.5 flex items-center justify-center">
          {/* Linhas superior e inferior contínuas sutis */}
          <div
            className="absolute inset-x-0 top-0 border-t opacity-40"
            style={{ borderColor: 'var(--primary-color)' }}
          />
          <div
            className="absolute inset-x-0 bottom-0 border-b opacity-40"
            style={{ borderColor: 'var(--primary-color)' }}
          />

          <div className="flex w-full items-center justify-between py-2 text-center">
            <span className="w-24 text-[11px] font-normal uppercase tracking-[0.26em]">
              SÁBADO
            </span>
            <span className="font-display text-4xl font-semibold leading-none sm:text-5xl">
              26
            </span>
            <span className="w-24 text-[11px] font-normal uppercase tracking-[0.26em]">
              19 H
            </span>
          </div>
        </div>

        <p className="text-xs font-normal tracking-[0.36em]">2026</p>
      </motion.div>

      {/* Localização no rodapé da arte */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.75 }}
        style={{ color: 'var(--primary-color)' }}
        className="mt-6 text-xs font-medium uppercase tracking-[0.32em] sm:text-sm"
      >
        CRYSTAL EVENTOS
      </motion.p>

      {/* Botão de ação rápida */}
      <motion.a
        href="#rsvp"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.95 }}
        className="btn-primary mt-8"
      >
        Confirmar presença
      </motion.a>
    </section>
  );
}
