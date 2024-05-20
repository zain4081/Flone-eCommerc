import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/blog/' }),
  endpoints: (builder) => ({
    // Comments Queries-------------
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
      // Likes (Votes) Queries-------------
      getVote: builder.mutation({
        query:({postId, access_token})=>{
            console.log('q access_token: ', access_token);
            return{
                url:`user-votes/${postId}`,
                method: 'GET',
                headers: {
                  'authorization': `Bearer ${access_token}`,
              },
            }
        }
      }),
      submitVote: builder.mutation({
        query:({data, postId})=>{
            console.log('q userdata',data)
            return{
                url:`posts/${postId}/likes/`,
                method: 'POST',
                body: data,
                headers: {
                  'Content-Type': 'application/json'
              },
            }
        }
      }),
      updateVote: builder.mutation({
        query:({data, postId})=>{
            console.log('q userdata',data)
            return{
                url:`posts/${postId}/likes/${data.id}/`,
                method: 'PUT',
                body: data,
                headers: {
                  'Content-Type': 'application/json'
              },
            }
        }
      }),

      // Filter Sidebar (Tag, Categories) Quires
      getTags: builder.mutation({
        query:()=>{
            return{
                url:`tags/`,
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                },
            }
        }
      }),
      getCategories: builder.mutation({
        query:()=>{
            return{
                url:`categories/`,
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
export const { useSubmitCommentMutation, useGetTagsMutation, useGetCategoriesMutation, useSubmitReplyMutation, useSubmitVoteMutation, useUpdateVoteMutation, useGetVoteMutation,  } = blogApi;