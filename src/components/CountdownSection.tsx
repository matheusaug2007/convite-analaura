import { useEffect, useState } from 'react';
import CalendarWidget from './CalendarWidget';

// 26/12/2026 às 19h00 (horário de Brasília, UTC-3)
const EVENT_DATE = new Date('2026-12-26T19:00:00-03:00');

function diff() {
  const ms = Math.max(0, EVENT_DATE.getTime() - Date.now());
  return {
    dias: Math.floor(ms / 86400000),
    horas: Math.floor((ms / 3600000) % 24),
    min: Math.floor((ms / 60000) % 60),
    seg: Math.floor((ms / 1000) % 60),
  };
}

const CALENDAR_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  '&text=' +
  encodeURIComponent('15 Anos da Ana Laura Martins') +
  '&dates=20261226T220000Z/20261227T040000Z' +
  '&location=' +
  encodeURIComponent('Crystal Eventos, Mandaguari - PR') +
  '&details=' +
  encodeURIComponent('Venha comemorar comigo esse momento inesquecível!');

export default function CountdownSection() {
  const [t, setT] = useState(diff);
  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { label: 'dias', val: t.dias },
    { label: 'horas', val: t.horas },
    { label: 'min', val: t.min },
    { label: 'seg', val: t.seg },
  ];

  return (
    <section className="relative z-10 px-6 py-12">
      <h2 className="section-title">Save the date</h2>
      <p className="mt-1 text-center text-xs font-normal tracking-[0.22em] text-legenda">
        SÁBADO • 26 DE DEZEMBRO DE 2026 • 19H00
      </p>

      {/* Cápsula fluida e orgânica do contador, sem blocos quadrados pesados */}
      <div className="glass mx-auto mt-7 flex max-w-sm items-center justify-between px-5 py-4">
        {items.map((item, index) => (
          <div key={item.label} className="flex flex-1 items-center">
            <div className="flex flex-1 flex-col items-center">
              <span className="font-display text-2xl font-semibold tabular-nums text-terracota sm:text-3xl">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-light uppercase tracking-widest text-legenda">
                {item.label}
              </span>
            </div>
            {index < items.length - 1 && (
              <span className="select-none text-sm font-light text-terracota/30">:</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <CalendarWidget
          year={2026}
          month={11}
          initialSelectedDate="2026-12-26"
          emptyText="A festa é no dia 26 🌸"
          events={{
            '2026-12-26': [
              { href: CALENDAR_URL, hrefLabel: 'Adicionar à agenda' },
            ],
          }}
        />
      </div>
    </section>
  );
}
