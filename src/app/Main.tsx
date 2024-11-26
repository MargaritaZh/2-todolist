import Container from "@mui/material/Container"
import Grid from "@mui/material/Unstable_Grid2"
import { Path } from "common/router"
import { AddItemForm } from "common/components"
import {  useAppSelector } from "common/hooks"
import { Navigate } from "react-router-dom"

import { Todolists } from "../features/todolists/ui/Todolists/Todolists"
import { useAddTodolistsMutation } from "../features/todolists/api/todolistsApi"
import { selectIsLoggedIn } from "./appSlice"

export const Main = () => {
  // const dispatch = useAppDispatch()

  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  // const addTodolistCb = (title: string) => {
  //   dispatch(addTodolistTC(title))
  // }

  ///////////////////////////
  // const [trigger]=useAddTodolistsMutation()
  const [addTodolists, res] = useAddTodolistsMutation()


  const addTodolistCb = (title: string) => {
    addTodolists(title)
  }
  ////////////////////////////
  if (!isLoggedIn) {
    return <Navigate to={Path.Login} />
  }

  return (
    <Container fixed>
      <Grid container sx={{ mb: "30px" }}>
        <AddItemForm addItem={addTodolistCb} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
