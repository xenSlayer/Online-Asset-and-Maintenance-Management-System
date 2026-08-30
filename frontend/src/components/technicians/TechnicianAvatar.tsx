import { getInitials } from '../../utils/avatar';

interface TechnicianAvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'lg';
}

const sizeClasses = {
  sm: 'h-7 w-7 text-xs',
  lg: 'h-14 w-14 text-lg',
};

export function TechnicianAvatar({
  name,
  color,
  size = 'sm',
}: TechnicianAvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: color }}
    >
      {getInitials(name)}
    </div>
  );
}
