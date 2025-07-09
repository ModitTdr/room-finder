import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = "http://localhost:3000/api/users/"
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    //user info
    getUser: builder.query({
      query: () => ({
        url: `me`,
        method: 'GET',
        credentials: "include"
      }),
    }),
    //user profile
    getUserProfile: builder.query({
      query: () => ({
        url: `me/userprofile`,
        method: 'GET',
        credentials: "include",
      })
    })
  }),
});

export const { useGetUserQuery, useGetUserProfileQuery } = userApi;