// redux/services/projects
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const organizationsApi = createApi({
  reducerPath: "organizationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      const session_id = Cookies.get("token"); // get session_id from cookie
      if (session_id) {
        headers.set("session_id", session_id);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSpecific_organizations: builder.query<any, void>({
      query: () => ({
        url: "/getSpecific-organizations",
        method: "GET",
        body: {}, // body is empty JSON
      }),
    }),
  }),
});

export const { useGetSpecific_organizationsQuery } = organizationsApi;
