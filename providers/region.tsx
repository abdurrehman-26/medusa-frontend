"use client"

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState,
} from "react"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/sdk"
import Cookies from "js-cookie"

type RegionContextType = {
  region?: HttpTypes.StoreRegion
  setRegion: React.Dispatch<
    React.SetStateAction<HttpTypes.StoreRegion | undefined>
  >
}

const RegionContext = createContext<RegionContextType | null>(null)

type RegionProviderProps = {
  children: React.ReactNode
}

export const RegionProvider = ({ children }: RegionProviderProps) => {
  const [region, setRegion] = useState<HttpTypes.StoreRegion>()

  useEffect(() => {
    if (region) {
      // store region ID in cookie
      Cookies.set("region_id", region.id, { expires: 7 }) // 7 days, adjust as needed
      return
    }

    const regionId = Cookies.get("region_id")
    if (!regionId) {
      // no cookie, get first available region
      sdk.store.region.list().then(({ regions }) => {
        if (regions?.length) {
          setRegion(regions[0])
        }
      })
    } else {
      // retrieve selected region from cookie
      sdk.store.region.retrieve(regionId).then(({ region: dataRegion }) => {
        setRegion(dataRegion)
      })
    }
  }, [region])

  return (
    <RegionContext.Provider
      value={{
        region,
        setRegion,
      }}
    >
      {children}
    </RegionContext.Provider>
  )
}

export const useRegion = () => {
  const context = useContext(RegionContext)

  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider")
  }

  return context
}
