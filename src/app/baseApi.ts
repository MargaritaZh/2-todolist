import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { handleError } from "common/utils/handleError"

//обязательно в импорте createApi в конце библиотека react

// export const baseApi = createApi({
//   reducerPath: "todolistsApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.REACT_APP_BASE_URL,
//     prepareHeaders: headers => {
//       headers.set("API-KEY", `${process.env.REACT_APP_API_KEY}`)
//       headers.set("Authorization", `Bearer ${localStorage.getItem("sn-token")}`)
//     }
//   }),
//   //без этого не будет работать,такой синтаксис
//   endpoints: () => ({}),
//   //регистрируем тэги все наши
//   tagTypes: ["Todolist", "Task"]
// })


export const baseApi = createApi({
  reducerPath: "todolistsApi",
  baseQuery: async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: process.env.REACT_APP_BASE_URL,
      prepareHeaders: headers => {
        headers.set("API-KEY", `${process.env.REACT_APP_API_KEY}`)
        headers.set("Authorization", `Bearer ${localStorage.getItem("sn-token")}`)
      }
    })(args, api, extraOptions)

    //обработка ошибок
    handleError(api, result)

    return result
  },
  //без этого не будет работать,такой синтаксис
  endpoints: () => ({}),
  //регистрируем тэги все наши
  tagTypes: ["Todolist", "Task"],
  //управлением времени кэширования
  keepUnusedDataFor: 5,
  refetchOnFocus: true,
  //возобновить автоматически запросы когда появится отвалившийся интернет:
  refetchOnReconnect: true,


})




