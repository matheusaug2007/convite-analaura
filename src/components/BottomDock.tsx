import { Check, Gift, MapPin, Sparkles } from 'lucide-react';

/**
 * Barra flutuante inferior (Bottom Dock) no alcance do polegar.
 */
export default function BottomDock() {
  return (
    <nav
      aria-label="Atalhos do convite"
      className="fixed bottom-3.5 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center justify-between gap-1 rounded-full border border-white/80 bg-white/90 p-1.5 shadow-[0_10px_30px_rgba(62,56,53,0.16)] backdrop-blur-md"
    >
      <a
        href="#topo"
        className="flex flex-1 flex-col items-center justify-center rounded-full py-1.5 text-[10px] font-medium text-legenda transition hover:text-nude"
      >
        <Sparkles size={15} />
        <span>Início</span>
      </a>
      <a
        href="#presentes"
        className="flex flex-1 flex-col items-center justify-center rounded-full py-1.5 text-[10px] font-medium text-legenda transition hover:text-nude"
      >
        <Gift size={15} />
        <span>Presentes</span>
      </a>
      <a
        href="#local"
        className="flex flex-1 flex-col items-center justify-center rounded-full py-1.5 text-[10px] font-medium text-legenda transition hover:text-nude"
      >
        <MapPin size={15} />
        <span>Local</span>
      </a>
      <a
        href="#rsvp"
        style={{ backgroundColor: 'var(--button-color)' }}
        className="flex flex-1 flex-col items-center justify-center rounded-full py-1.5 text-[10px] font-semibold text-white shadow-xs transition active:scale-95"
      >
        <Check size={15} />
        <span>Confirmar</span>
      </a>
    </nav>
  );
}
