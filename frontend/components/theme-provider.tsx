"use client"

import * as React from "react"

type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({ children, defaultTheme = "dark" }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)

  React.useEffect(() => {
    const root = window.document.documentElement
    const savedTheme = localStorage.getItem("theme") as Theme | null

    if (savedTheme) {
      setTheme(savedTheme)
      root.classList.remove("light", "dark")
      root.classList.add(savedTheme)
    } else {
      root.classList.add(defaultTheme)
    }
  }, [defaultTheme])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme: Theme) => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(newTheme)
        localStorage.setItem("theme", newTheme)
        setTheme(newTheme)
      },
    }),
    [theme],
  )

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
