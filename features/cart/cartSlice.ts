// features/cart/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { HttpTypes } from "@medusajs/types"

export interface CartState {
  cartData: HttpTypes.StoreCart
  loading: boolean
  error: string | null
}


const initialState: CartState = {
  cartData: {
    id: "",
    currency_code: "",
    promotions: [],
    original_item_total: 0,
    original_item_subtotal: 0,
    original_item_tax_total: 0,
    item_total: 0,
    item_subtotal: 0,
    item_tax_total: 0,
    original_total: 0,
    original_subtotal: 0,
    original_tax_total: 0,
    total: 0,
    subtotal: 0,
    tax_total: 0,
    discount_total: 0,
    discount_tax_total: 0,
    gift_card_total: 0,
    gift_card_tax_total: 0,
    shipping_total: 0,
    shipping_subtotal: 0,
    shipping_tax_total: 0,
    original_shipping_total: 0,
    original_shipping_subtotal: 0,
    original_shipping_tax_total: 0
  },
  loading: false,
  error: null
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<HttpTypes.StoreCartLineItem[]>) {
      state.cartData.items = action.payload
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.cartData.items = state.cartData.items?.filter(i => i.id !== action.payload)
    },
    clearCart(state) {
      state.cartData.items = []
    }
  }
})

export const {
  setCart,
  removeFromCart,
  clearCart
} = cartSlice.actions

export default cartSlice.reducer