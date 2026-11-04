import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Gift, MapPin, Sparkles, type LucideIcon } from 'lucide-react';

/**
 * Barra flutuante inferior no alcance do polegar.
 * Adaptada do "Dock" do Watermelon (ui.watermelon.sh): os ícones "pulam" ao
 * toque e um pontinho marca a seção em que o convidado está.
 */
interface DockItem {
  id: string;
  label: string;
  icon: LucideIcon;
  primary?: boolean;
}

// Mesma ordem em que as seções aparecem na página
const ITEMS: DockItem[] = [
  { id: 'topo', label: 'Início', icon: Sparkles },
  { id: 'local', label: 'Local', icon: MapPin },
  { id: 'presentes', label: 'Presentes', icon: Gift },
  { id: 'rsvp', label: 'Confirmar', icon: Check, primary: true },
];

export default function BottomDock() {
  const [active, setActive] = useState('topo');
  const [bouncing, setBouncing] = useState<string | null>(null);

  // Marca como ativa a seção que cruza o meio da tela
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    setActive(id);
    setBouncing(id);
    setTimeout(() => setBouncing(null), 200);
  };

  return (
    <nav
      aria-label="Atalhos do convite"
      className="fixed bottom-3.5 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-end justify-between gap-1 rounded-3xl border-[1.5px] border-white/80 bg-white/90 px-2 pb-1.5 pt-2 shadow-[0_10px_30px_rgba(62,56,53,0.16)] backdrop-blur-md"
    >
      {ITEMS.map(({ id, label, icon: Icon, primary }) => {
        const isActive = active === id;
        return (
          <motion.a
            key={id}
            href={`#${id}`}
            onClick={() => handleClick(id)}
            aria-current={isActive ? 'true' : undefined}
            style={{ transformOrigin: 'bottom' }}
            whileHover={{ y: -4 }}
            animate={{ scale: bouncing === id ? 1.25 : 1, y: bouncing === id ? -6 : 0 }}
            transition={{ type: 'spring', stiffness: 550, damping: 15, mass: 1.1 }}
            className="flex flex-1 flex-col items-center"
          >
            <span
              style={primary ? { backgroundColor: 'var(--button-color)' } : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200 ${
                primary ? 'text-white shadow-xs' : isActive ? 'bg-[#F5E4DA] text-nude' : 'bg-[#FBF3EC] text-legenda'
              }`}
            >
              <Icon size={18} />
            </span>
            <span
              className={`mt-1 text-[10px] font-medium transition-colors ${isActive ? 'text-nude' : 'text-legenda'}`}
            >
              {label}
            </span>
            <span
              className={`mt-0.5 h-1 w-1 rounded-full bg-terracota transition-opacity duration-300 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </motion.a>
        );
      })}
    </nav>
  );
}
