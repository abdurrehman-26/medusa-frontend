// features/cart/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { HttpTypes } from "@medusajs/types"

export interface CartState {
  items?: HttpTypes.StoreCartLineItem[]
  loading: boolean
  error: string | null
}


const initialState: CartState = {
  items: [],
  loading: false,
  error: null
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<HttpTypes.StoreCartLineItem[]>) {
      state.items = action.payload
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items?.filter(i => i.id !== action.payload)
    },
    clearCart(state) {
      state.items = []
    }
  }
})

export const {
  setCart,
  removeFromCart,
  clearCart
} = cartSlice.actions

export default cartSlice.reducer