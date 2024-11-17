import { configureStore } from "@reduxjs/toolkit"
import { tasksReducer, tasksSlice } from "../features/todolists/model/tasksSlice"
import { todolistsReducer, todolistsSlice } from "../features/todolists/model/todolistsSlice"
import { appReducer, appSlice } from "./appSlice"
import { todolistsApi } from "../features/todolists/api/todolistsApi"
import { setupListeners } from "@reduxjs/toolkit/query"
import { baseApi } from "./baseApi"

export const store = configureStore({
  reducer: {
    [tasksSlice.name]: tasksReducer,
    [todolistsSlice.name]: todolistsReducer,
    [appSlice.name]: appReducer,

    //RTK query
    // [todolistsApi.reducerPath]: todolistsApi.reducer,
    //перенести в baseApi
    [baseApi.reducerPath]: baseApi.reducer,
  },
  ////RTK query-> подключаем middleware
  middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware().concat(todolistsApi.middleware),
    getDefaultMiddleware().concat(baseApi.middleware),

})

//RTK query
setupListeners(store.dispatch)



export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
