// store/index.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import cartReducer from "@/features/cart/cartSlice"
import regionReducer from "@/features/region/regionSlice"

const rootReducer = combineReducers({
  cart: cartReducer,
  region: regionReducer
})

export const createStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState  
  })

// Infer the type of makeStore
export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof createStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = AppStore['dispatch']
