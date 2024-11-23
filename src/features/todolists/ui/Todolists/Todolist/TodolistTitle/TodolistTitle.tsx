import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import { EditableSpan } from "common/components"
import { useAppDispatch } from "common/hooks"
import { DomainTodolist, removeTodolistTC, updateTodolistTitleTC } from "../../../../model/todolistsSlice"
import s from "./TodolistTitle.module.css"
import { todolistsApi, useDeleteTodolistMutation, useUpdateTodolistTitleMutation } from "../../../../api/todolistsApi"
import { RequestStatus } from "../../../../../../app/appSlice"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {

  const { title, id, entityStatus } = todolist

  const dispatch = useAppDispatch()

  const [updateTodolistTitle] = useUpdateTodolistTitleMutation()
  const [deleteTodolist] = useDeleteTodolistMutation()



  const updateQueryData = (status: RequestStatus) => {
    dispatch(
      //getTodolists -название end-поинта,где нужно изменить кеш, хоть строка, но ts-проверяет
      todolistsApi.util.updateQueryData('getTodolists', undefined, state => {
        const index = state.findIndex(tl => tl.id === id)
        if (index !== -1) {
          state[index].entityStatus = status
        }
      })
    )
  }


  const removeTodolistHandler = () => {
    // dispatch(removeTodolistTC(id))
    //заменили на вызов функции trigger:
    // deleteTodolist(id)

    updateQueryData('loading')
    deleteTodolist(id)
      .unwrap()
      .catch(() => {
        updateQueryData('idle')
      })


  }
  const updateTodolistHandler = (title: string) => {
    // dispatch(updateTodolistTitleTC({ id, title }))
    //заменили на вызов функции trigger:
    updateTodolistTitle({ id, title })

  }



  return (
    <div className={s.container}>
      <h3>
        <EditableSpan value={title} onChange={updateTodolistHandler} disabled={entityStatus === "loading"} />
      </h3>
      <IconButton onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
