import { useEffect, useMemo, useState } from 'react'

const themes = ['light', 'dark'] as const
type Theme = typeof themes[number]

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

export function ThemeToggle() {
  const [savedPreference, setSavedPreference] = useState<Theme | null>(null)
  const [mediaQueryPreference, setMediaQueryPreference] =
    useState<Theme | null>(null)

  console.log({ savedPreference })
  console.log({ mediaQueryPreference })

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

  console.log({ currentTheme })

  function toggleTheme() {
    setSavedPreference(currentTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <button type="button" onClick={() => toggleTheme()}>
      {currentTheme === 'light' ? 'moon' : 'sun'}
    </button>
  )
}
