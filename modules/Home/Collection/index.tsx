import React from 'react'
import TitledProductRail from '../TitledProductRail'
import { sdk } from '@/lib/sdk'

const Collection = async ({handle, region_id}: {handle: string, region_id: string}) => {
  const collection = await sdk.store.collection.list({
    handle
  }).then((collectionResponse) => collectionResponse.collections[0])
  const products = await sdk.store.product.list({
    collection_id: collection.id,
    region_id,
    fields: "*categories"
  }).then((productResponse) => productResponse.products)
  return (
    <TitledProductRail products={products} title={handle} />
  )
}

export default Collection
