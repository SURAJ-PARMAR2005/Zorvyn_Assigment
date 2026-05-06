import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { createPortal } from 'react-dom';

export type PremiumDropdownOption<T extends string> = {
  label: string;
  value: T;
  icon?: React.ReactNode;
  tone?: 'emerald' | 'blue' | 'rose' | 'amber' | 'slate';
};

export type PremiumDropdownProps<T extends string> = {
  value: T;
  options: Array<PremiumDropdownOption<T>>;
  onChange: (value: T) => void;
  align?: 'left' | 'right';
  size?: 'sm' | 'md';
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  buttonContent?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  hideSelectedIcon?: boolean;
  iconButton?: boolean;
};

const toneClasses: Record<NonNullable<PremiumDropdownOption<string>['tone']>, string> = {
  emerald: 'text-emerald-300',
  blue: 'text-blue-300',
  rose: 'text-rose-300',
  amber: 'text-amber-300',
  slate: 'text-slate-200',
};

const toneClassesLight: Record<NonNullable<PremiumDropdownOption<string>['tone']>, string> = {
  emerald: 'text-emerald-700',
  blue: 'text-blue-700',
  rose: 'text-rose-700',
  amber: 'text-amber-700',
  slate: 'text-slate-950',
};

export function PremiumDropdown<T extends string>(props: PremiumDropdownProps<T>) {
  const {
    value,
    options,
    onChange,
    align = 'right',
    size = 'md',
    className,
    buttonClassName,
    menuClassName,
  buttonContent,
    placeholder,
    disabled,
  hideSelectedIcon,
  iconButton,
  } = props;

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const selected = useMemo(() => options.find((o) => o.value === value), [options, value]);
  const safeValue = useMemo(() => {
    if (options.some((o) => o.value === value)) return value;
    return options[0]?.value;
  }, [options, value]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current) return;
      const target = e.target as Node | null;
      if (target && !rootRef.current.contains(target)) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const el = btnRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const width = 224; // 14rem default
      const left = align === 'right' ? Math.max(8, r.right - width) : Math.min(window.innerWidth - width - 8, r.left);
      const top = Math.min(window.innerHeight - 16, r.bottom + 8);
      setMenuPos({ top, left, width });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, align]);

  const compact = size === 'sm';

  const menu = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          className={cn('premium-dd-menu', 'premium-dd-menu--fixed', menuClassName)}
          role="menu"
          style={
            menuPos
              ? {
                  position: 'fixed',
                  top: menuPos.top,
                  left: menuPos.left,
                  width: menuPos.width,
                }
              : undefined
          }
        >
          {options.map((opt) => {
            const active = opt.value === safeValue;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn('premium-dd-item', active && 'premium-dd-item--active')}
                role="menuitem"
              >
                <span className="flex items-center gap-2 min-w-0">
                  {opt.icon ? (
                    <span className="shrink-0 [&_svg]:stroke-current [&_svg]:fill-none [html[data-theme='light']_&]:[&_svg]:stroke-black">
                      {opt.icon}
                    </span>
                  ) : null}
                  <span
                      className={cn(
                        'truncate',
                        opt.tone ? toneClasses[opt.tone] : 'text-slate-200',
                        // Light theme: ensure readable text while keeping tone
                        opt.tone
                          ? `[html[data-theme='light']_&]:${toneClassesLight[opt.tone]}`
                          : "[html[data-theme='light']_&]:text-slate-950"
                      )}
                  >
                    {opt.label}
                  </span>
                </span>
                {!hideSelectedIcon && active ? (
                  <Check
                    size={16}
                    className="text-emerald-300 [html[data-theme='light']_&]:text-black"
                  />
                ) : null}
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        ref={btnRef}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'premium-dd-btn',
          compact ? 'premium-dd-btn--sm' : 'premium-dd-btn--md',
          disabled && 'opacity-50 cursor-not-allowed',
          iconButton && 'premium-dd-btn--icon',
          "[&_svg]:stroke-current [&_svg]:fill-none [html[data-theme='light']_&]:[&_svg]:stroke-black",
          buttonClassName
        )}
      >
        {buttonContent ? (
          <>{buttonContent}</>
        ) : (
          <>
            <span className="flex items-center gap-2 min-w-0">
              {selected?.icon ? (
                <span className="shrink-0 [&_svg]:stroke-current [&_svg]:fill-none [html[data-theme='light']_&]:[&_svg]:stroke-black">
                  {selected.icon}
                </span>
              ) : null}
              <span
                className={cn(
                  'truncate text-left',
                  selected?.tone ? toneClasses[selected.tone] : 'text-slate-200',
                  selected?.tone
                    ? `[html[data-theme='light']_&]:${toneClassesLight[selected.tone]}`
                    : "[html[data-theme='light']_&]:text-slate-950"
                )}
              >
                {selected?.label ?? placeholder ?? 'Select'}
              </span>
            </span>
            <ChevronDown
              size={compact ? 14 : 16}
              className={cn(
                'shrink-0 transition-transform text-slate-300 [html[data-theme=\'light\']_&]:text-black',
                open && 'rotate-180'
              )}
            />
          </>
        )}
      </button>

  {typeof document !== 'undefined' ? createPortal(menu, document.body) : null}
    </div>
  );
}
