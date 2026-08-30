import type { LabelHTMLAttributes, ReactNode } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export function Label({ className = '', children, ...props }: LabelProps) {
  return (
    <label
      className={`mb-2 block font-mono text-[11px] font-bold uppercase tracking-wide text-slate-600 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
