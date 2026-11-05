import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Users } from 'lucide-react';

interface CompanionsButtonProps {
  count: number;
  names: string[] | null;
}

const POPOVER_WIDTH = 240;

/**
 * Botão "2 acompanhantes": no computador mostra os nomes ao passar o mouse,
 * no celular ao tocar. O balão é renderizado no <body>, então nunca é cortado
 * pela tabela nem pelo cartão.
 */
export default function CompanionsButton({ count, names }: CompanionsButtonProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean }>({ top: 0, left: 0, above: false });
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<string>('mouse');

  const list = (names ?? []).filter(Boolean);
  const label = `${count} ${count === 1 ? 'acompanhante' : 'acompanhantes'}`;

  // Posiciona o balão logo abaixo do botão (ou acima, se não houver espaço)
  useLayoutEffect(() => {
    if (!open || !btnRef.current || !popRef.current) return;
    const b = btnRef.current.getBoundingClientRect();
    const h = popRef.current.offsetHeight;
    const above = b.bottom + h + 12 > window.innerHeight && b.top - h - 12 > 0;
    const left = Math.min(Math.max(8, b.left), window.innerWidth - POPOVER_WIDTH - 8);
    setPos({ top: above ? b.top - h - 8 : b.bottom + 8, left, above });
  }, [open, list.length]);

  // Fecha ao tocar fora, apertar Esc ou rolar a página
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!btnRef.current?.contains(t) && !popRef.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const close = () => setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  if (count === 0) return <span className="text-xs text-legenda">—</span>;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onPointerEnter={(e) => {
          pointer.current = e.pointerType;
          if (e.pointerType === 'mouse') setOpen(true);
        }}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
        onClick={() => (pointer.current === 'mouse' ? setOpen(true) : setOpen((o) => !o))}
        onFocus={() => pointer.current === 'mouse' && setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#ECE8F1] px-2.5 py-1 text-[11px] font-semibold text-[#6D6283] transition hover:bg-[#E0D9EA] active:scale-95"
      >
        <Users size={13} />
        {label}
      </button>

      {open &&
        createPortal(
          <div
            ref={popRef}
            role="tooltip"
            style={{ top: pos.top, left: pos.left, width: POPOVER_WIDTH }}
            className="pointer-events-none fixed z-[9999] rounded-2xl border border-[#E4DDEE] bg-white p-3 shadow-[0_12px_32px_rgba(62,56,53,0.18)]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8B7FA3]">{label}</p>
            {list.length ? (
              <ul className="mt-1.5 space-y-1">
                {list.map((name, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-snug text-tinta">
                    <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B7ABCB]" />
                    <span className="break-words">{name}</span>
                  </li>
                ))}
                {count > list.length && (
                  <li className="pl-3.5 text-[11px] italic text-legenda">
                    + {count - list.length} sem nome informado
                  </li>
                )}
              </ul>
            ) : (
              <p className="mt-1.5 text-xs italic text-legenda">Nomes não informados</p>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
