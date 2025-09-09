import { sdk } from '@/lib/sdk'
import ProductPageClient from '@/modules/ProductPage/ProductPageClient'
import React from 'react'
import { cookies as nextCookies } from 'next/headers'

const ProductPage = async ({params}: {params: Promise<{handle: string}>}) => {
  const { handle } = await params
  const cookies = await nextCookies()
  const region_id = cookies.get("regionId")?.value || process.env.NEXT_PUBLIC_MEDUSA_DEFAULT_REGION_ID
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
