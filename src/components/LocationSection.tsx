import { MapPin, Navigation } from 'lucide-react';
import ViewOnMap from './ViewOnMap';

const QUERY = 'Crystal Eventos Mandaguari PR';
const GOOGLE_MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(QUERY)}`;
const WAZE = `https://waze.com/ul?q=${encodeURIComponent(QUERY)}&navigate=yes`;

export default function LocationSection() {
  return (
    <section id="local" className="relative z-10 px-6 py-16">
      <h2 className="section-title">Local da festa</h2>
      <div className="glass mx-auto mt-8 max-w-md p-5 text-center">
        <MapPin className="mx-auto text-terracota" size={32} />
        <h3 className="mt-2 font-display text-2xl font-bold text-nude">Crystal Eventos</h3>
        <p className="text-sm font-light text-legenda">Mandaguari - PR</p>
        <div className="mt-5">
          <ViewOnMap query={QUERY} />
        </div>
        <p className="mt-5 text-[11px] font-light uppercase tracking-[0.2em] text-legenda">Como chegar</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href={GOOGLE_MAPS} target="_blank" rel="noreferrer" className="btn-primary">
            <MapPin size={18} /> Google Maps
          </a>
          <a href={WAZE} target="_blank" rel="noreferrer" className="btn-outline">
            <Navigation size={18} /> Waze
          </a>
        </div>
      </div>
    </section>
  );
}

