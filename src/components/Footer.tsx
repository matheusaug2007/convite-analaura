import { Share2 } from 'lucide-react';

const SHARE_TEXT =
  'Você está convidado(a) para os 15 anos da Ana Laura! 🌸 26/12/2026 às 19h no Crystal Eventos, Mandaguari-PR.';

export default function Footer() {
  const share = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${window.location.href}`)}`;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <footer className="relative z-10 px-6 pb-12 pt-4 text-center">
      <button onClick={share} className="btn-primary">
        <Share2 size={16} /> Compartilhar no WhatsApp
      </button>
      <p className="mt-6 text-[11px] font-light text-legenda">
        Ana Laura Martins • 15 Anos • 26 de Dezembro de 2026
      </p>
    </footer>
  );
}
