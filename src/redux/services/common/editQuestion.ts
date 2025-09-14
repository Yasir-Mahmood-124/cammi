// src/redux/services/commonsde/editQuestion.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface EditQuestionRequest {
  project_id: string; // header
  question_text: string;
  answer_text: string;
}

interface EditQuestionResponse {
  message: string;
}

export const editQuestionApi = createApi({
  reducerPath: "editQuestionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev",
  }),
  endpoints: (builder) => ({
    editQuestion: builder.mutation<EditQuestionResponse, EditQuestionRequest>({
      query: ({ project_id, question_text, answer_text }) => ({
        url: "/edit-questions",
        method: "PUT",
        headers: {
          project_id,
        },
        body: {
          question_text,
          answer_text,
        },
      }),
    }),
  }),
});

export const { useEditQuestionMutation } = editQuestionApi;
