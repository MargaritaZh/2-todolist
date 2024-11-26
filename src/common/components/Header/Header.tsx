import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import IconButton from "@mui/material/IconButton"
import LinearProgress from "@mui/material/LinearProgress"
import Switch from "@mui/material/Switch"
import Toolbar from "@mui/material/Toolbar"
import {
  changeTheme,
   selectAppStatus,
  selectIsLoggedIn,
  selectThemeMode,
  setAppStatus, setIsLoggedIn
} from "../../../app/appSlice"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { MenuButton } from "common/components"
import { useLogoutMutation } from "../../../features/auth/api/authAPI"
import { ResultCode } from "common/enums"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { baseApi } from "../../../app/baseApi"


export const Header = () => {
  const dispatch = useAppDispatch()

  const themeMode = useAppSelector(selectThemeMode)
  const status = useAppSelector(selectAppStatus)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)


  const [logout] = useLogoutMutation()

  const theme = getTheme(themeMode)

  const changeModeHandler = () => {
    dispatch(changeTheme({ themeMode: themeMode === "light" ? "dark" : "light" }))
  }

  const logoutHandler = () => {

    // dispatch(logoutTC())
    //замеили на вызов функции trigger----logout:
    logout()
      .then((res) => {
        if (res.data?.resultCode === ResultCode.Success) {
          dispatch(setAppStatus({ status: "succeeded" }))
          dispatch(setIsLoggedIn({ isLoggedIn: false }))
          localStorage.removeItem("sn-token")
          // dispatch(clearTasksAndTodolists())
          //заменим на др метод,так как сейчас мы очищаем КЭШ после вылогинивания
          dispatch(baseApi.util.resetApiState())
        }
      })
      .then(() => {
        //ПРОписываем логику в then,т.к. этот асинхр. код сработывал быстрее чем придет ответ с сервера
        // Очищаем кеш только для тегов ["Todolist", "Task"]
        // dispatch(baseApi.util.invalidateTags(["Todolist", "Task"]))
      })
  }

  return (
    <AppBar position="static" sx={{ mb: "30px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton color="inherit">
          <MenuIcon />
        </IconButton>
        <div>
          {isLoggedIn && <MenuButton onClick={logoutHandler}>Logout</MenuButton>}
          <MenuButton background={theme.palette.primary.dark}>Faq</MenuButton>
          <Switch color={"default"} onChange={changeModeHandler} />
        </div>
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  )
}
