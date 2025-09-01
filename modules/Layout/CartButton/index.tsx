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
  const cartId = Cookies.get("cart_Id")
  const region_id = Cookies.get("region_id")
  const createCart = async () => {
    const createdCart =  await sdk.store.cart.create({
        region_id
    })
    Cookies.set("cartId", createdCart.cart.id)
  }
  if (!cartId) {
    createCart()
  }
  return (
    <Button asChild className="rounded-full" size="icon" variant="ghost">
        <Link href="/cart" className="relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {cartCount}
            </span>
        </Link>
    </Button>
  )
}

export default CartButton
