import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/auth/authApi";
import { projectsApi } from "./services/projects/projectApi";
import { refineApi } from "./services/common/refineApi";
import { uploadApiSlice } from "./services/common/uploadApiSlice";
import submenuReducer from "./services/features/submenuSlice";
import { realTimeDataApi } from "./services/common/realTimeData";
import { downloadApi } from "./services/common/downloadApi";
import { aiGenerateApi } from "./services/linkedin/aiGenerateApi";
import { linkedinLoginApi } from "./services/linkedin/linkedinLoginApi";
import { linkedinPostApi } from "./services/linkedin/linkedinPostApi";
import { schedulePostApi } from "./services/linkedin/schedulePostApi";
import { viewApiSlice } from "./services/linkedin/viewApiSlice";

export const store = configureStore({
  reducer: {
    submenu: submenuReducer,
    [authApi.reducerPath]: authApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [refineApi.reducerPath]: refineApi.reducer,
    [uploadApiSlice.reducerPath]: uploadApiSlice.reducer,
    [realTimeDataApi.reducerPath]: realTimeDataApi.reducer,
    [downloadApi.reducerPath]: downloadApi.reducer,
    [aiGenerateApi.reducerPath]: aiGenerateApi.reducer,
    [linkedinLoginApi.reducerPath]: linkedinLoginApi.reducer,
    [linkedinPostApi.reducerPath]: linkedinPostApi.reducer,
    [schedulePostApi.reducerPath]: schedulePostApi.reducer,
    [viewApiSlice.reducerPath]: viewApiSlice.reducer,
    
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        authApi.middleware,
        projectsApi.middleware,
        refineApi.middleware,
        uploadApiSlice.middleware,
        realTimeDataApi.middleware,
        downloadApi.middleware,
        aiGenerateApi.middleware,
        linkedinLoginApi.middleware,
        linkedinPostApi.middleware,
        schedulePostApi.middleware,
        viewApiSlice.middleware,
      ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
