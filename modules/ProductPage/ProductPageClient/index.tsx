import React from 'react'
import { ProductCarousel } from '../ProductCarousel'
import { cn, formatPrice } from '@/lib/utils'
import { StoreProduct } from '@medusajs/types'

const ProductPageClient = ({product}: {product: StoreProduct}) => {
  return (
    <div className='grid grid-cols-12 pt-3'>
        <div className='col-span-12'>
            <ProductCarousel slides={product.images} />
        </div>
        <div className='col-span-12 mt-3'>
            <p className='text-2xl font-bold'>{product.title}</p>
            <div className='py-2 flex gap-2'>
                <p className={cn(`truncate text-sm text-foreground/70`, product.variants?.[0].calculated_price?.calculated_price?.price_list_type === 'sale' && "line-through")}>{formatPrice(product.variants?.[0]?.calculated_price?.original_amount ?? 0)}</p>
            </div>
        </div>
    </div>
  )
}

export default ProductPageClient
