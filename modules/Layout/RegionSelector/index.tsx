"use client"
import { StoreRegion } from '@medusajs/types'
import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { sdk } from '@/lib/sdk'
import { setRegion } from '@/features/region/regionSlice'

function RegionSelector({regions}: {regions: StoreRegion[]}) {
  const regionId = useAppSelector(state => state.region.regionData.id)
  const dispatch = useAppDispatch()
  useEffect(() => {
    const regionIdCookie = Cookies.get("regionId")
    if (!regionIdCookie) {
      Cookies.set("regionId", regionId)
    }
  }, [regionId])
  async function HandleRegionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedRegionResponse = await sdk.store.region.retrieve(e.target.value)
    dispatch(setRegion(selectedRegionResponse.region))
    Cookies.set("regionId", selectedRegionResponse.region.id)
    window.location.reload()
  }
  return (
    <div className='flex gap-1 items-center'>
      <p>Region:</p>
      <select value={regionId} onChange={HandleRegionChange}>
          {regions.map((region) => (
            <option key={region.id} className="rounded-2xl" value={region.id}>{region.name}</option>
          ))}
      </select>
    </div>
  )
}

export default RegionSelector
