import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Map as MapIcon, X } from 'lucide-react';

/**
 * Adaptado do "View on Map" do Watermelon (ui.watermelon.sh):
 * um botão em pílula que se transforma (morph) no mapa e volta ao fechar.
 */
interface ViewOnMapProps {
  query: string;
  label?: string;
}

const spring = { type: 'spring' as const, stiffness: 400, damping: 30, mass: 0.8 };

export default function ViewOnMap({ query, label = 'Ver no mapa' }: ViewOnMapProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const toggle = () => {
    if (isOpen) setLoaded(false);
    setIsOpen(!isOpen);
  };

  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;

  return (
    <div className="flex w-full items-center justify-center">
      <AnimatePresence mode="popLayout">
        {!isOpen ? (
          <motion.button
            key="button"
            type="button"
            layoutId="map-container"
            onClick={toggle}
            className="relative flex h-[52px] w-[190px] cursor-pointer items-center justify-center gap-2.5 overflow-hidden bg-[#FBF3EC] text-nude shadow-sm"
            style={{ borderRadius: 26 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={spring}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <MapIcon size={19} className="text-terracota" />
            <span className="text-[15px] font-semibold tracking-tight">{label}</span>
          </motion.button>
        ) : (
          <motion.div
            key="map"
            layoutId="map-container"
            className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFE6DC] shadow-lg"
            style={{ borderRadius: 28 }}
            transition={spring}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="absolute inset-0"
            >
              <iframe
                title="Mapa do local da festa"
                src={src}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`h-full w-full border-0 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </motion.div>

            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#F3EADF]">
                <Loader2 className="h-7 w-7 animate-spin text-terracota" />
              </div>
            )}

            <motion.button
              type="button"
              aria-label="Fechar mapa"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={toggle}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-nude shadow-lg transition active:scale-90"
            >
              <X size={20} strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
