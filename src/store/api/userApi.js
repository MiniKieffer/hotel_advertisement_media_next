import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    signinUser: builder.mutation({
        query: (credentials) => ({
          url: '/auth/signin',
          method: 'POST',
          body: credentials,
        }),
    }),
    signupUser: builder.mutation({
        query: (userData) => ({
            url: '/auth/signup',
            method: 'POST',
            body: userData,
        }),
    })
  }),
});

export const { useSigninUserMutation, useSignupUserMutation } = userApi;