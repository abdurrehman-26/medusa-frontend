"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { StoreRegion } from '@medusajs/types'
import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { setRegion } from '@/features/region/regionSlice'
import { sdk } from '@/lib/sdk'
import { Button } from '@/components/ui/button'

function SelectRegionPageClient({regions}: {regions: StoreRegion[]}) {
  const region = useAppSelector(state => state.region.regionData)
  const cartId = useAppSelector(state => state.cart.cartData?.id)
  const dispatch = useAppDispatch()
  const [regionValue, setRegionValue] = useState<string>(region.id)
  async function HandleRegionChange() {
    const selectedRegionResponse = await sdk.store.region.retrieve(regionValue)
    dispatch(setRegion(selectedRegionResponse.region))
    Cookies.set("regionId", selectedRegionResponse.region.id)
    if (cartId) {
      sdk.store.cart.update(cartId, {
      region_id: regionValue,
    })
    }
    window.location.href="/"
  }
  return (
    <div className='flex w-full justify-center items-center min-h-screen'>
      <div className='flex flex-col gap-5 flex-1 max-w-md'>
      <Select value={regionValue} onValueChange={(value) => setRegionValue(value)}>
        <SelectTrigger className='w-full'>
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
              <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={HandleRegionChange}>Change region</Button>
      </div>
    </div>
  )
}

export default SelectRegionPageClient
