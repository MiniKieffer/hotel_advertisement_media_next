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
          headers: {
            'Content-Type': 'application/json',
          },
        }),
    }),
    signupUser: builder.mutation({
        query: (userData) => ({
            url: '/auth/signup',
            method: 'POST',
            body: userData,
            headers: {
                'Content-Type': 'application/json',
            },
        }),
    })
  }),
});

export const { useSigninUserMutation, useSignupUserMutation } = userApi;