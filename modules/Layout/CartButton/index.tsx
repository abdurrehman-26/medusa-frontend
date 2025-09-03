"use client";
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/store/hooks';
import { HttpTypes } from '@medusajs/types';
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Cookies from 'js-cookie';
import { sdk } from '@/lib/sdk';

const CartButton = () => {
  const cartCount = useAppSelector((state) =>
    state.cart.items?.reduce((total: number, item: HttpTypes.StoreCartLineItem) => total + item.quantity, 0)
  );
  const cartId = Cookies.get("cartId")
  const region_id = Cookies.get("region_id")
  const createCart = async () => {
    const createdCart =  await sdk.store.cart.create({
        region_id
    })
    Cookies.set("cartId", createdCart.cart.id, { expires: 7 })
  }
  if (!cartId) {
    createCart()
  }
  return (
    <Button asChild className="rounded-full" size="icon" variant="ghost">
        <Link href="/cart" className="relative">
            <ShoppingCart size={20} />
            <div className="absolute -top-0.25 -right-0.25 text-primary size-4 flex justify-center items-center">
              <span className='text-xs'>{cartCount && cartCount < 10 ? cartCount : "9+"}</span>
            </div>
        </Link>
    </Button>
  )
}

export default CartButton
