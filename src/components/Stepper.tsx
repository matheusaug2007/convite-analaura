import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

/**
 * Adaptado do "Stepper" do Watermelon (ui.watermelon.sh):
 * contador com os dígitos rolando para cima/baixo a cada toque.
 */
interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

const digitVariants = {
  initial: (dir: number) => ({ y: dir > 0 ? 20 : -20, opacity: 0, scale: 0.5, filter: 'blur(2px)' }),
  animate: { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: (dir: number) => ({ y: dir > 0 ? -20 : 20, opacity: 0, scale: 0.5, filter: 'blur(2px)' }),
};

export default function Stepper({ value, min = 0, max = 10, onChange }: StepperProps) {
  const [direction, setDirection] = useState(0);
  const digits = value.toString().split('');

  const step = (dir: number) => {
    const next = Math.min(max, Math.max(min, value + dir));
    if (next === value) return;
    setDirection(dir);
    onChange(next);
  };

  const btn =
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FBF3EC] text-nude disabled:opacity-40';

  return (
    <div className="flex w-full justify-center">
      <div className="flex items-center gap-4 rounded-full border-2 border-terracota/25 bg-white/70 p-1 shadow-sm">
        <motion.button
          type="button"
          aria-label="Menos um acompanhante"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          onClick={() => step(-1)}
          disabled={value <= min}
          className={btn}
        >
          <Minus size={16} />
        </motion.button>

        <div className="flex min-w-[2rem] items-center justify-center text-2xl font-semibold text-nude" aria-live="polite">
          {digits.map((digit, index) => (
            <div key={`${index}-${digits.length}`} className="relative h-8 w-4">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.span
                  key={digit}
                  custom={direction}
                  variants={digitVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 200, damping: 16, mass: 1.2 }}
                  className="absolute inset-0 flex items-center justify-center tabular-nums"
                >
                  {digit}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}
        </div>

        <motion.button
          type="button"
          aria-label="Mais um acompanhante"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          onClick={() => step(1)}
          disabled={value >= max}
          className={btn}
        >
          <Plus size={16} />
        </motion.button>
      </div>
    </div>
  );
}
