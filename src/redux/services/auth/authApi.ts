// redux/services/auth/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Register now includes firstName and lastName
    register: builder.mutation<
      { message: string },
      { firstName: string; lastName: string; email: string; password: string }
    >({
      query: (body) => ({ url: "/register", method: "POST", body }),
    }),

    // Verify Email remains the same
    verifyEmail: builder.mutation<
      { message: string; user: { id: string; email: string } },
      { email: string; code: string }
    >({
      query: (body) => ({ url: "/verify-email", method: "POST", body }),
    }),

    // Login remains the same
    login: builder.mutation<
      { message: string; user: { id: string; email: string }; token: string },
      { email: string; password: string }
    >({
      query: (body) => ({ url: "/login", method: "POST", body }),
    }),

    // Logout remains the same
    logout: builder.mutation<{ message: string }, { token: string }>({
      query: ({ token }) => ({ url: "/logout", method: "POST", body: { token } }),
    }),

    // Forgot Password remains the same
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({ url: "/forgot-password", method: "POST", body }),
    }),

    // New API: Verify Code (takes email and code)
    verifyCode: builder.mutation<
      { message: string },
      { email: string; code: string }
    >({
      query: (body) => ({ url: "/verify-code", method: "POST", body }),
    }),

    // Reset Password now has email, newPassword, and confirmPassword
    resetPassword: builder.mutation<
      { message: string },
      { email: string; newPassword: string; confirmPassword: string }
    >({
      query: (body) => ({ url: "/reset-password", method: "POST", body }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyCodeMutation, // new
  useResetPasswordMutation,
} = authApi;
