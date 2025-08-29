import { Button } from '@/components/ui/button'
import ProductCard from '@/modules/Shared/ProductCard'
import { StoreProduct } from '@medusajs/types'
import React from 'react'

const TitledProductRail = async ({title, products}: {title: string, products: StoreProduct[]}) => {
  return (
    <div className='mb-10'>
      <h1 className='text-4xl font-semibold text-center mb-5'>{title}</h1>
      {products.length !== 0 ?
      <>
      <div className='product-grid'>
        {products.map((product) => {
            return (
              <ProductCard key={product.id} product={product} />
            )
        })}
      </div>
      <div className='pt-5 flex justify-center'>
        <Button variant='outline' className='rounded-full'>
            View all
        </Button>
      </div>
      </> : (
        <p className='text-center text-xl my-10'>No Products Found</p>
      )}
    </div>
  )
}

export default TitledProductRail
