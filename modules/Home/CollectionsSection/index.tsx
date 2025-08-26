import { StoreCollection } from '@medusajs/types'
import React from 'react'
import TitledProductRail from '../TitledProductRail'
import { sdk } from '@/lib/sdk'

const CollectionsSection = ({collections, regionId}: {collections: StoreCollection[], regionId: string}) => {
  return (
    <div>
      {collections.map(async (collection) => {
        const products = await sdk.store.product.list({
            collection_id: collection.id,
            region_id: regionId
        }).then((response) => response.products)
        return (
            <TitledProductRail key={collection.id} title={collection.title} products={products} />
        )
      })}
    </div>
  )
}

export default CollectionsSection
