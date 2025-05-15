'use server'
import { PlaceDetails } from "./getPlaceDetails";

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Geometry {
  location: {
    lat: number;
    lng: number;
  };
  location_type: 'ROOFTOP' | 'RANGE_INTERPOLATED' | 'GEOMETRIC_CENTER' | 'APPROXIMATE';
  viewport: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  bounds?: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
}

interface PlusCode {
  compound_code?: string;
  global_code: string;
}

interface GeocodeResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code?: PlusCode;
  types: string[];
  partial_match?: boolean;
  postcode_localities?: string[];
}

interface GoogleGeocodeResponse {
  results: GeocodeResult[];
  status:
  | 'OK'
  | 'ZERO_RESULTS'
  | 'OVER_QUERY_LIMIT'
  | 'REQUEST_DENIED'
  | 'INVALID_REQUEST'
  | 'UNKNOWN_ERROR';
  error_message?: string;
  plus_code?: PlusCode;
}

export async function reverseGeocode(latitude: number, longitude: number) {

  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data: GoogleGeocodeResponse = await response.json();

    if (data.status !== 'OK') {
      throw new Error(data.error_message || 'Geocoding failed');
    }

    const placeDetails: PlaceDetails = extractPlaceDetailsWithFallbacks(data) as PlaceDetails;
    return placeDetails

  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

function generateShortAddress(result: GeocodeResult): string {
  const components = result.address_components;
  const parts = [
    getComponent(components, 'premise'),
    getComponent(components, 'route'),
    getComponent(components, 'sublocality') ||
    getComponent(components, 'locality')
  ];

  return parts.filter(Boolean).join(', ');
}

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

function extractPlaceDetailsWithFallbacks(
  response: GoogleGeocodeResponse
): PlaceDetails | null {
  if (response.status !== 'OK' || !response.results.length) return null;
  const rooftopResult = response.results.find(r =>
    r.geometry.location_type === 'ROOFTOP'
  );
  const result = rooftopResult || response.results[0];
  if (!result) return null;

  let shortAddress = generateShortAddress(result);
  if (!shortAddress.includes(',')) {
    shortAddress = [
      getComponent(result.address_components, 'sublocality'),
      getComponent(result.address_components, 'locality')
    ].filter(Boolean).join(', ');
  }

  return {
    latitude: result.geometry.location.lat,
    longitude: result.geometry.location.lng,
    place_id: result.place_id,
    short_address: shortAddress,
    full_address: result.formatted_address,
    premise: getComponent(result.address_components, 'premise'),
    postal_code: getComponent(result.address_components, 'postal_code'),
    city: getCity(result.address_components)
  };
}