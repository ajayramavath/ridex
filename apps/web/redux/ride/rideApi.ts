import { baseApi } from "@/redux/store/baseApi";
import { GetRideResult, Ride, RideByIdResult } from '@ridex/common'

const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRideById: builder.query<RideByIdResult, string>({
      query: (id) => ({
        url: `/rides/${id}`,
        method: 'GET'
      }),
      providesTags: ["Ride"],
      transformResponse: (response: { data: RideByIdResult }) => response.data,
    })
  })
})

export const {
  useGetRideByIdQuery
} = rideApi