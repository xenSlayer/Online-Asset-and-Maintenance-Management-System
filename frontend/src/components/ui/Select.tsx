import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown, User } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', options, placeholder, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <User size={18} />
        </div>
        <select
          ref={ref}
          className={[
            'h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white',
            'pl-10 pr-10 text-sm text-text',
            'focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          defaultValue=""
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <ChevronDown size={18} />
        </div>
      </div>
    );
  },
);

Select.displayName = 'Select';
