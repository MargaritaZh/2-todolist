import { instance } from "common/instance"
import { BaseResponse } from "common/types"
import { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"
import { baseApi } from "../../../app/baseApi"
import { BaseQueryArg } from "@reduxjs/toolkit/query"


export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // типизация query: то что возвращает///что будет принимать
    getTasks: build.query<GetTasksResponse, string>({
      query: (todolistId) => {
        return {
          url: `todo-lists/${todolistId}/tasks`,
          method: "GET"
        }
      }
    }),








  })


})


export const { useGetTasksQuery } = tasksApi


export const _tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },


  createTask(payload: { title: string; todolistId: string }) {
    const { title, todolistId } = payload
    return instance.post<BaseResponse<{ item: DomainTask }>>(`todo-lists/${todolistId}/tasks`, { title })
  },
  deleteTask(payload: { todolistId: string; taskId: string }) {
    const { taskId, todolistId } = payload
    return instance.delete<BaseResponse>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  updateTask(payload: { todolistId: string; taskId: string; model: UpdateTaskModel }) {
    const { taskId, todolistId, model } = payload
    return instance.put<BaseResponse<{ item: DomainTask }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  }
}
