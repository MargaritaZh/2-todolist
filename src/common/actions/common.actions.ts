import { createAction, nanoid } from "@reduxjs/toolkit"
import { TasksStateType } from "../../features/todolists/model/tasksSlice"
import { DomainTodolist } from "../../features/todolists/model/todolistsSlice"

// export type ClearTasksAndTodolistsType = {
//   tasks: TasksStateType
//   todolists: DomainTodolist[]
// }

export  const clearTasksAndTodolists=createAction("common/clear-tasks-todolists")


//РЕДКИЙ КЕЙС
// export const clearTasksAndTodolists = createAction("common/clear-tasks-todolists",
//   ( tasks: TasksStateType,todolists: DomainTodolist[]) => {
// let random=100
//     return {
//       payload: {
//         tasks,
//         todolists,
//         id:random>90? nanoid():Math.random()
//
//       }
//     }
//   })