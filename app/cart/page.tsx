"use client";
import { Button } from '@/components/ui/button';
import { sdk } from '@/lib/sdk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ArrowRight, Loader, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'
import { HttpTypes } from '@medusajs/types';
import { setCart } from '@/features/cart/cartSlice';
import { Input } from '@/components/ui/input';
import { SubmitHandler, useForm} from "react-hook-form"
import { formatPrice } from '@/lib/utils';
import CartItem from '@/modules/Cart/CartItem';

type PromotionFormValues = {
  code: string
}
const CartPage = () => {
  const cartData = useAppSelector((state) => state.cart.cartData)
  const cartItems = cartData.items
  const dispatch = useAppDispatch()

  const [removingPromotion, setRemovingPromotion] = useState<boolean>(false)

  const {register, handleSubmit, formState, setError} = useForm<PromotionFormValues>()
  
  const applyPromotion: SubmitHandler<PromotionFormValues> = async (data) => {
    if (!cartData.id) return;
    const { code } = data;
    
    // No optimistic update needed here since the promo code validity is unknown.

    try {
      // API Call
      const applyPromotionResponse = await sdk.client.fetch<{ cart: HttpTypes.StoreCart }>(
        `/store/carts/${cartData.id}/promotions`,
        {
          method: "post",
          body: {
            promo_codes: [code],
          },
        }
      );

      // Dispatch Final State
      if (applyPromotionResponse.cart) {
        dispatch(setCart(applyPromotionResponse.cart));
      } else {
        throw new Error("Invalid promo code");
      }
      
    } catch (error) {
      console.error("Failed to apply promo code:", error);
      // Handle error by setting form error state
      setError("code", { message: "Invalid promo code" });
    }
  };
  const removePromotion = async () => {
    setRemovingPromotion(true)
    try {
      const removePromotionResponse = await sdk.client.fetch<{cart: HttpTypes.StoreCart}>(`/store/carts/${cartData.id}/promotions`, {
        method: "delete",
        body: {
          promo_codes: [cartData.promotions[0].code]
        }
      })
      if (removePromotionResponse.cart) {
        dispatch(setCart(removePromotionResponse.cart))
      }
    } finally {
      setRemovingPromotion(false)
    }
  }
  return (
    <div className='py-3'>
      <h1 className='text-3xl font-bold mb-5'>Your Cart</h1>
      <div className='grid grid-cols-12 gap-5'>
      <div className={`space-y-5 flex flex-col col-span-12 ${(cartItems && cartItems.length !== 0) && "md:col-span-8 lg:col-span-9"}`}>
        {cartItems && cartItems.length > 0 ? <div className="flex flex-col p-2 border border-border rounded-2xl divide-y divide-border">
          {cartItems?.map((cartItem) => (
              <CartItem key={cartItem.id} cartItem={cartItem} />
          ))}
        </div> : (
          <div className='flex flex-col items-center justify-center gap-5 mt-[25svh]'>
            <p className='text-3xl'>Your cart is empty</p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </div>
      {cartItems && cartItems.length > 0 && (
        <div className="flex h-fit flex-col gap-3 p-2 py-3 border border-border rounded-2xl col-span-12 md:col-span-4 lg:col-span-3">
          <h2 className='text-xl font-bold'>Order summary</h2>
          <table className='border-spacing-y-3 border-separate border-b border-border'>
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td className='text-right'>{formatPrice(cartData.item_subtotal, cartData.currency_code)}</td>
              </tr>
              <tr>
                <td>Discount</td>
                <td className='text-right text-primary'>-{formatPrice(cartData.discount_total, cartData.currency_code)}</td>
              </tr>
              <tr>
                <td>Tax</td>
                <td className='text-right'>{formatPrice(cartData.item_tax_total, cartData.currency_code)}</td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <td>Total</td>
                <td className='text-right'>{formatPrice(cartData.total, cartData.currency_code)}</td>
              </tr>
            </tbody>
          </table>
          {cartData.promotions && cartData.promotions.length > 0 ? (
              (() => {
                const promo = cartData.promotions[0] // only one supported
                return (
                  <div>
                    <p className='text-primary ml-1'>Promo code applied</p>
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-1 px-2">
                      <div className="space-y-1">
                        <p className="font-semibold text-sm uppercase tracking-wide">
                          {promo.code}
                        </p>
                        {promo.application_method && (
                          <p className="text-xs text-gray-600">
                            {promo.application_method.type === "percentage"
                              ? `${promo.application_method.value}% off`
                              : `-${promo.application_method.value} ${promo.application_method.currency_code?.toUpperCase()}`}
                          </p>
                        )}
                        {promo.is_automatic && (
                          <p className="text-xs text-green-600 font-medium">
                            Applied automatically
                          </p>
                        )}
                      </div>
                      <button
                        className="cursor-pointer text-red-500"
                        onClick={() => removePromotion()}
                      >
                        {removingPromotion ? <Loader className='animate-spin' /> : <X className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )
              })()
          ) : <form onSubmit={handleSubmit(applyPromotion)} className='flex gap-3'>
            <div className='space-y-1 flex flex-col flex-grow'>
              <Input className='rounded-full' placeholder="Enter promo code" {...register("code")} />
              <p className='text-sm text-red-600 ml-1'>{formState.errors.code?.message}</p>
            </div>
            <Button type="submit" className='rounded-full' disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Applying..." : "Apply"}
            </Button>
          </form>}
          <Button className='rounded-full items-center'>Go to checkout<ArrowRight /></Button>
        </div>
      )}
      </div>
    </div>
  )
}

export default CartPage
