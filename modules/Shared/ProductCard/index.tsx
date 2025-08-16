import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { HttpTypes } from '@medusajs/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function ProductCard({product}: {product: HttpTypes.StoreProduct}) {
  const productImage = product.thumbnail ?? product.images?.[0].url ?? "/placeholders/product-placeholder.webp"
  return (
    <Link href={`/products/${product.handle}`}>
      <Card className='p-0'>
        <CardContent className='p-0'>
          <Image
            alt='product-image' 
            src={productImage}
            className='size-60'
            width={300}
            height={300} 
          />
          <div className='px-1 mt-4'>
            <div className='p-1'>
              <span className='truncate font-semibold'>{product.title}</span>
            </div>
            <div className='p-1'>
              <span className="truncate font-bold">
                {formatPrice(product.variants?.[0]?.calculated_price?.calculated_amount ?? 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>  
    </Link>
  )
}

export default ProductCard
