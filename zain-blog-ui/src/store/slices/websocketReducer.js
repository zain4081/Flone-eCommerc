// slices/websocketReducer.js
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  message: "",
  count: 0,
}
const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    newMessage(state, action) {
      state.message = action.payload.message;
      state.count = action.payload.count;// Replace messages array with a new message
    },
    clearMessage(state, action) {
      state.message = "";
      state.count = 0;// Replace messages array with a new message
    },
  }
});

export const { newMessage, clearMessage } = websocketSlice.actions;
export default websocketSlice.reducer;


