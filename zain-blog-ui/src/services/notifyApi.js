import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// Define a service using a base URL and expected endpoints
export const notifyApi = createApi({
  reducerPath: 'notifyApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}/notification/` }),
  endpoints: (builder) => ({
    getNotifications: builder.mutation({
      query:(access_token)=>{
          console.log('notfications query list')
          return{
              url: 'list/',
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'authorization': `Bearer ${access_token}`,
                  'ngrok-skip-browser-warning':"1233",
              },
          }
      }
    }),
    markRead: builder.mutation({
      query:({data, access_token})=>{
          console.log('notfication read')
          return{
              url: `mark-as-read/`,
              method: 'PUT',
              body: data,
              headers: {
                  'Content-Type': 'application/json',
                  'authorization': `Bearer ${access_token}`,
                  'ngrok-skip-browser-warning':"1233",
              },
          }
      }
    }),
    addNotification: builder.mutation({
      query:({data, access_token})=>{
        console.log("notfication token", access_token);
          return{
              url:'add/',
              method: 'POST',
              body: data,
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${access_token}`,
                  'ngrok-skip-browser-warning':"1233",
              },
          }
      }
  }),
    // // Comments Queries-------------
    // submitComment: builder.mutation({
    //     query:({data, access_token, postId})=>{
    //         return{
    //             url:`posts/${postId}/comments/`,
    //             method: 'POST',
    //             body: data,
    //             headers: {
    //                 'authorization': `Bearer ${access_token}`,
    //                 'ngrok-skip-browser-warning':"1233",
    //             },
    //         }
    //     }
    //   }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const{ useGetNotificationsMutation, useMarkReadMutation, useAddNotificationMutation } = notifyApi;