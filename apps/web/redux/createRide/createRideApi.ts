import { CreatePointInput, CreateRideInput, Point, Ride } from '@ridex/common'
import { baseApi } from '../store/baseApi'

export const createRideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPoint: builder.mutation<Point, CreatePointInput>({
      query: (body) => ({
        url: '/rides/create-point',
        method: 'POST',
        body
      }),
      transformResponse: (response: { data: Point }) => response.data
    }),
    createRide: builder.mutation<Ride, CreateRideInput>({
      query: (body) => ({
        url: '/rides/create-ride',
        method: 'POST',
        body,
      }),
      extraOptions: {
        withAuth: true
      }
    })
  })
})

export const {
  useCreatePointMutation,
  useCreateRideMutation
} = createRideApi