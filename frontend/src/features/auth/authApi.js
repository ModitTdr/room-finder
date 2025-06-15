import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:3000/api/"
export const authApi = createApi({
   reducerPath: "authApi",
   tagTypes: ['User'], // Add this line
   
   prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
         headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
   },
   baseQuery: fetchBaseQuery({
      baseUrl: BASE_URL,
      credentials: "include",
   }),
   endpoints: (builder) => ({
      userLogin: builder.mutation({
         query: (data) => {
            return {
               url:'auth/login',
               method:'POST',
               body: data
            }
         },
         invalidatesTags: ['User'], 
      }),
      userRegister: builder.mutation({
         query: (data) => ({
            url: 'auth/signup',
            method: 'POST',
            body: data,
         }),
         invalidatesTags: ['User'],
      }),
      userStatus: builder.query({
         query: () => ({
            url: "auth/check",
            method: "GET",
            credentials: "include",
         }),
         providesTags: ['User'], 
      }),
      userLogout: builder.mutation({
         query: () => {
            return{
               url: 'auth/logout',
               method: "POST",
               credentials: "include",
            }
         },
         invalidatesTags: ['User'],
      })
   }),
});

export const {useUserLoginMutation, useUserRegisterMutation,useUserStatusQuery, useUserLogoutMutation} = authApi;