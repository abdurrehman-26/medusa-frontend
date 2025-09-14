// app/providers/redux-provider.tsx
"use client"

import { Provider } from "react-redux"
import { createStore, RootState } from "@/store/store"
import { useMemo } from "react"

export function StoreProvider({
  children,
  preloadedState
}: {
  children: React.ReactNode
  preloadedState?: Partial<RootState>
}) {
  const store = useMemo(() => createStore(preloadedState), [preloadedState])

  return <Provider store={store}>{children}</Provider>
}
