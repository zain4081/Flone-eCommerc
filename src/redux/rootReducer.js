// ** Reducers Imports
import { combineReducers } from "redux";
import layoutReducer from "./layout";
import navbarReducer from "./navbar";
import { userAuthApi } from "../services/userAuthApi";
import userReducer from "./slices/userInfo-slice";

const rootReducer = combineReducers({
    navbar: navbarReducer,
    layout: layoutReducer,
    user: userReducer,
    [userAuthApi.reducerPath]: userAuthApi.reducer, // Add the userAuthApi reducer
  })

export default rootReducer;

