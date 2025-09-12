// redux/services/projects/projectsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export interface ProjectPayload {
  organization_name: string;
  project_name: string;
}

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev",
    prepareHeaders: (headers) => {
      const session_id = Cookies.get("token");
    //   const session_id = "1591e566-ab7c-4fd6-9c36-192305fa090b"; // temp hardcoded
      if (session_id) {
        headers.set("session_id", session_id);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createProject: builder.mutation<any, ProjectPayload>({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),
    }),
    getUserProjects: builder.query<any, void>({
      query: () => "/getUserProjects",
    }),
  }),
});

export const { useCreateProjectMutation, useGetUserProjectsQuery } = projectsApi;