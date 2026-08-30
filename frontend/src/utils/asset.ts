import type { AssetCategory } from '../types/asset';

export const categoryEmojis: Record<AssetCategory, string> = {
  Mechanical: '⚙️',
  Vehicle: '🚜',
  'IT Equipment': '🖥️',
  'Office Equipment': '🖨️',
  Electrical: '⚡',
};

export function getCategoryEmoji(category: AssetCategory): string {
  return categoryEmojis[category];
}
