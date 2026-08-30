interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'sidebar';
}

export function Logo({ className = 'h-14', variant = 'light' }: LogoProps) {
  const variantClass =
    variant === 'light'
      ? 'brightness-0 invert'
      : variant === 'sidebar'
        ? 'h-11 brightness-0 invert mix-blend-screen'
        : '';

  return (
    <img
      src="/logo.svg"
      alt="OA Management System"
      className={`w-auto ${variantClass} ${className}`}
    />
  );
}
