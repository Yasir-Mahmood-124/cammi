// redux/services/common/downloadApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const downloadApi = createApi({
  reducerPath: 'downloadApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dvmm2ucegj.execute-api.us-east-1.amazonaws.com/cammi-prod',
  }),
  endpoints: (builder) => ({
    getDocxFile: builder.mutation<
      { docxBase64: string; fileName: string },
      void
    >({
      query: () => {
        const sessionId = Cookies.get('token'); // <-- get from cookies
        const storedProject  = localStorage.getItem("currentProject");
        const project = storedProject ? JSON.parse(storedProject) : null;

        console.log('Project ID from Local Storage:', project?.project_id);
        console.log('Session ID from Cookie:', sessionId);
        
        return {
          url: '/fetch',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            session_id: sessionId || '', // <-- pass in header
            document_type: 'gtm',
            project_id: project?.project_id || '', 
          },
        };
      },
    }),
  }),
});

export const { useGetDocxFileMutation } = downloadApi;
