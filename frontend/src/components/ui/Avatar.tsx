import { getAvatarColor, getInitials } from '../../utils/avatar';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md';
}

const sizeClasses = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-7 w-7 text-xs',
};

export function Avatar({ name, size = 'md' }: AvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: getAvatarColor(name) }}
    >
      {getInitials(name)}
    </div>
  );
}
