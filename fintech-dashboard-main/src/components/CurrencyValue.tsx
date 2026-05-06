import React from 'react';
import { cn } from '../lib/utils';

interface CurrencyValueProps {
  value: string | number;
  className?: string;
  symbol?: string;
}

export const CurrencyValue = ({ value, className, symbol = '₹' }: CurrencyValueProps) => {
  const parts = String(value).split('.');
  return (
    <span className={cn("inline-flex items-start font-sans", className)}>
      <span>{parts[0]}</span>
      {parts[1] && <span className="text-[0.6em] mt-1">.{parts[1]}</span>}
      <span className="superscript-currency">{symbol}</span>
    </span>
  );
};
