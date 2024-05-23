import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


// Define a service using a base URL and expected endpoints
export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}/blog/` }),
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
    // Comments Queries-------------
    submitComment: builder.mutation({
        query:({data, access_token, postId})=>{
            return{
                url:`posts/${postId}/comments/`,
                method: 'POST',
                body: data,
                headers: {
                    'authorization': `Bearer ${access_token}`,
                    'ngrok-skip-browser-warning':"1233",
                },
            }
        }
      }),
      getComment: builder.mutation({
        query:({access_token, postId})=>{
            return{
                url:`posts/${postId}/comments/`,
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${access_token}`,
                    'ngrok-skip-browser-warning':"1233",
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
                    'ngrok-skip-browser-warning':"1233",
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
                  'ngrok-skip-browser-warning':"1233",
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
                  'Content-Type': 'application/json',
                  'ngrok-skip-browser-warning':"1233",
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
                  'Content-Type': 'application/json',
                  'ngrok-skip-browser-warning':"1233",
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
                  'Content-Type': 'application/json',
                  'ngrok-skip-browser-warning':"1233",
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
export const { useSubmitCommentMutation, useGetTagsMutation, useGetCategoriesMutation, useSubmitReplyMutation, useSubmitVoteMutation, useUpdateVoteMutation, useGetVoteMutation, useGetPostsMutation, useGetCommentMutation } = blogApi;