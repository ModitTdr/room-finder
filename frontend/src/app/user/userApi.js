// store/api/userApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }), // Your base API URL
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (userId) => `users/${userId}`,
    }),
  }),
});

export const { useGetUserQuery } = userApi;