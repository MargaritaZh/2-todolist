import { createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { LoginArgs } from "../features/auth/api/authAPI.types"
import { Dispatch } from "redux"
import { _authApi } from "../features/auth/api/authAPI"
import { ResultCode } from "common/enums"
import { handleServerAppError, handleServerNetworkError } from "common/utils"

import { clearTasksAndTodolists } from "common/actions/common.actions"
import { todolistsApi } from "../features/todolists/api/todolistsApi"
import { tasksApi } from "../features/todolists/api/tasksApi"

export type ThemeMode = "dark" | "light"
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    status: "idle" as RequestStatus,
    error: null as string | null,
    isLoggedIn: false
  },
  reducers: (create) => ({
    changeTheme: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setAppStatus: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),
    setAppError: create.reducer<{ error: string | null }>((state, action) => {
      state.error = action.payload.error
    }),
    setIsLoggedIn: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    })

  }),
//ПИШЕМ В ЭТОМ Slice? т.к. у этого есть status в initialState,который мы меняем
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state,action) => {
        if (
          todolistsApi.endpoints.getTodolists.matchPending(action) ||
          tasksApi.endpoints.getTasks.matchPending(action)
          //исключить эти endpoints, чтобы не работала полоса вверху сайта т.к. мы сделали Skeletons для них
        ) {
          return
        }
        state.status = 'loading'
        })
      .addMatcher(isFulfilled, (state) => {
          state.status = 'succeeded'
        })
      .addMatcher(isRejected, (state) => {
          state.status = 'failed'
        })

      //addMatcher будет работать одинаково в абсолютно любом slice, так как в него приходят все action при их dispatch
      // .addMatcher(
      // (action) => {
        //code
        // return action.type.endsWith('/pending')
        // Эта функция возвращает bolean -значение, если  return true,
        // то попадем дальше во вторую функцию и изменим ГЛОБАЛЬНЫЙ Sate Redux
      // }, (state, action) => {
      //change redux state
      //   state.status = 'loading'
      // })
      // .addMatcher(
      //   action => {
      //     return action.type.endsWith('/fulfilled')
      //   },
      //   state => {
      //     state.status = 'succeeded'
      //   }
      // )
      // .addMatcher(
      //   action => {
      //     return action.type.endsWith('/rejected')
      //   },
      //   state => {
      //     state.status = 'failed'
      //   }
      // )
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectAppStatus: (state) => state.status,
    selectAppError: (state) => state.error,
    selectIsLoggedIn: (state) => state.isLoggedIn
  }

})

export const { changeTheme, setAppError, setAppStatus, setIsLoggedIn } = appSlice.actions
export const { selectAppStatus, selectAppError, selectThemeMode, selectIsLoggedIn } = appSlice.selectors
export const appReducer = appSlice.reducer


export const loginTC = (data: LoginArgs) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  _authApi
    .login(data)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({ status: "succeeded" }))
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
        localStorage.setItem("sn-token", res.data.data.token)
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  _authApi
    .logout()
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({ status: "succeeded" }))
        dispatch(setIsLoggedIn({ isLoggedIn: false }))
        dispatch(clearTasksAndTodolists())
        localStorage.removeItem("sn-token")
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}