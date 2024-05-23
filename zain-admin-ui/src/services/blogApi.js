import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}/blog/`}),
  endpoints: (builder) => ({
    getPosts: builder.mutation({
      query:(p_url)=>{
          console.log('post query url',p_url)
          return{
              url: p_url,
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'ngrok-skip-browser-warning':"1233",
              },
          }
      }
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPostsMutation } = blogApi;

