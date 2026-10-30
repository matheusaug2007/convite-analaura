import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-lg font-semibold tracking-[0.25em] text-rosa"
      >
        venha comemorar
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="font-display text-[9rem] font-bold leading-none text-terracota drop-shadow-[4px_6px_6px_rgba(179,123,92,0.35)] sm:text-[12rem]"
      >
        15
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="font-display text-4xl font-bold uppercase tracking-wider text-terracota drop-shadow-[2px_3px_3px_rgba(179,123,92,0.3)]"
      >
        Ana Laura
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-1 text-sm font-light tracking-[0.3em] text-legenda"
      >
        MARTINS
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 max-w-xs text-base font-light italic text-legenda"
      >
        Venha comemorar comigo esse momento inesquecível
      </motion.p>
      <motion.a
        href="#rsvp"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="btn-primary mt-8"
      >
        Confirmar presença
      </motion.a>
    </section>
  );
}

