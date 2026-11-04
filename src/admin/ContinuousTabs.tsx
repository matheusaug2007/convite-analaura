import { LayoutGroup, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

/**
 * Adaptado do "Continuous Tabs" do Watermelon (ui.watermelon.sh):
 * abas com uma pílula que desliza de uma para outra.
 */
export interface TabItem<T extends string> {
  id: T;
  label: string;
  fullLabel?: string;
  icon?: LucideIcon;
}

interface ContinuousTabsProps<T extends string> {
  tabs: readonly TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
}

export default function ContinuousTabs<T extends string>({ tabs, value, onChange }: ContinuousTabsProps<T>) {
  return (
    <LayoutGroup>
      <nav className="mt-4 flex gap-1 rounded-full border border-white/70 bg-white/70 p-1 shadow-xs">
        {tabs.map(({ id, label, fullLabel, icon: Icon }) => {
          const isActive = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className="relative flex flex-1 items-center justify-center rounded-full px-1.5 py-2 outline-none sm:px-3"
            >
              {isActive && (
                <motion.div
                  layoutId="admin-active-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.9 }}
                  style={{ backgroundColor: 'var(--button-color)' }}
                  className="absolute inset-0 rounded-full shadow-xs"
                />
              )}
              <span
                className={`relative z-10 flex items-center gap-1 text-[11px] font-semibold transition-colors duration-200 sm:gap-1.5 sm:text-xs ${
                  isActive ? 'text-white' : 'text-legenda hover:text-nude'
                }`}
              >
                {Icon && <Icon size={14} className="shrink-0" />}
                <span className="sm:hidden">{label}</span>
                <span className="hidden sm:inline">{fullLabel ?? label}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </LayoutGroup>
  );
}
