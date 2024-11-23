import { instance } from "common/instance"
import { BaseResponse } from "common/types"
import { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"
import { baseApi } from "../../../app/baseApi"


export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // типизация query: то что возвращает///что будет принимать
    getTasks: build.query<GetTasksResponse, string>({
      query: (todolistId) => {
        return {
          url: `todo-lists/${todolistId}/tasks`,
          method: "GET"
        }
      },
      //прикрепляем тэг на get запрос
      providesTags: ["Task"]
    }),
// типизация query: то что возвращает///что будет принимать
    createTask: build.mutation<BaseResponse<{ item: DomainTask }>, { title: string; todolistId: string }>({
      query: ({ title, todolistId }) => {
        return {
          url: `todo-lists/${todolistId}/tasks`,
          method: "POST",
          body: {
            todolistId,
            title
          }
        }
      },
      //инвалидируем тэг, при его изменении отработает get запрос автоматически
      invalidatesTags: ["Task"]
    }),
    deleteTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => {
        return {
          url: `todo-lists/${todolistId}/tasks/${taskId}`,
          method: "DELETE",
        }
      },
      //инвалидируем тэг, при его изменении отработает get запрос автоматически
      invalidatesTags: ["Task"]
    }),

// типизация query: то что возвращает///что будет принимать
    updateTask: build.mutation<BaseResponse<{ item: DomainTask }>, {
      todolistId: string;
      taskId: string;
      model: UpdateTaskModel
    }>({

      query: ({ todolistId, taskId, model }) => {
        return {
          url: `todo-lists/${todolistId}/tasks/${taskId}`,
          method: "PUT",
          body: model,
        }
      },
      //инвалидируем тэг, при его изменении отработает get запрос автоматически
      invalidatesTags: ["Task"]
    })
  })

})


export const { useGetTasksQuery, useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } = tasksApi


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
