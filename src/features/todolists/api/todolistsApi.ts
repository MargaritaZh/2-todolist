import { instance } from "common/instance"
import { BaseResponse } from "common/types"
import { Todolist } from "./todolistsApi.types"


// 1
import { BaseQueryArg, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { DomainTodolist } from "../model/todolistsSlice"

// 2
export const todolistsApi = createApi({
  // 3
  reducerPath: "todolistsApi",
  // 4
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: headers => {
      headers.set("API-KEY", `${process.env.REACT_APP_API_KEY}`)
      headers.set("Authorization", `Bearer ${localStorage.getItem("sn-token")}`)
    }
  }),
  // 5
  endpoints: build => ({
    // 6
    // типизация query: то что возвращает///что будет принимать
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => {
        return {
          url: "todo-lists",
          method: "GET"
        }
      },
      //редактируем ответ,добавляем то что не приходит с сервера
      transformResponse(todolists: Todolist[]): DomainTodolist[] {
        return todolists.map(tl => ({ ...tl, filter: "all", entityStatus: "idle" }))
      }
    }),
    // типизация query: то что возвращает///что будет принимать
    addTodolists: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query(title) {
        return {
          url: "todo-lists",
          method: "POST",
          body: { title }
        }
      }
    }),
    updateTodolistTitle: build.mutation<BaseResponse, { id: string; title: string }>({
      query({ id, title }) {
        return {
          url: `todo-lists/${id}`,
          method: "PUT",
          body: { title }
        }
      }
    }),
    // типизация query: то что возвращает///что будет принимать
    deleteTodolist: build.mutation<BaseResponse, string>({
      query(id) {
        return {
          url: `todo-lists/${id}`,
          method: "DELETE",
          body: { id }
        }
      }
    }),

  })
})

// 7
export const {
  useGetTodolistsQuery,
  useLazyGetTodolistsQuery,
  useAddTodolistsMutation,
  useUpdateTodolistTitleMutation,
  useDeleteTodolistMutation
} = todolistsApi


export const _todolistsApi = {
  getTodolists() {
    return instance.get<Todolist[]>("todo-lists")
  },
  updateTodolist(payload: { id: string; title: string }) {
    const { title, id } = payload
    return instance.put<BaseResponse>(`todo-lists/${id}`, { title })
  },
  createTodolist(title: string) {
    return instance.post<BaseResponse<{ item: Todolist }>>("todo-lists", { title })
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponse>(`todo-lists/${id}`)
  }
}
