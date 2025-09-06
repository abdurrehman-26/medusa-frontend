// features/cart/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { HttpTypes } from "@medusajs/types"

export interface RegionState {
  regionData: HttpTypes.StoreRegion
  loading: boolean
  error: string | null
}


const initialState: RegionState = {
  regionData: {
      id: "",
      name: "",
      currency_code: ""
  },
  loading: false,
  error: null
}

export const regionSlice = createSlice({
  name: "region",
  initialState,
  reducers: {
    setRegion(state, action: PayloadAction<HttpTypes.StoreRegion>) {
      state.regionData = action.payload
    },
  }
})

export const {
  setRegion,
} = regionSlice.actions

export default regionSlice.reducer