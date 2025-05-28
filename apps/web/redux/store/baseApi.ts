import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta
} from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

export type ApiConfig = {
  withAuth?: boolean;
}

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  ApiConfig,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {


  const token = extraOptions?.withAuth
    ? (await getSession())?.accessToken.token
    : undefined;

  if (extraOptions?.withAuth && !token) {
    return {
      error: {
        status: 401,
        data: {
          message: 'Login to continue',
        }
      }
    }
  }

  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:8080',
    prepareHeaders: (headers) => {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const error = result.error
    if (error.status === 401) {
      return {
        error: {
          status: 401,
          data: {
            message: 'Unauthorized',
          }
        }
      }
    }
    return { error: result.error }
  }

  if (result.data) {
    return {
      data: result.data
    }
  }

  return {
    error: {
      status: 500,
      data: {
        message: 'Something went wrong. Please try again later',
      }
    }
  }
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Search', "User", "Ride"],
  endpoints: () => ({}),
});