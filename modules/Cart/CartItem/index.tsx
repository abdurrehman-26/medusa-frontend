import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { setCart } from '@/features/cart/cartSlice'
import { sdk } from '@/lib/sdk'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { StoreCartLineItem } from '@medusajs/types'
import { Loader, Minus, Plus, Trash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

function CartItem({cartItem}: {cartItem: StoreCartLineItem}) {
    const cartData = useAppSelector((state) => state.cart.cartData)
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState<boolean>(false)
    
    const setCartItemQuantity = async (item: StoreCartLineItem, quantity: number) => {
        if (!cartData.id || quantity < 1 || quantity > 999) return;
          setLoading(true)
          try {
            // API Call
            const setQuantityResponse = await sdk.store.cart.updateLineItem(cartData.id, item.id, {
              quantity,
            });
            // Dispatch Final State
            dispatch(setCart(setQuantityResponse.cart));
          } finally {
            setLoading(false)
          }
    };
    const deleteCartItem = async (item: StoreCartLineItem) => {
    if (!cartData.id) return;
    setLoading(true)

    try {
        // API Call
        await sdk.store.cart.deleteLineItem(cartData.id, item.id);
        
        const updatedCart = await sdk.store.cart.retrieve(cartData.id);
        dispatch(setCart(updatedCart.cart));

    } finally {
        setLoading(false)
    }
    };
  return (
    <div key={cartItem.id} className='flex py-3'>
      <div className='aspect-square w-24 rounded-xl overflow-hidden border border-border'>
        <Image alt={cartItem.title} className='w-full object-cover' src={cartItem.thumbnail!} width={96} height={96}></Image>
      </div>
      <div className='px-2 flex flex-col flex-grow-1'>
          <div className='flex items-center'>
          <div className='flex-grow-1'>
            <Link href={`/products/${cartItem.product_handle}`} className='line-clamp-1 font-semibold max-sm:text-sm hover:underline underline-offset-2'>
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
            <div className='flex gap-2 mt-auto items-center'>
              {loading ? <Loader className='animate-spin' /> : null}
              <div className='flex'>
                <button className='flex rounded bg-accent cursor-pointer' onClick={() => setCartItemQuantity(cartItem, cartItem.quantity - 1)}>
                  <Minus />
                </button>
                  <input className='w-10 text-center outline-none' value={cartItem.quantity} onChange={(e) => setCartItemQuantity(cartItem, Number(e.target.value))} />
                <button className='flex rounded bg-accent cursor-pointer' onClick={() => setCartItemQuantity(cartItem, cartItem.quantity + 1)}>
                  <Plus />
                </button>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>
  )
}

export default CartItem
