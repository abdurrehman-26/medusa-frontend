// features/cart/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { StoreCustomer } from "@medusajs/types"


export interface CustomerState {
  customerData?: StoreCustomer
}


const initialState: CustomerState = {
  customerData: undefined,
}

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer(state, action: PayloadAction<StoreCustomer>) {
      state.customerData = action.payload
    },
    unsetCustomer(state) {
      state.customerData = undefined
    },
  }
})

export const {
  setCustomer,
} = customerSlice.actions

export default customerSlice.reducer