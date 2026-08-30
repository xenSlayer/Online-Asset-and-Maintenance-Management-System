export function formatDisplayDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
