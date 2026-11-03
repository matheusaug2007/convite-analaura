import { useState } from 'react';
import { motion } from 'framer-motion';

const PETAL_COLORS = ['#E8A598', '#A599B5', '#D39878', '#8EA08A'];

/** Pétalas caindo suavemente (usado na abertura do envelope). */
export function FallingPetals({ count = 18 }: { count?: number }) {
  const [items] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 4,
      size: 10 + Math.random() * 14,
      color: PETAL_COLORS[i % PETAL_COLORS.length],
    })),
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {items.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-[60%_40%_60%_40%] opacity-80"
          style={{ left: `${p.left}%`, top: -30, width: p.size, height: p.size * 1.3, background: p.color }}
          initial={{ y: -30, rotate: 0, opacity: 0.9 }}
          animate={{ y: '110vh', rotate: 360, x: [0, 30, -20, 10] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

/**
 * Fundo fixo do convite virtual usando a arte botânica limpa (/assets/fundo-floral.jpg).
 * No celular, preenche 100% da tela como moldura floral fixa; no desktop,
 * mantém a moldura centralizada na coluna do convite com fundo suave nas laterais.
 */
export default function BotanicalDecorations() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-color)' }}
      aria-hidden
    >
      {/* Camada lateral suave apenas para telas largas (desktop) */}
      <div
        className="absolute inset-0 hidden bg-cover bg-center opacity-30 blur-md sm:block"
        style={{ backgroundImage: "url('/assets/fundo-floral.jpg')" }}
      />

      {/* Moldura floral principal (tela cheia no mobile, coluna central no desktop) */}
      <div
        className="mx-auto h-full w-full max-w-[540px] bg-[length:100%_100%] bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/fundo-floral.jpg')",
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  );
}
