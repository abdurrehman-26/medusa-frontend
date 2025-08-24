'use client'

import { Button } from '@/components/ui/button'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="p-2 size-9 rounded-full animate-pulse bg-primary"></div>
    )
  }

  // Define the theme cycle
  const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
  const currentIndex = themes.indexOf(theme as 'light' | 'dark' | 'system')
  const nextTheme = themes[(currentIndex + 1) % themes.length]

  return (
    <Button
      className="rounded-full"
      size="icon"
      onClick={() => setTheme(nextTheme)}
      title={`Switch theme (current: ${theme})`}
    >
      {theme === 'system' ? (
        <Monitor />
      ) : resolvedTheme === 'dark' ? (
        <Sun />
      ) : (
        <Moon />
      )}
    </Button>
  )
}
