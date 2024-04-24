import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/blog/' }),
  endpoints: (builder) => ({
    submitComment: builder.mutation({
        query:({data, access_token, postId})=>{
            console.log('q userdata',data)
            console.log('q access_token',access_token)
            return{
                url:`posts/${postId}/comments/`,
                method: 'POST',
                body: data,
                headers: {
                    'authorization': `Bearer ${access_token}`,
                },
            }
        }
      }),
      submitReply: builder.mutation({
        query:({data, access_token, postId})=>{
            console.log('q userdata',data)
            return{
                url:`posts/${postId}/comments/`,
                method: 'POST',
                body: data,
                headers: {
                    'authorization': `Bearer ${access_token}`,
                },
            }
        }
      }),
    getComments: builder.mutation({
        query: (postId, token) => ({
          url: `posts/${postId}/`,
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
    }),
    
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useSubmitCommentMutation, useGetCommentsMutation, useSubmitReplyMutation } = blogApi;