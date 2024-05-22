import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/blog/' }),
  endpoints: (builder) => ({
    getPosts: builder.mutation({
      query:(user)=>{
          return{
              url:'posts/',
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              },
          }
      }
    }),
   
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPostsMutation } = blogApi;