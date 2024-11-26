import { configureStore } from "@reduxjs/toolkit"
import { appReducer, appSlice } from "./appSlice"
import { setupListeners } from "@reduxjs/toolkit/query"
import { baseApi } from "./baseApi"


export const store = configureStore({
  reducer: {

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
