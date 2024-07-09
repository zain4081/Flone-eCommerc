import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}/account/` }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query:(user)=>{
          return{
              url:'admin-login/',
              method: 'POST',
              body: user,
              headers: {
                  'Content-Type': 'application/json',
                  'ngrok-skip-browser-warning':"1233",
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
                    'ngrok-skip-browser-warning':"1233",
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
                    'ngrok-skip-browser-warning':"1233",
                },
            }
        }
      }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginUserMutation, useGetLoggedUserMutation, useChangePasswordMutation } = userAuthApi;