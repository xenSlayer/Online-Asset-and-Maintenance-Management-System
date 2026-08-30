interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'sidebar';
}

const LOGO_SRC = '/icon.jpeg';

const variantClasses: Record<NonNullable<LogoProps['variant']>, string> = {
  // Invert only: white JPEG background blends into dark surfaces; logo stays visible.
  light: 'max-h-14 w-full invert object-contain object-left',
  dark: 'max-h-14 w-full object-contain object-left',
  sidebar: 'max-h-11 w-full invert object-contain object-left',
};

export function Logo({ className, variant = 'light' }: LogoProps) {
  return (
    <img
      src={LOGO_SRC}
      alt="OA Management System"
      className={`block ${variantClasses[variant]} ${className ?? ''}`}
    />
  );
}
