"use client"
import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useAppSelector } from '@/store/hooks'
import Link from 'next/link'
import { Globe } from 'lucide-react'

function RegionSelectorLink() {
  const regionData = useAppSelector(state => state.region.regionData)
  useEffect(() => {
    const regionIdCookie = Cookies.get("regionId")
    if (!regionIdCookie) {
      Cookies.set("regionId", regionData.id)
    }
  }, [regionData.id])
  return (
    <div className='flex gap-1 items-center text-foreground/80'>
        <Globe size={20} className='text-primary' />
        <Link className='underline' href="/select-region">{regionData.name}</Link>
    </div>
  )
}

export default RegionSelectorLink
