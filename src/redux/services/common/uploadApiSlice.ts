//redux/services/common/uploadApiSlice

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const uploadApiSlice = createApi({
  reducerPath: 'uploadApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://f72ud2dnbi.execute-api.us-east-1.amazonaws.com/cammi-dev',
    credentials: "include",
  }),
  endpoints: (builder) => ({
    uploadTextFile: builder.mutation({
      query: (body) => ({
        url: 'upload',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      }),
    }),
  }),
});

export const { useUploadTextFileMutation } = uploadApiSlice;
