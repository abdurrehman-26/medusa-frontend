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
    addToCart(state, action: PayloadAction<HttpTypes.StoreCartLineItem>) {
      const existing = state.items?.find(i => i.id === action.payload.id)
      if (existing) {
        existing.quantity += action.payload.quantity
      } else {
        state.items?.push(action.payload)
      }
    },
    updateQuantity(
      state,
      action: PayloadAction<{ _id: string; quantity: number }>
    ) {
      const item = state.items?.find(i => i.id === action.payload._id)
      if (item) {
        item.quantity = action.payload.quantity
      }
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
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
} = cartSlice.actions

export default cartSlice.reducer