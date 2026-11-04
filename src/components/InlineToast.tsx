import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

/**
 * Adaptado do "Inline Toast" do Watermelon (ui.watermelon.sh):
 * a pílula mostra o texto + botão "Copiar" e, ao copiar, troca por uma
 * confirmação enquanto uma barra preenche o fundo até o fim do tempo.
 */
interface InlineToastProps {
  text: string;
  copyLabel?: string;
  copiedLabel?: string;
  copyDuration?: number;
}

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback para navegadores sem Clipboard API
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

export default function InlineToast({
  text,
  copyLabel = 'Copiar',
  copiedLabel = 'Chave copiada!',
  copyDuration = 2200,
}: InlineToastProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    await writeClipboard(text);
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), copyDuration);
  };

  return (
    <motion.div
      layout="position"
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="relative mx-auto flex h-14 w-full max-w-xs items-center overflow-hidden rounded-full border border-terracota/30 bg-white pl-5 pr-1.5 shadow-sm"
    >
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: copyDuration / 1000, ease: 'linear' }}
            className="absolute inset-0 bg-[#E4ECE1]"
          />
        )}
      </AnimatePresence>

      <div className="z-10 flex w-full items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          {!copied ? (
            <motion.div
              key="copy"
              initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.95 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.95 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="flex w-full min-w-0 items-center justify-between gap-3"
            >
              <span className="min-w-0 flex-1 truncate text-left font-mono text-[13px] font-semibold text-tinta">
                {text}
              </span>

              <motion.button
                type="button"
                onClick={handleCopy}
                whileHover={{ y: -1, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                style={{ backgroundColor: 'var(--button-color)' }}
                className="relative shrink-0 cursor-pointer overflow-hidden rounded-full px-5 py-2.5 text-xs font-semibold text-white shadow-[0_6px_12px_rgba(179,123,92,0.25)]"
              >
                <motion.span
                  initial={{ x: '-120%' }}
                  whileHover={{ x: '120%' }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
                <span className="relative z-10">{copyLabel}</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="copied"
              initial={{ opacity: 0, filter: 'blur(4px)', scale: 1.1 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(4px)', scale: 1.1 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="flex w-full items-center justify-center gap-2 pr-3.5 text-[#4F6B4A]"
            >
              <CheckCircle2 size={22} />
              <span className="text-sm font-semibold">{copiedLabel}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
