import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/auth/authApi";
import { projectsApi } from "./services/projects/projectApi";
import { refineApi } from "./services/common/refineApi";
import { uploadApiSlice } from "./services/common/uploadApiSlice";
import submenuReducer from "./services/features/submenuSlice";

export const store = configureStore({
  reducer: {
    submenu: submenuReducer,
    [authApi.reducerPath]: authApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [refineApi.reducerPath]: refineApi.reducer,
    [uploadApiSlice.reducerPath]: uploadApiSlice.reducer,
    
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        authApi.middleware,
        projectsApi.middleware,
        refineApi.middleware,
        uploadApiSlice.middleware,
      ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
