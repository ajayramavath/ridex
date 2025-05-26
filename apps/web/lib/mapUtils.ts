type DebounceFunction<T extends (...args: any[]) => void> = {
  (this: ThisParameterType<T>, ...args: Parameters<T>): void;
  cancel: () => void;
};

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): DebounceFunction<T> {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const later = () => {
      func.apply(this, args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  } as DebounceFunction<T>;

  debounced.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

export function haversineDistance([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getZoomLevel(distanceKm: number): number {
  if (distanceKm < 1) return 15;
  if (distanceKm < 5) return 14;
  if (distanceKm < 10) return 13;
  if (distanceKm < 20) return 12;
  if (distanceKm < 50) return 11;
  if (distanceKm < 100) return 10;
  if (distanceKm < 200) return 9;
  if (distanceKm < 400) return 8;
  return 7;
}

export function getMapCenter(departure: [number, number], destination: [number, number]) {
  const [lon1, lat1] = departure;
  const [lon2, lat2] = destination;

  const centerLat = (lat1 + lat2) / 2;
  const centerLon = (lon1 + lon2) / 2;

  return [centerLon, centerLat];
}


