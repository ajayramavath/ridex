export function formatTimeAmPm(date: Date | null): string {
  if (!date) return 'not available';
  const curr = new Date(date)
  let hours = curr.getHours();
  const minutes = curr.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minutesPadded = minutes.toString().padStart(2, '0');
  const hoursPadded = hours.toString().padStart(2, '0');
  return `${hoursPadded}:${minutesPadded} ${ampm}`;
}

export function openGoogleMapsAt(lat: number, lng: number) {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function openGoogleMapsPlace(placeId: string) {
  const url = `https://www.google.com/maps/place/?q=place_id:${placeId}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}