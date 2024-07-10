import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// Define a service using a base URL and expected endpoints
export const commerceApi = createApi({
  reducerPath: 'commerceApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}/commerce/` }),
  endpoints: (builder) => ({
    getProducts: builder.mutation({
      query:()=>{
          return{
              url: 'list/',
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'ngrok-skip-browser-warning':"1233",
              },
          }
      }
    }),
    getProduct: builder.mutation({
      query:(productId)=>{
          return{
              url: `product/${productId}/`,
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'ngrok-skip-browser-warning':"1233",
              },
          }
      }
    }),
    addCheckout: builder.mutation({
      query:({data, access_token})=>{
          return{
              url: `product/checkout/`,
              method: 'POST',
              body: data,
              headers: {
                  'Content-Type': 'application/json',
                  'ngrok-skip-browser-warning':"1233",
                  'Authorization': `Bearer ${access_token}`
              },
          }
      }
    }),
    addSubscriptionCheckout: builder.mutation({
      query:({data, access_token})=>{
          return{
              url: `premium/checkout/`,
              method: 'POST',
              body: data,
              headers: {
                  'Content-Type': 'application/json',
                  'ngrok-skip-browser-warning':"1233",
                  'Authorization': `Bearer ${access_token}`
              },
          }
      }
    }),
    paymentSuccess: builder.mutation({
      query:({data, access_token})=>{
        console.log("query------------- ")
          return{
              url: `payment/success/`,
              method: 'POST',
              body: data,
              headers: {
                  'Content-Type': 'application/json',
                  'ngrok-skip-browser-warning':"1233",
                  'Authorization': `Bearer ${access_token}`
              },
          }
      }
    }),
//     addNotification: builder.mutation({
//       query:({data, access_token})=>{
//         console.log("notfication token", access_token);
//           return{
//               url:'add/',
//               method: 'POST',
//               body: data,
//               headers: {
//                   'Content-Type': 'application/json',
//                   'Authorization': `Bearer ${access_token}`,
//                   'ngrok-skip-browser-warning':"1233",
//               },
//           }
//       }
//   }),
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
export const{ useGetProductsMutation, useAddSubscriptionCheckoutMutation, useGetProductMutation, useAddCheckoutMutation, usePaymentSuccessMutation } = commerceApi;