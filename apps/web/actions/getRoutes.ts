'use server'

import { getAuthSession } from "@/lib/authSession";
import { fetchWithRetry } from "@/lib/fetchWrapper"
import { PlaceDetails } from "./getPlaceDetails";

export interface Route {
  description: string;
  distanceMeters: number;
  duration: string;
  polyline: {
    encodedPolyline: string;
  }
}

export const fetchRouteDetails = async ({ origin, destination }: { origin: PlaceDetails, destination: PlaceDetails }) => {
  const session = await getAuthSession()
  if (!session || !session.user || !session.user.name) throw new Error('Unauthorized');
  console.log("Fetching route:", origin, destination)

  try {
    const body = {
      origin: {
        location: {
          "latLng": {
            "latitude": origin.latitude,
            "longitude": origin.longitude
          }
        }
      },
      destination: {
        location: {
          "latLng": {
            "latitude": destination.latitude,
            "longitude": destination.longitude
          }
        }
      },
      travelMode: "DRIVE",
      computeAlternativeRoutes: true
    };

    const res = await fetchWithRetry(`${process.env.GOOGLE_MAP_ROUTE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.description,"
      },
      body: JSON.stringify(body)
    })
    const data: { routes: Route[] } = await res.json()
    return data.routes as Route[];
  } catch (error) {
    console.error(error)
  }
}