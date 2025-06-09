import { baseApi } from "../store/baseApi";
import { User, GetUserResponse, Vehicle, UploadUrlType, UpdateUserPreference, AddVehicle, RemoveVehiclePhoto } from '@ridex/common'

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<GetUserResponse, void>({
      query: () => ({
        url: "/user/get-user",
      }),
      transformResponse: (response: { data: GetUserResponse }) => response.data,
      extraOptions: {
        withAuth: true
      },
      providesTags: ["User"]
    }),
    updateProfileInfo: builder.mutation<Omit<User, 'password'>, Pick<User, 'name' | "bio">>({
      query: (body) => ({
        url: "/user/update-profile-info",
        method: "PATCH",
        body
      }),
      invalidatesTags: ["User"],
      extraOptions: {
        withAuth: true
      },
      async onQueryStarted(updates, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData("getUser", undefined, (draft) => {
            Object.assign(draft, updates)
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo()
        }
      }
    }),
    updateProfilePhoto: builder.mutation<Omit<User, 'password'>, { url: string }>({
      query: (body) => ({
        url: "/user/update-profile-photo",
        method: "POST",
        body
      }),
      extraOptions: {
        withAuth: true
      },
      invalidatesTags: ["User"],
    }),
    deleteProfilePhoto: builder.mutation<void, void>({
      query: () => ({
        url: "/user/delete-profile-photo",
        method: "DELETE"
      }),
      invalidatesTags: ["User"],
      extraOptions: {
        withAuth: true
      }
    }),
    saveVehicle: builder.mutation<Vehicle, AddVehicle>({
      query: (body) => ({
        url: "/user/save-vehicle",
        method: "POST",
        body
      }),
      invalidatesTags: ["User"],
      extraOptions: {
        withAuth: true
      }
    }),
    deleteVehicle: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/delete-vehicles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData('getUser', undefined, (draft) => {
            draft.vehicle = undefined;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    getUploadUrl: builder.query<{ url: string, key: string }, UploadUrlType>({
      query: (body) => ({
        url: `/user/upload-url`,
        method: 'GET',
        params: {
          type: body.type,
          fileType: body.fileType
        }
      }),
      transformResponse: (response: { data: { url: string, key: string } }) => response.data,
      extraOptions: {
        withAuth: true
      }
    }),
    getViewUrl: builder.query({
      query: (key) => ({
        url: `/user/view-url`,
        method: 'GET',
        params: { key }
      }),
      transformResponse: (response: { data: string }) => response.data,
    }),
    getUserById: builder.query<GetUserResponse, string>({
      query: (id) => ({
        url: `/user/getUserById/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: { data: GetUserResponse }) => response.data
    }),
    updateUserPreference: builder.mutation<Omit<User, 'password' | 'refresh_token'>, Partial<UpdateUserPreference>>({
      query: (body) => ({
        url: `/user/update-preference`,
        method: 'POST',
        body
      }),
      invalidatesTags: ["User"],
      transformResponse: (response: { data: Omit<User, 'password' | 'refresh_token'> }) => response.data,
      extraOptions: {
        withAuth: true
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData("getUser", undefined, (draft) => {
            Object.assign(draft, body)
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      }
    }),
    removeVehiclePhoto: builder.mutation<void, RemoveVehiclePhoto>({
      query: (body) => ({
        url: `/user/remove-vehicle-photo`,
        method: 'POST',
        body
      }),
      invalidatesTags: ["User"],
      extraOptions: {
        withAuth: true
      }
    })
  })
})

export const {
  useGetUserQuery,
  useUpdateProfileInfoMutation,
  useDeleteVehicleMutation,
  useSaveVehicleMutation,
  useUpdateProfilePhotoMutation,
  useLazyGetUploadUrlQuery,
  useDeleteProfilePhotoMutation,
  useGetUploadUrlQuery,
  useGetViewUrlQuery,
  useGetUserByIdQuery,
  useUpdateUserPreferenceMutation,
  useRemoveVehiclePhotoMutation
} = userApi