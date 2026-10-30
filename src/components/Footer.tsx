import { Share2 } from 'lucide-react';

const SHARE_TEXT =
  'Você está convidado(a) para os 15 anos da Ana Laura! 🌸 26/12/2026 às 19h no Crystal Eventos, Mandaguari-PR.';

export default function Footer() {
  const share = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${window.location.href}`)}`;
    window.open(url, '_blank', 'noopener');
  };
  return (
    <footer className="relative z-10 px-6 pb-16 pt-8 text-center">
      <p className="mx-auto max-w-xs font-display text-xl italic text-nude">
        “Cada flor desse jardim representa um carinho que recebi de vocês. Obrigada por fazerem parte da minha história.”
      </p>
      <p className="mt-3 text-sm font-semibold text-terracota">— Ana Laura</p>
      <button onClick={share} className="btn-primary mt-6">
        <Share2 size={18} /> Compartilhar no WhatsApp
      </button>
      <p className="mt-8 text-[11px] font-light text-legenda">Ana Laura Martins • 15 Anos • 2026</p>
    </footer>
  );
}

