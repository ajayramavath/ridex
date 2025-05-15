import { baseApi } from "@/redux/store/baseApi";
import { GetRideResult, Ride, RideWithPoints } from '@ridex/common'

const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRideById: builder.query<GetRideResult, string>({
      query: (id) => ({
        url: `/rides/${id}`,
        method: 'GET'
      }),
      providesTags: ["Ride"],
      transformResponse: (response: { data: GetRideResult }) => response.data,
    })
  })
})

export const {
  useGetRideByIdQuery
} = rideApi