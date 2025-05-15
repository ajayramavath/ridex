'use server'
import redis from "@/lib/redis";
import { getAuthSession } from "@/lib/authSession"
import { CreatePointSchema } from "@ridex/common";
import { fetchWithRetry } from "@/lib/fetchWrapper";
import { AddressComponent } from "./fetchAddress";

function getComponent(
  components: AddressComponent[],
  type: string
): string | undefined {
  return components.find(c => c.types.includes(type))?.long_name;
}


const getCity = (components: AddressComponent[]): string => {
  return (
    getComponent(components, 'locality') ||
    getComponent(components, 'postal_town') ||
    getComponent(components, 'administrative_area_level_2') ||
    getComponent(components, 'administrative_area_level_1') ||
    'Unknown City'
  );
};

export interface PlaceDetails {
  latitude: number;
  longitude: number;
  place_id: string;
  short_address: string;
  full_address: string;
  city: string;
  premise: string | undefined;
  postal_code: string | undefined;
}

export const fetchPlaceDetails = async (placeId: string) => {
  const session = await getAuthSession()
  if (!session || !session.user || !session.user.name) throw new Error('Unauthorized');

  const cacheKey = `place:${placeId}`;
  const cacheExpiry = 15552000; // 6 months

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("serving from cache", cached)
    return JSON.parse(cached);
  }

  const API_URL = process.env.GOOGLE_PLACE_DETAILS_URL;

  try {
    const response = await fetchWithRetry(`${API_URL}` +
      new URLSearchParams({
        place_id: placeId,
        fields: 'geometry,address_components,formatted_address',
        key: process.env.GOOGLE_PLACES_API_KEY!
      })
    );

    const data = await response.json();
    if (!data.result) throw new Error('Place not found');

    const pointData: PlaceDetails = {
      latitude: data.result.geometry.location.lat,
      longitude: data.result.geometry.location.lng,
      place_id: placeId,
      short_address: buildShortAddress(data.result.address_components),
      full_address: data.result.formatted_address,
      premise: getAddressComponent(data.result.address_components, 'premise'),
      postal_code: getAddressComponent(data.result.address_components, 'postal_code'),
      city: getCity(data.result.address_components)
    };

    const finalPointData = CreatePointSchema.parse(pointData)

    redis.set(`place:${placeId}`, JSON.stringify(finalPointData), "EX", cacheExpiry);

    return finalPointData
  } catch (error) {

  }
}

function getAddressComponent(components: any[], type: string): string | undefined {
  return components.find(c => c.types.includes(type))?.short_name;
}

function buildShortAddress(components: any[]): string {
  const premise = getAddressComponent(components, 'premise');
  const neighborhood = getAddressComponent(components, 'neighborhood') ||
    getAddressComponent(components, 'sublocality_level_1');
  return [premise, neighborhood].filter(Boolean).join(', ');
}