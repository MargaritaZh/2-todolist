import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
//обязательно в импорте в конце библиотека react

export const baseApi = createApi({
  reducerPath: "todolistsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
      prepareHeaders: headers => {
        headers.set("API-KEY", `${process.env.REACT_APP_API_KEY}`)
        headers.set("Authorization", `Bearer ${localStorage.getItem("sn-token")}`)
    },
  }),
  //без этого не будет работать,такой синтаксис
  endpoints: () => ({}),
  //регистрируем тэги все наши
  tagTypes: ['Todolist'],
})