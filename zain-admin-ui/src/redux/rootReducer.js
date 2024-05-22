import { combineReducers } from "redux";
import layoutReducer from "./layout";
import navbarReducer from "./navbar";
import { userAuthApi } from "../services/userAuthApi";
import { blogApi } from "../services/blogApi";
import userReducer from "./slices/userInfo-slice";

const rootReducer = combineReducers({
  navbar: navbarReducer,
  layout: layoutReducer,
  user: userReducer,
  [userAuthApi.reducerPath]: userAuthApi.reducer,
  [blogApi.reducerPath]: blogApi.reducer,
});

export default rootReducer;
