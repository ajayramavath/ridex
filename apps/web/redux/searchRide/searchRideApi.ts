import { RideSearchResult, SearchPayload } from "@ridex/common";
import { baseApi } from "../store/baseApi";

const searchRideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchRide: builder.mutation<RideSearchResult, SearchPayload>({
      query: (body) => ({
        url: `/rides/search`,
        method: 'POST',
        body: {
          from: body.from,
          to: body.to,
          departureTime: new Date(body.departureTime),
          availableSeats: body.availableSeats,
          maxDistanceKm: body.maxDistanceKm,
        }
      }),
      transformResponse: (response: { data: RideSearchResult }) => response.data
    })
  })
})

export const {
  useSearchRideMutation
} = searchRideApi