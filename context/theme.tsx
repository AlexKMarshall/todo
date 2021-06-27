import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react'

const themes = ['light', 'dark'] as const
export type Theme = typeof themes[number]

function getLocalStorageTheme(): Theme | null {
  const maybeTheme: unknown = window.localStorage.getItem('theme')
  const theme = themes.find((theme) => theme === maybeTheme)
  if (theme) return theme
  return null
}

function getMediaQueryTheme(): Theme | null {
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  const hasMediaQueryPreference = typeof mql.matches === 'boolean'

  if (hasMediaQueryPreference) {
    return mql.matches ? 'dark' : 'light'
  }

  return null
}

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
ThemeContext.displayName = 'ThemeContext'

function ThemeProvider({ children }: { children: ReactNode }) {
  const [savedPreference, setSavedPreference] = useState<Theme | null>(null)
  const [mediaQueryPreference, setMediaQueryPreference] =
    useState<Theme | null>(null)

  useEffect(function initialiseFromLocalStorage() {
    const maybeSavedPreference = getLocalStorageTheme()
    if (maybeSavedPreference) setSavedPreference(maybeSavedPreference)
  }, [])

  useEffect(function syncMediaQueryPreference() {
    const maybeMQPreference = getMediaQueryTheme()
    if (maybeMQPreference) setMediaQueryPreference(maybeMQPreference)
  }, [])

  useEffect(
    function syncDocumentTheme() {
      if (savedPreference) {
        document.documentElement.dataset.userTheme = savedPreference
      }
    },
    [savedPreference]
  )

  useEffect(
    function syncThemeLocalStorage() {
      if (savedPreference) {
        window.localStorage.setItem('theme', savedPreference)
      }
    },
    [savedPreference]
  )

  const currentTheme = savedPreference ?? mediaQueryPreference ?? 'light'

  function toggleTheme() {
    setSavedPreference(currentTheme === 'light' ? 'dark' : 'light')
  }

  const value: ThemeContextValue = { theme: currentTheme, toggleTheme }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

function useTheme() {
  const themeContext = useContext(ThemeContext)
  if (!themeContext)
    throw new Error('useTheme must be used within a ThemeProvider')
  return themeContext
}

export { ThemeProvider, useTheme }
