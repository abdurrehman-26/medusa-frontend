import { sdk } from '@/lib/sdk'
import Link from 'next/link'
import React from 'react'
import RegionSelectorLink from '../RegionSelectorLink'

const Footer = async () => {
  const collections = await sdk.store.collection.list().then((collectionResponse) => collectionResponse.collections)
  const categories = await sdk.store.category.list().then((collectionResponse) => collectionResponse.product_categories)
  return (
    <div className='bg-foreground/3'>
      <div className='grid grid-cols-12 max-w-7xl mx-auto p-4 min-h-80'>
        <div className='col-span-12 sm:col-span-8 flex flex-col justify-between gap-5'>
          <div>
            <Link href="/" className="text-2xl font-bold text-primary">
              MyStore
            </Link>
          </div>
          <RegionSelectorLink />
        </div>
        <div className='space-y-2 max-sm:pt-5 col-span-12 sm:col-span-2'>
          {collections.map((collection) => {
              return(
                  <div key={collection.id}>
                  <Link href={`/collections/${collection.handle}`}>
                      {collection.title}
                  </Link>
                  </div>
              )
          })}
        </div>
        <div className='space-y-2 max-sm:pt-5 col-span-12 sm:col-span-2'>
          {categories.filter((category) => category.metadata?.footer_featured === true).map((category) => {
              return(
                  <div key={category.id}>
                  <Link href={`/categories/${category.handle}`}>
                      {category.name}
                  </Link>
                  </div>
              )
          })}
        </div>
      </div>
    </div>
  )
}

export default Footer
