import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PETAL_COLORS = ['#E8A598', '#A599B5', '#D39878', '#8EA08A'];

/** Pétalas/borboletas caindo suavemente (usado na abertura). */
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

function Flower({ className, color }: { className?: string; color: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="50" cy="28" rx="14" ry="24" fill={color} opacity="0.55" transform={`rotate(${r} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="9" fill="#D39878" opacity="0.8" />
    </svg>
  );
}

function Leaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 120" className={className} aria-hidden>
      <path d="M30 118 C5 80 5 30 30 2 C55 30 55 80 30 118Z" fill="#8EA08A" opacity="0.45" />
      <path d="M30 112 L30 12" stroke="#8EA08A" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}

/** Flores e folhagens SVG nos cantos com parallax suave ao rolar. */
export default function BotanicalDecorations() {
  const { scrollY } = useScroll();
  const yUp = useTransform(scrollY, [0, 1500], [0, -120]);
  const yDown = useTransform(scrollY, [0, 1500], [0, 120]);

  useEffect(() => {}, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div style={{ y: yUp }} className="absolute -left-10 -top-6">
        <Flower color="#E8A598" className="h-40 w-40 animate-float" />
        <Leaf className="absolute left-24 top-20 h-28 w-14 rotate-[40deg]" />
      </motion.div>
      <motion.div style={{ y: yUp }} className="absolute -right-12 top-10">
        <Flower color="#A599B5" className="h-36 w-36 animate-float" />
        <Leaf className="absolute right-20 top-24 h-24 w-12 -rotate-[35deg]" />
      </motion.div>
      <motion.div style={{ y: yDown }} className="absolute -bottom-10 -left-8">
        <Flower color="#A599B5" className="h-36 w-36 animate-float" />
        <Leaf className="absolute -top-16 left-20 h-24 w-12 rotate-[20deg]" />
      </motion.div>
      <motion.div style={{ y: yDown }} className="absolute -bottom-8 -right-10">
        <Flower color="#E8A598" className="h-44 w-44 animate-float" />
        <Leaf className="absolute -top-14 right-24 h-28 w-14 -rotate-[25deg]" />
      </motion.div>
    </div>
  );
}

