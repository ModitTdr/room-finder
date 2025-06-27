import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./auth/authApi"; 
import { userApi } from "./user/userApi";

const store = configureStore({
  reducer:{
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, userApi.middleware),
});

export default store;