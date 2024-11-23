import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { useAppDispatch } from "common/hooks"
import { changeTodolistFilter, FilterValuesType, DomainTodolist } from "../../../../model/todolistsSlice"
import { filterButtonsContainerSx } from "./FilterTasksButtons.styles"
import { todolistsApi } from "../../../../api/todolistsApi"

type Props = {
  todolist: DomainTodolist
}

export const FilterTasksButtons = ({ todolist }: Props) => {
  const { filter, id } = todolist

  const dispatch = useAppDispatch()


  //Раньше мы диспатлили в state и обновляли его
  // const changeFilterTasksHandler = (filter: FilterValuesType) => {
  //   dispatch(changeTodolistFilter({ id, filter }))
  // }

  //Теперь у нас данные в КЕШЕ И НАМ НУЖНО ЧАСТИЧНО ИЗМЕНИТЬ КЕШ
  const changeFilterTasksHandler = (filter: FilterValuesType) => {
    dispatch(
      todolistsApi.util.updateQueryData(
        // 1, endpoint?который мы хотим обновить
        'getTodolists',
        // 2, аргументы,которые приходят в данный endpoint
        undefined,
        // 3, логика по изменению данного state
        // в нашем случае это state тодолистов
        state => {
          const index = state.findIndex(tl => tl.id === id)
          if (index !== -1) {
            state[index].filter = filter
          }
        }
      )
    )
  }


  return (
    <Box sx={filterButtonsContainerSx}>
      <Button
        variant={filter === "all" ? "outlined" : "text"}
        color={"inherit"}
        onClick={() => changeFilterTasksHandler("all")}
      >
        All
      </Button>
      <Button
        variant={filter === "active" ? "outlined" : "text"}
        color={"primary"}
        onClick={() => changeFilterTasksHandler("active")}
      >
        Active
      </Button>
      <Button
        variant={filter === "completed" ? "outlined" : "text"}
        color={"secondary"}
        onClick={() => changeFilterTasksHandler("completed")}
      >
        Completed
      </Button>
    </Box>
  )
}
