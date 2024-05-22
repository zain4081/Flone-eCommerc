import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/account/' }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query:(user)=>{
          return{
              url:'login/',
              method: 'POST',
              body: user,
              headers: {
                  'Content-Type': 'application/json'
              },
          }
      }
    }),
    getLoggedUser: builder.mutation({
        query:(access_token)=>{
            return{
                url:'profile/',
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${access_token}`,
                },
            }
        }
      }),
      changePassword: builder.mutation({
        query:({userdata, access_token})=>{
            console.log('q userdata',userdata)
            console.log('q access_token',access_token)
            return{
                url:'changepassword/',
                method: 'POST',
                body: userdata,
                headers: {
                    'authorization': `Bearer ${access_token}`,
                },
            }
        }
      }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginUserMutation, useGetLoggedUserMutation, useChangePasswordMutation } = userAuthApi;