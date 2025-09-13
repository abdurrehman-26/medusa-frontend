// features/cart/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { HttpTypes } from "@medusajs/types"

interface StoreCart extends HttpTypes.StoreCart {
  discount_subtotal?: number
}

export interface CartState {
  cartData?: StoreCart
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
    setCart(state, action: PayloadAction<HttpTypes.StoreCart>) {
      state.cartData = action.payload
    },
  }
})

export const {
  setCart,
} = cartSlice.actions

export default cartSlice.reducer