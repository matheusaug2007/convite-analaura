import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, CalendarPlus } from 'lucide-react';

/**
 * Adaptado do "Calendar Widget" do Watermelon (ui.watermelon.sh):
 * faixa de dias que rola de lado, com o dia da festa marcado e um cartão
 * com os detalhes logo abaixo.
 */
export interface CalendarEvent {
  title: string;
  time: string;
  href?: string;
  hrefLabel?: string;
}

interface CalendarWidgetProps {
  year: number;
  /** Mês de 0 a 11 */
  month: number;
  /** Eventos por data, no formato AAAA-MM-DD */
  events: Record<string, CalendarEvent[]>;
  initialSelectedDate: string;
  emptyText?: string;
}

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const pad = (n: number) => String(n).padStart(2, '0');

export default function CalendarWidget({
  year,
  month,
  events,
  initialSelectedDate,
  emptyText = 'Nada marcado neste dia',
}: CalendarWidgetProps) {
  const [selected, setSelected] = useState(initialSelectedDate);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return { day, key: `${year}-${pad(month + 1)}-${pad(day)}`, weekday: WEEKDAYS[new Date(year, month, day).getDay()] };
  });

  // Começa com o dia da festa no centro da faixa
  useEffect(() => {
    const scroller = scrollRef.current;
    const target = scroller?.querySelector<HTMLElement>(`[data-date="${initialSelectedDate}"]`);
    if (scroller && target) {
      scroller.scrollLeft = target.offsetLeft - scroller.clientWidth / 2 + target.clientWidth / 2;
    }
  }, [initialSelectedDate]);

  // Arrastar com o mouse (no celular a rolagem já é nativa)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    const down = (e: MouseEvent) => {
      dragging = true;
      startX = e.pageX;
      startScroll = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };
    const up = () => {
      dragging = false;
      el.style.cursor = 'grab';
    };
    const move = (e: MouseEvent) => {
      if (!dragging) return;
      e.preventDefault();
      el.scrollLeft = startScroll - (e.pageX - startX);
    };
    el.style.cursor = 'grab';
    el.addEventListener('mousedown', down);
    el.addEventListener('mouseleave', up);
    el.addEventListener('mouseup', up);
    el.addEventListener('mousemove', move);
    return () => {
      el.removeEventListener('mousedown', down);
      el.removeEventListener('mouseleave', up);
      el.removeEventListener('mouseup', up);
      el.removeEventListener('mousemove', move);
    };
  }, []);

  const dayEvents = events[selected] ?? [];

  return (
    <div className="mx-auto flex w-full max-w-sm select-none flex-col rounded-[30px] border border-white/70 bg-[#FBF3EC] shadow-[0_8px_32px_rgba(179,123,92,0.15)]">
      <div className="p-4 pb-3">
        <div className="ml-2 text-lg font-semibold text-nude">
          {MONTHS[month]} {year}
        </div>

        <div ref={scrollRef} className="no-scrollbar mt-1 flex gap-2 overflow-x-auto px-2">
          {days.map(({ day, key, weekday }) => {
            const isSelected = selected === key;
            const hasEvent = (events[key]?.length ?? 0) > 0;
            return (
              <div key={key} data-date={key} className="relative flex min-w-10 flex-col items-center pt-3">
                <div
                  className={`mb-1 text-sm font-medium transition-colors duration-300 ${
                    isSelected ? 'text-nude' : 'text-legenda'
                  }`}
                >
                  {weekday}
                </div>

                <motion.button
                  type="button"
                  aria-label={`Dia ${day}`}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelected(key)}
                  className="relative flex flex-col items-center"
                >
                  <span className="relative flex h-10 w-10 items-center justify-center">
                    {isSelected && (
                      <motion.span
                        layoutId="selected-date-bg"
                        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                        style={{ backgroundColor: 'var(--button-color)' }}
                        className="absolute inset-0 rounded-full shadow-sm"
                      />
                    )}
                    <span className={`relative z-10 text-base font-medium ${isSelected ? 'text-white' : 'text-tinta/80'}`}>
                      {day}
                    </span>
                  </span>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {hasEvent && !isSelected && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0, filter: 'blur(4px)' }}
                        transition={{ duration: 0.3 }}
                        className="h-1.5 w-1.5 rounded-full bg-terracota"
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative min-h-[9.5rem] overflow-hidden rounded-[28px] border border-white/80 bg-white px-4 py-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {dayEvents.length ? (
            <motion.div key={selected} className="divide-y divide-stone-200/70">
              {dayEvents.map((event) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="flex flex-col gap-0.5 py-2"
                >
                  <span className="text-base font-semibold text-nude">{event.title}</span>
                  <span className="text-sm text-legenda">{event.time}</span>
                  {event.href && (
                    <a
                      href={event.href}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary mt-3 w-full !py-2.5 !text-xs"
                    >
                      <CalendarPlus size={15} /> {event.hrefLabel ?? 'Adicionar à agenda'}
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-events"
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex h-[8.5rem] flex-col items-center justify-center gap-2.5"
            >
              <span className="rounded-full bg-[#FBF3EC] p-4">
                <CalendarDays className="size-7 text-terracota" />
              </span>
              <p className="text-sm text-legenda">{emptyText}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
