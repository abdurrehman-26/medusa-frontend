import { sdk } from '@/lib/sdk'
import SelectRegionPageClient from '@/modules/SelectRegion/SelectRegionPageClient'
import React from 'react'

async function SelectRegionPage() {
  const regionsResponse = await sdk.store.region.list()
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <SelectRegionPageClient regions={regionsResponse.regions} />
    </div>
  )
}

export default SelectRegionPage
