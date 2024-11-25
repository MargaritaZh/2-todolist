import List from "@mui/material/List"
import { TaskStatus } from "common/enums"
import { DomainTodolist } from "../../../../model/todolistsSlice"
import { Task } from "./Task/Task"
import { useGetTasksQuery } from "../../../../api/tasksApi"
import { TasksSkeleton } from "../../../skeletons/TasksSkeleton/TasksSkeleton"
import { useAppDispatch } from "common/hooks"
import { setAppError } from "../../../../../../app/appSlice"
import { useEffect, useState } from "react"
import { TasksPagination } from "../TasksPagination/TasksPagination"

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

  // const dispatch = useAppDispatch()
  //
  // useEffect(() => {
  //   dispatch(fetchTasksTC(todolist.id))
  // }, [])


  const [page, setPage] = useState(1)

  const { data: tasks, isLoading } = useGetTasksQuery({ todolistId: todolist.id, args: { page } })

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
        <>
          <List>
            {tasksForTodolist?.map((task) => {
              return <Task key={task.id} task={task} todolist={todolist} />
            })}
          </List>
          <TasksPagination totalCount={tasks?.totalCount || 0} page={page} setPage={setPage} /></>
      )}
    </>
  )
}
