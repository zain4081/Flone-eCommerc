// ** Redux Imports
import { userAuthApi } from "../services/userAuthApi";
import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";



const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    }).concat(userAuthApi.middleware);
  },
});

export { store };
