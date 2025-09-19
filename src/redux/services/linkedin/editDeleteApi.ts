import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const editDeleteApi = createApi({
  reducerPath: "editDeleteApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    editDelete: builder.mutation<
      { success: boolean; error?: string }, // Response shape
      { sub: string; post_time: string; action: "edit" | "delete" } // Request body
    >({
      query: (body) => ({
        url: "/edit-delete",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useEditDeleteMutation } = editDeleteApi;
