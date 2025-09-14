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
import {getUnansweredQuestionsApi} from "./services/common/getUnansweredQuestionsApi";
import { addQuestionApi } from "./services/common/addQuestion";
import { getQuestionsApi } from "./services/common/getQuestionsApi";
import { editQuestionApi } from "./services/common/editQuestion";

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
    [getUnansweredQuestionsApi.reducerPath]: getUnansweredQuestionsApi.reducer,
    [addQuestionApi.reducerPath]: addQuestionApi.reducer,
    [getQuestionsApi.reducerPath]: getQuestionsApi.reducer,
    [editQuestionApi.reducerPath]: editQuestionApi.reducer,
    
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
        getUnansweredQuestionsApi.middleware,
        addQuestionApi.middleware,
        getQuestionsApi.middleware,
        editQuestionApi.middleware,
      ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
