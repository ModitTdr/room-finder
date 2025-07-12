import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = "http://localhost:3000/api/users/"
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    //user info
    getUser: builder.query({
      query: () => ({
        url: `me`,
        method: 'GET',
        credentials: "include"
      }),
      providesTags: ['User'],
    }),
    //user profile
    getUserProfile: builder.query({
      query: () => ({
        url: `me/userprofile`,
        method: 'GET',
        credentials: "include",
      }),
      invalidatesTags: ['User'],
    }),
    updateUserProfile: builder.mutation({
      query: (userData) => ({
        url: 'me/userprofile',
        method: 'PUT',
        credentials: "include",
        body: userData,
      }),
      invalidatesTags: ['User'],

    })
  }),
});

export const { useGetUserQuery, useGetUserProfileQuery, useUpdateUserProfileMutation } = userApi;