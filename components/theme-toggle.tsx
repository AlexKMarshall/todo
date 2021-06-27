import { useTheme } from '../context/theme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button type="button" onClick={() => toggleTheme()}>
      {theme === 'light' ? 'moon' : 'sun'}
    </button>
  )
}
