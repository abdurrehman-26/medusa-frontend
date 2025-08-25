"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { HttpTypes } from '@medusajs/types'
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function ProductCard({product}: {product: HttpTypes.StoreProduct}) {
  const productImage = product.thumbnail ?? product.images?.[0].url ?? "/placeholders/product-placeholder.webp"
  const addtoCartHandle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();   // stops the link navigation
    e.stopPropagation();  // stops bubbling to parent
    console.log("Added to cart")
  }
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
              <p className='truncate text-sm mb-1'>{product.collection?.title || "Unknown Collection"}</p>
              <p className="truncate text-sm text-foreground/70 mb-2">
                {formatPrice(product.variants?.[0]?.calculated_price?.calculated_amount ?? 0)}
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
