import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

	const secretURL = process.env.REACT_APP_SECRET_URL;
	const testURL = process.env.REACT_APP_TEST_URL;

export const adminApi = createApi({
	reducerPath: "adminApi",
	baseQuery: fetchBaseQuery({ baseUrl: secretURL + "/api/game-data" }),
	endpoints: (builder) => ({
		getGameInfo: builder.query({
			query: () => `/`,
		}),
	}),
});

export const { useGetGameInfoQuery } = adminApi;