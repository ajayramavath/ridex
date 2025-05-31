import { Rating, Vehicle } from "@prisma/client";

export const getUserRating = (ratingsGot: Rating[]): number | string => {
  const validRatings = ratingsGot.filter(rating =>
    typeof rating?.score === 'number' &&
    !isNaN(rating.score) &&
    rating.score >= 0
  );
  if (validRatings.length === 0) return `0.0`;
  const sum = validRatings.reduce((total, rating) => total + rating.score, 0);
  const average = sum / validRatings.length;
  return parseFloat(average.toFixed(1));
}

export const getVehicleName = (vehicles: Vehicle | null): string => {
  if (!vehicles) return 'No Vehicle Information';
  return `${(vehicles.brand)} ${vehicles.name} - ${vehicles.color}`;
}

export const handleOpenMaps = (placeId: string) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}`;
  window.open(mapsUrl, '_blank', 'noopener,noreferrer');
};