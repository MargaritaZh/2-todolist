import { instance } from "common/instance"
import { BaseResponse } from "common/types"
import { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"
import { baseApi } from "../../../app/baseApi"

export const PAGE_SIZE = 4


export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // типизация query: то что возвращает///что будет принимать
    getTasks: build.query<GetTasksResponse, { todolistId: string; args: { page: number } }>({
      query: ({todolistId,args}) => {

        const params = { ...args, count: PAGE_SIZE }

        return {
          url: `todo-lists/${todolistId}/tasks`,
          params,
          method: "GET"
        }
      },
      //прикрепляем тэг на get запрос
      // providesTags: ["Task"]

      //делат наш тег более индивид-ным, он привязывает каждой таске свой id---> { type: "Task", id }
      // providesTags: res => (res ? res.items.map(({ id }) => ({ type: "Task", id })) : ["Task"])

      //теперь завязываемся на todolistId т.к. он есть в аргументах для всех query запросов для тасок
      providesTags: (res, err,{todolistId} ) =>

        //если результат query запроса есть, то пробегаемся по массиву тасок
        //map проходит по каждой задаче и создает объект вида { type: "Task", id },где id — это уникальный идентификатор задачи.
        //as const используется для того, чтобы TypeScript рассматривал этот объект как константу.
        //{ type: "Task", id: todolistId } --->Этот объект добавляется в конец массива. Он представляет собой тег для всего списка задач (todolist), а не для отдельной задачи.
        //id: todolistId указывает на то, что этот тег относится к конкретному списку задач.

        //динамически генерировать теги для управления кэшем в RTK Query,

//каждой таске присвоется объект {type и id} и в конец массива добавит объект {type и id:todolistId}
        //получили по сути  массив тэгов , последний отвечает за весь список задач для конкр тодолиста
        // [{type:"Task",id:1},{type:"Task",id:2},{type:"Task",id:todolistId}]
        res ? [...res.items.map((TASK) => ({ type: "Task", id: TASK.id }) as const)
            , { type: "Task", id: todolistId }]
          : ["Task"]

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
      // invalidatesTags: ["Task"]

      //переписали и привязались к  todolistId, так как не вытащить taskId из аргументов нашего query запроса
      //и теперь это будет соответствовать типу и id в providesTags --->{ type: "Task", id: todolistId }
      invalidatesTags: (res, err, { todolistId }) => [{ type: "Task", id: todolistId }]

    }),
    deleteTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => {
        return {
          url: `todo-lists/${todolistId}/tasks/${taskId}`,
          method: "DELETE"
        }
      },
      //инвалидируем тэг, при его изменении отработает get запрос автоматически
      // invalidatesTags: ["Task"]

      //принимает любые аргументы приходящие в наш query запрос выше
      //и теперь это будет соответствовать типу и id в providesTags --->{ type: "Task", id }
      invalidatesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }]

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
          body: model
        }
      },
      //инвалидируем тэг, при его изменении отработает get запрос автоматически
      // invalidatesTags: ["Task"]

//принимает любые аргументы приходящие в наш query запрос выше
      //и теперь это будет соответствовать типу и id в providesTags --->{ type: "Task", id }
      invalidatesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }]

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
