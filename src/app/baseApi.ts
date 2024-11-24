import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setAppError } from "./appSlice"
import { Simulate } from "react-dom/test-utils"
import error = Simulate.error
//обязательно в импорте в конце библиотека react

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

    if (result.error) {
      //если нет интернета , ошибка сети
      if (result.error.status === "FETCH_ERROR") {
        api.dispatch(setAppError({ error: result.error.error }))
      }
      //если неправильно написали query-запрос
      if (result.error.status === "PARSING_ERROR") {
        api.dispatch(setAppError({ error: result.error.error }))
      }
      if (result.error.status === 403) {
        api.dispatch(setAppError({ error: '403 Forbidden Error. Check API-KEY' }))
      }
      if (result.error.status === 401) {
        api.dispatch(setAppError({ error: '401 Error. Check token'}))
      }



    }
    return result
  },
  //без этого не будет работать,такой синтаксис
  endpoints: () => ({}),
  //регистрируем тэги все наши
  tagTypes: ["Todolist", "Task"]
})




