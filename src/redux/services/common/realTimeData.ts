//redux/services/common/realTimeData.ts
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

interface RealTimeData {
  type: string;
  data: {
    session_id: string;
    project_id: string;
    user_id: string;
    document_type: string;
    key: string;
    tier: string;
    status: boolean;
    result: {
      session_id: string;
      token_usage: {
        input_tokens: number;
        output_tokens: number;
      };
      estimated_cost_usd: number;
    };
    content: {
      s3_key: string;
      content: string;
      content_length: number;
      status: string;
    };
    timestamp: string;
  };
}

export const realTimeDataApi = createApi({
  reducerPath: "realTimeDataApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getRealTimeData: builder.query<RealTimeData, void>({
      queryFn: () => ({ data: {} as RealTimeData }),
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) {
        const token = Cookies.get("token"); // session_id from cookie
        if (!token) {
          console.error("No session token found in cookies");
          return;
        }

        const ws = new WebSocket(
          `wss://4iqvtvmxle.execute-api.us-east-1.amazonaws.com/prod/?session_id=${token}`
        );

        try {
          await cacheDataLoaded;

          ws.onmessage = (event) => {
            const message = JSON.parse(event.data);

            // Update cache with incoming data
            updateCachedData(() => message);
          };
        } catch {
          // ignore
        }

        await cacheEntryRemoved;
        ws.close();
      },
    }),
  }),
});

export const { useGetRealTimeDataQuery } = realTimeDataApi;
