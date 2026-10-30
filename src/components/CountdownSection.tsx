import { useEffect, useState } from 'react';
import { CalendarPlus } from 'lucide-react';

// 26/12/2026 às 19h00 (horário de Brasília, UTC-3)
const EVENT_DATE = new Date('2026-12-26T19:00:00-03:00');

function diff() {
  const ms = Math.max(0, EVENT_DATE.getTime() - Date.now());
  return {
    Dias: Math.floor(ms / 86400000),
    Horas: Math.floor((ms / 3600000) % 24),
    Minutos: Math.floor((ms / 60000) % 60),
    Segundos: Math.floor((ms / 1000) % 60),
  };
}

const CALENDAR_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  '&text=' + encodeURIComponent('15 Anos da Ana Laura') +
  '&dates=20261226T220000Z/20261227T040000Z' +
  '&location=' + encodeURIComponent('Crystal Eventos, Mandaguari - PR') +
  '&details=' + encodeURIComponent('Venha comemorar comigo esse momento inesquecível!');

export default function CountdownSection() {
  const [t, setT] = useState(diff);
  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative z-10 px-6 py-16">
      <h2 className="section-title">Save the date</h2>
      <p className="mt-2 text-center text-sm font-light tracking-[0.2em] text-legenda">
        SÁBADO • 26 DE DEZEMBRO DE 2026 • 19H00
      </p>
      <div className="mx-auto mt-8 grid max-w-md grid-cols-4 gap-3">
        {Object.entries(t).map(([label, value]) => (
          <div key={label} className="glass flex flex-col items-center py-4">
            <span className="text-2xl font-bold tabular-nums text-nude">{String(value).padStart(2, '0')}</span>
            <span className="mt-1 text-[10px] font-light uppercase tracking-wider text-legenda">{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <a href={CALENDAR_URL} target="_blank" rel="noreferrer" className="btn-outline">
          <CalendarPlus size={18} /> Adicionar à agenda
        </a>
      </div>
    </section>
  );
}

