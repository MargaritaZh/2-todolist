import List from "@mui/material/List"
import { TaskStatus } from "common/enums"
import { DomainTodolist } from "../../../../model/todolistsSlice"
import { Task } from "./Task/Task"
import { useGetTasksQuery } from "../../../../api/tasksApi"
import { TasksSkeleton } from "../../../skeletons/TasksSkeleton/TasksSkeleton"
import { useAppDispatch } from "common/hooks"
import { setAppError } from "../../../../../../app/appSlice"
import { useEffect } from "react"

type Props = {
  todolist: DomainTodolist
}

type ErrorData = {
  status: number
  data: {
    message: string
  }
}

export const Tasks = ({ todolist }: Props) => {

  // const tasks = useAppSelector(selectTasks)

  const dispatch = useAppDispatch()
  //
  // useEffect(() => {
  //   dispatch(fetchTasksTC(todolist.id))
  // }, [])


  const { data:tasks, isLoading,isError,error } = useGetTasksQuery(todolist.id)

  useEffect(() => {
    if (error) {
      let errMsg = 'Some error occurred'
      //оператор in? пробегается по объекту и возвращает true-если такое свойство есть в объекте
      if ('data' in error) {
        const errData = error.data as ErrorData
        if ('message' in errData) {
          errMsg = errData.message as string
        }
      }
      dispatch(setAppError({ error: errMsg }))
    }
  }, [error])


  let tasksForTodolist = tasks?.items


  if (todolist.filter === "active") {
    tasksForTodolist = tasksForTodolist?.filter((task) => task.status === TaskStatus.New)
  }

  if (todolist.filter === "completed") {
    tasksForTodolist = tasksForTodolist?.filter((task) => task.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {tasksForTodolist?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {tasksForTodolist?.map((task) => {
            return <Task key={task.id} task={task} todolist={todolist} />
          })}
        </List>
      )}
    </>
  )
}
