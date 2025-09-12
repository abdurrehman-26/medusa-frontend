"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { setCart } from '@/features/cart/cartSlice';
import { sdk } from '@/lib/sdk';
import { formatPrice } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { HttpTypes } from '@medusajs/types'
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner';

function ProductCard({product}: {product: HttpTypes.StoreProduct}) {
  const cartId = useAppSelector(state => state.cart.cartData?.id)
  const dispatch = useAppDispatch()
  const productImage = product.thumbnail ?? product.images?.[0].url ?? "/placeholders/product-placeholder.webp"
  const addtoCartHandle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();   // stops the link navigation
    e.stopPropagation();  // stops bubbling to parent
    if (!cartId || !product.variants?.[0].id) {
      return
    }

    sdk.store.cart.createLineItem(cartId, {
      variant_id: product.variants?.[0].id,
      quantity: 1,
    })
    .then(({cart}) => {
      if (cart) {
        dispatch(setCart(cart))
        toast.success("Product added to cart")
      }
    })
  }
  const region = useAppSelector(state => state.region.regionData)
  return (
    <Link href={`/products/${product.handle}`}>
      <Card className='p-0 overflow-hidden w-56'>
        <CardContent className='p-0'>
          <div className='aspect-square overflow-hidden box-content border-b border-foreground/5 rounded-t-xl'>
            <Image
              alt='product-image' 
              src={productImage}
              width={300}
              height={300} 
            />
          </div>
          <div className='p-1 px-2 pb-2 mt-1'>
            <div className='px-1'>
              <p className='truncate font-medium text-lg mb-2'>{product.title}</p>
              <p className='truncate text-sm mb-1'>{product.categories?.[0]?.name || "Unknown"}</p>
              <p className="truncate text-sm text-foreground/70 mb-2">
                {formatPrice(product.variants?.[0]?.calculated_price?.calculated_amount ?? 0, region.currency_code )}
              </p>
            </div>
            <Button type='button' onClick={addtoCartHandle} className='w-full'>
              <ShoppingCart />
              Add to cart
            </Button>
          </div>
        </CardContent>
      </Card>  
    </Link>
  )
}

export default ProductCard
