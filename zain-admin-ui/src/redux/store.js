import { userAuthApi } from "../services/userAuthApi";
import { blogApi } from "../services/blogApi";
import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    }).concat(userAuthApi.middleware, blogApi.middleware);
  },
});

export { store };
