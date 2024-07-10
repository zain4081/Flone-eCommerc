import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import productReducer from './slices/product-slice';
import currencyReducer from "./slices/currency-slice";
import cartReducer from "./slices/cart-slice";
import compareReducer from "./slices/compare-slice";
import wishlistReducer from "./slices/wishlist-slice";
import { userAuthApi } from "../services/userAuthApi";
import authReducer from "../store/slices/auth-slice";
import userReducer from "../store/slices/userInfo-slice";
import pageReducer from "../store/slices/pagination-slice";
import { blogApi } from '../services/blogApi';
import websocketReducer from './slices/websocketReducer';
import websocketMiddleware from './slices/websocketmiddleware';
import { notifyApi } from "../services/notifyApi";
import { commerceApi } from '../services/commerceApi';



const persistConfig = {
    key: "flone",
    version: 1.1,
    storage,
    blacklist: ["product"]
}

export const rootReducer = combineReducers({
    product: productReducer,
    currency: currencyReducer,
    cart: cartReducer,
    compare: compareReducer,
    wishlist: wishlistReducer,
    [userAuthApi.reducerPath]: userAuthApi.reducer,
    websocket: websocketReducer,
    auth: authReducer,
    user: userReducer,
    page: pageReducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [notifyApi.reducerPath]: notifyApi.reducer,
    [commerceApi.reducerPath]: commerceApi.reducer,
    
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
            
        }).concat((userAuthApi.middleware),(websocketMiddleware),(blogApi.middleware),(notifyApi.middleware),(commerceApi.middleware))
});

export const persistor = persistStore(store);

// serializableCheck: false,
//             immutableCheck: false,