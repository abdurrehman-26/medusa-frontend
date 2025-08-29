import { getRegion } from '@/lib/data/regions'
import { sdk } from '@/lib/sdk'
import ProductPageClient from '@/modules/ProductPage/ProductPageClient'
import React from 'react'
import { cookies as nextCookies } from 'next/headers'

const ProductPage = async ({params}: {params: Promise<{handle: string}>}) => {
  const { handle } = await params
  const cookies = await nextCookies()
  const defaultRegion = await getRegion(process.env.NEXT_PUBLIC_MEDUSA_DEFAULT_REGION!)
  const region_id = cookies.get("region_id")?.value || defaultRegion?.id
  const product = await sdk.store.product.list({
    handle,
    fields: "*categories",
    region_id
  }).then(productResponse => productResponse.products[0])
  return (
    <ProductPageClient product={product} />
  )
}

export default ProductPage
