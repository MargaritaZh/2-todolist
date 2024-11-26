import { AddItemForm } from "common/components"
import { FilterTasksButtons } from "./FilterTasksButtons/FilterTasksButtons"
import { Tasks } from "./Tasks/Tasks"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import { useCreateTaskMutation } from "../../../api/tasksApi"
import { DomainTodolist } from "../../../lib/types/types"

type Props = {
  todolist: DomainTodolist
}

export const Todolist = ({ todolist }: Props) => {

  const [createTask] = useCreateTaskMutation()

  // const dispatch = useAppDispatch()

  const addTaskCallback = (title: string) => {
    // dispatch(addTaskTC({ title, todolistId: todolist.id }))
    //заменили на:
    createTask({ title, todolistId: todolist.id })
  }

  return (
    <>
      <TodolistTitle todolist={todolist} />
      <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === "loading"} />
      <Tasks todolist={todolist} />
      <FilterTasksButtons todolist={todolist} />
    </>
  )
}
