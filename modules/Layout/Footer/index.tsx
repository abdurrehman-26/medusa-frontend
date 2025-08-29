import { sdk } from '@/lib/sdk'
import Link from 'next/link'
import React from 'react'

const Footer = async () => {
  const collections = await sdk.store.collection.list().then((collectionResponse) => collectionResponse.collections)
  const categories = await sdk.store.category.list().then((collectionResponse) => collectionResponse.product_categories)
  return (
    <div className='grid grid-cols-12 max-w-7xl mx-auto p-4 border-t border-border shadow-xs min-h-80'>
      <div className='col-span-8'>
        <Link href="/" className="text-2xl font-bold text-primary">
          MyStore
        </Link>
      </div>
      <div className='space-y-2 col-span-2'>
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
      <div className='space-y-2 col-span-2'>
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
  )
}

export default Footer
