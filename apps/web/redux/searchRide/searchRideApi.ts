import { RideSearch, RideSearchResult, SearchPayload } from "@ridex/common";
import { baseApi } from "../store/baseApi";

const searchRideApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    searchRides: builder.query<{ "message": string, "data": RideSearch[] }, SearchPayload>({
      query: (body) => ({
        url: `/rides/search`,
        method: 'POST',
        body: {
          from_lat: body.from_lat,
          from_lng: body.from_lng,
          to_lat: body.to_lat,
          to_lng: body.to_lng,
          departureTime: new Date(body.departureTime),
          availableSeats: body.availableSeats,
          maxDistanceKm: body.maxDistanceKm,
        }
      }),
      keepUnusedDataFor: 300,
      providesTags: [{ type: 'Search', id: 'LIST' }],
    })
  })
})

export const {
  useSearchRidesQuery,
  useLazySearchRidesQuery
} = searchRideApi