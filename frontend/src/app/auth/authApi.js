import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:3000/api/auth"
export const authApi = createApi({
   reducerPath: "authApi",
   tagTypes: ['User'],

   baseQuery: fetchBaseQuery({
      baseUrl: BASE_URL,
      credentials: "include",
   }),
   endpoints: (builder) => ({
      //login
      userLogin: builder.mutation({
         query: (credentials) => {
            return {
               url: '/login',
               method: 'POST',
               body: credentials
            }
         },
         invalidatesTags: ['User'],
      }),
      //register
      userRegister: builder.mutation({
         query: (userData) => ({
            url: '/signup',
            method: 'POST',
            body: userData,
         }),
         invalidatesTags: ['User'],
      }),
      //check user status
      userStatus: builder.query({
         query: () => ({
            url: "/check",
            method: "GET",
            credentials: "include",
         }),
         providesTags: ['User'],
      }),
      //logout
      userLogout: builder.mutation({
         query: () => ({
            url: '/logout',
            method: "POST",
            credentials: "include",
         }),
         async onQueryStarted(arg, { dispatch, queryFulfilled }) {
            try {
               await queryFulfilled;
               dispatch(authApi.util.resetApiState());
            } catch (error) {
               console.log("Error: ", error)
            }
         },
      })
   }),
});

export const {
   useUserLoginMutation,
   useUserRegisterMutation,
   useUserStatusQuery,
   useUserLogoutMutation
} = authApi;