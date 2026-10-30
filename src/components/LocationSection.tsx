import { MapPin, Navigation } from 'lucide-react';

const QUERY = 'Crystal Eventos Mandaguari PR';
const GOOGLE_MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(QUERY)}`;
const WAZE = `https://waze.com/ul?q=${encodeURIComponent(QUERY)}&navigate=yes`;
const EMBED = `https://www.google.com/maps?q=${encodeURIComponent(QUERY)}&output=embed`;

export default function LocationSection() {
  return (
    <section className="relative z-10 px-6 py-16">
      <h2 className="section-title">Local da festa</h2>
      <div className="glass mx-auto mt-8 max-w-md p-5 text-center">
        <MapPin className="mx-auto text-terracota" size={32} />
        <h3 className="mt-2 font-display text-2xl font-bold text-nude">Crystal Eventos</h3>
        <p className="text-sm font-light text-legenda">Mandaguari - PR</p>
        <iframe
          title="Mapa Crystal Eventos"
          src={EMBED}
          loading="lazy"
          className="mt-4 h-52 w-full rounded-2xl border-0"
        />
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href={GOOGLE_MAPS} target="_blank" rel="noreferrer" className="btn-primary">
            <MapPin size={18} /> Abrir no Google Maps
          </a>
          <a href={WAZE} target="_blank" rel="noreferrer" className="btn-outline">
            <Navigation size={18} /> Abrir no Waze
          </a>
        </div>
      </div>
    </section>
  );
}

