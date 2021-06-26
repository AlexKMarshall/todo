import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    document.body.dataset.theme = theme
  }, [theme])

  return (
    <button
      type="button"
      onClick={() =>
        setTheme((theme) => (theme === 'light' ? 'dark' : 'light'))
      }
    >
      {theme === 'light' ? 'moon' : 'sun'}
    </button>
  )
}
