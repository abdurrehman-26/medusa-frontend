"use client";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { sdk } from '@/lib/sdk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ArrowRight, Minus, Plus, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import Cookies from 'js-cookie';
import { StoreCartLineItem } from '@medusajs/types';
import { setCart } from '@/features/cart/cartSlice';
import { Input } from '@/components/ui/input';

const CartPage = () => {
  const cartItems = useAppSelector((state) => state.cart.items)
  const cartId = Cookies.get("cartId")
  const dispatch = useAppDispatch()
  const incrementCartItemQuantity = async (item: StoreCartLineItem) => {
    if (!cartId) {
      return
    }
    const prevCartItems = cartItems || []
    const optimisticUpdatedItem = {
      ...item,
      quantity: item.quantity + 1,
    };

    const optimisticCartItems = (cartItems || []).map((cartItem) =>
      cartItem.id === item.id ? optimisticUpdatedItem : cartItem
    );
    
    dispatch(setCart(optimisticCartItems));
    try {
      const incrementResponse = await sdk.store.cart.updateLineItem(cartId, item.id, {
        quantity: item.quantity + 1
      })
      if (!incrementResponse.cart.items) {
        dispatch(setCart(prevCartItems))
      }
    } catch (error) {
      console.error(error)
      dispatch(setCart(prevCartItems))
    }
  }
  const decrementCartItemQuantity = async (item: StoreCartLineItem) => {
    if (!cartId || item.quantity - 1 < 1 ) {
      return
    }
    const prevCartItems = cartItems || []
    const optimisticUpdatedItem = {
      ...item,
      quantity: item.quantity - 1,
    };

    const optimisticCartItems = (cartItems || []).map((cartItem) =>
      cartItem.id === item.id ? optimisticUpdatedItem : cartItem
    );
    
    dispatch(setCart(optimisticCartItems));
    try {
      const decrementResponse = await sdk.store.cart.updateLineItem(cartId, item.id, {
        quantity: item.quantity - 1
      })
      if (!decrementResponse.cart.items) {
        dispatch(setCart(prevCartItems))
      }
    } catch (error) {
      console.error(error)
      dispatch(setCart(prevCartItems))
    }
  }
  const setCartItemQuantity = async (item: StoreCartLineItem, quantity: number) => {
    if (!cartId || quantity < 1) {
      return
    }
    const prevCartItems = cartItems || []
    const optimisticUpdatedItem = {
      ...item,
      quantity,
    };

    const optimisticCartItems = (cartItems || []).map((cartItem) =>
      cartItem.id === item.id ? optimisticUpdatedItem : cartItem
    );
    
    dispatch(setCart(optimisticCartItems));
    try {
      const setQuantityResponse = await sdk.store.cart.updateLineItem(cartId, item.id, {
        quantity
      })
      if (!setQuantityResponse.cart.items) {
        dispatch(setCart(prevCartItems))
      }
    } catch (error) {
      console.error(error)
      dispatch(setCart(prevCartItems))
    }
  }
  const deleteCartItem = async (item: StoreCartLineItem) => {
    if (!cartId) {
      return
    }
    const prevCartItems = cartItems || []

    const optimisticCartItems = (cartItems || []).filter((cartItem) =>
      cartItem.id !== item.id
    );
    
    dispatch(setCart(optimisticCartItems));
    try {
      const deleteItemResponse = await sdk.store.cart.deleteLineItem(cartId, item.id)
      if (!deleteItemResponse.deleted) {
        dispatch(setCart(prevCartItems))
      }
    } catch (error) {
      console.error(error)
      dispatch(setCart(prevCartItems))
    }
  }
  return (
    <div className='py-3'>
      <h1 className='text-3xl font-bold mb-5'>Your Cart</h1>
      <div className='grid grid-cols-12 gap-5'>
      <div className='space-y-5 flex flex-col col-span-12 md:col-span-8 lg:col-span-9'>
        {cartItems && cartItems.length > 0 ? <div className="flex flex-col gap-3 p-2 border border-border rounded-2xl divide-y divide-border">
          {cartItems?.map((cartItem) => (
              <div key={cartItem.id} className='flex py-3'>
                  <div className='aspect-square w-24 rounded-xl overflow-hidden border border-border'>
                      <Image alt={cartItem.title} className='w-full object-cover' src={cartItem.thumbnail!} width={96} height={96}></Image>
                  </div>
                  <div className='px-2 flex flex-col flex-grow-1'>
                      <div className='flex items-center'>
                      <div className='flex-grow-1'>
                          <Link href={`/product/${cartItem.product?.handle}`} className='line-clamp-1 font-semibold max-sm:text-sm hover:underline underline-offset-2'>
                          {cartItem.title}
                          </Link>
                      </div>
                      <Button variant="ghost" className="rounded-full cursor-pointer m-1 size-6" onClick={() => deleteCartItem(cartItem)}>
                          <Trash color='red' />
                      </Button>
                      </div>
                      <div className='flex-grow flex flex-col'>
                      <Badge>
                        {cartItem.variant_title}
                      </Badge>
                      <div className="flex flex-grow justify-between">
                          <p className='font-semibold sm:text-lg mt-auto'>
                          {Number(cartItem.unit_price || 0).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                          </p>
                          <div className='flex bg-accent p-0.5 rounded-full mt-auto px-2'>
                            <button className='cursor-pointer' type='button' onClick={() => decrementCartItemQuantity(cartItem)}>
                              <Minus size={16} />
                            </button>
                              <input type="text" value={cartItem.quantity} className='max-w-10 outline-none text-center' onChange={(e) => setCartItemQuantity(cartItem, Number(e.target.value))} />
                            <button className='cursor-pointer' type='button' onClick={() => incrementCartItemQuantity(cartItem)}>
                              <Plus size={16} />
                            </button>
                          </div>
                      </div>
                      </div>
                  </div>
                  </div>
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
          {/* TODO: fix to show real data */}
          <h2 className='text-xl font-bold'>Order summary</h2>
          <table className='border-spacing-y-3 border-separate border-b border-border'>
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td className='text-right'>90000 PKR</td>
              </tr>
              <tr>
                <td>Discount</td>
                <td className='text-right text-primary'>-1000 PKR</td>
              </tr>
              <tr className='border-b-2 border-border'>
                <td>Delivery fee</td>
                <td className='text-right'>480 PKR</td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <td>Total</td>
                <td className='text-right'>91480 PKR</td>
              </tr>
            </tbody>
          </table>
          {/* TODO: setup promostions apply */}
          <form className='flex gap-3'>
            <Input className='rounded-full' placeholder="Enter promo code" />
            <Button className='rounded-full' type='button'>Apply</Button>
          </form>
          <Button className='rounded-full items-center'>Go to checkout<ArrowRight /></Button>
        </div>
      )}
      </div>
    </div>
  )
}

export default CartPage
