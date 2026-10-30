import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FallingPetals } from './BotanicalDecorations';

export default function EnvelopeCover({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpen, 1500);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-linho px-6"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <AnimatePresence>{opening && <FallingPetals />}</AnimatePresence>

      <motion.div
        className="relative h-64 w-80 max-w-full"
        animate={opening ? { scale: 1.15, y: 40, opacity: 0 } : { y: [0, -6, 0] }}
        transition={opening ? { duration: 1.4, delay: 0.3 } : { duration: 3, repeat: Infinity }}
      >
        {/* corpo do envelope */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#F3E3D6] to-[#EBD2BF] shadow-[0_12px_40px_rgba(179,123,92,0.3)]" />
        {/* aba */}
        <motion.div
          className="absolute left-0 top-0 h-36 w-full origin-top"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            background: 'linear-gradient(180deg,#E3BFA6,#D9AE92)',
          }}
          animate={opening ? { rotateX: 180 } : { rotateX: 0 }}
          transition={{ duration: 0.9 }}
        />
        {/* selo */}
        <motion.button
          onClick={handleOpen}
          aria-label="Abrir convite"
          className="absolute left-1/2 top-[38%] z-10 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-terracota font-display text-3xl font-bold text-white shadow-lg ring-4 ring-white/50"
          animate={opening ? { scale: 0, opacity: 0 } : { scale: [1, 1.08, 1] }}
          transition={opening ? { duration: 0.4 } : { duration: 2, repeat: Infinity }}
        >
          15
        </motion.button>
      </motion.div>

      <motion.p
        className="mt-10 text-center text-sm font-light tracking-[0.3em] text-nude"
        animate={{ opacity: opening ? 0 : 1 }}
      >
        TOQUE PARA ABRIR O CONVITE
      </motion.p>
      <p className="mt-2 font-display text-lg text-terracota">Ana Laura Martins</p>
    </motion.div>
  );
}

