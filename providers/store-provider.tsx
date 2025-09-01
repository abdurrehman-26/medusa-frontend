// app/providers/redux-provider.tsx
"use client"
import { Provider } from "react-redux"
import { createStore, RootState } from "@/store/store"
import { useRef } from "react"

export function StoreProvider({
  children,
  preloadedState
}: {
  children: React.ReactNode
  preloadedState?: Partial<RootState>
}) {
  const storeRef = useRef(createStore(preloadedState))
  return <Provider store={storeRef.current}>{children}</Provider>
}
