import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { ErrorSnackbar, Header } from "common/components"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
// import { initializeAppTC, selectIsInitialized } from "../features/auth/model/authSlice"
import CircularProgress from "@mui/material/CircularProgress"
import s from "./App.module.css"
import { selectThemeMode, setIsLoggedIn } from "./appSlice"
import { useMeQuery } from "../features/auth/api/authAPI"
import { ResultCode } from "common/enums"


export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)

  // const isInitialized = useAppSelector(selectIsInitialized)

  // const dispatch = useAppDispatch()

  // useEffect(() => {
  //   dispatch(initializeAppTC())
  // }, [])
  ////////////////////////

  //так как это значение используется один раз во всем приложении , то сделаем классический useState

  const [isInitialized, setIsInitialized] = useState(false)

  const dispatch = useAppDispatch()

  const { data, isLoading } = useMeQuery()

  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true)
      if (data?.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
      }
    }
  }, [isLoading, data])



  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      {isInitialized && (
        <>
          <Header />
          <Outlet />
        </>
      )}
      {!isInitialized && (
        <div className={s.circularProgressContainer}>
          <CircularProgress size={150} thickness={3} />
        </div>
      )}
      <ErrorSnackbar />
    </ThemeProvider>
  )
}
