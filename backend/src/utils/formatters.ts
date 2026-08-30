export function formatRequestId(id: number) {
  return `MR-${String(id).padStart(4, '0')}`;
}

export function formatRecordId(id: number) {
  return `REC-${String(id).padStart(4, '0')}`;
}

export function formatAssetId(id: number) {
  return `AST-${String(id).padStart(3, '0')}`;
}

export function formatDisplayDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function parseAssetId(id: string) {
  const numericId = Number(id.replace(/^AST-/, ''));

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error('Invalid asset ID');
  }

  return numericId;
}

export function parseRequestId(id: string) {
  const numericId = Number(id.replace(/^MR-/, ''));

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error('Invalid request ID');
  }

  return numericId;
}

export function parseTechnicianUserId(id: string) {
  const numericId = Number(id.replace(/^TEC-/, '').replace(/^U-/, ''));

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error('Invalid technician ID');
  }

  return numericId;
}

const AVATAR_COLORS = ['#4F46E5', '#2563EB', '#059669', '#7C3AED', '#DB2777'];

export function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}
