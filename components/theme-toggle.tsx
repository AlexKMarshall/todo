import { useTheme } from '../context/theme'
import { IconButton } from './icon-button'
import { MoonIcon } from './moon-icon'
import { SunIcon } from './sun-icon'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <IconButton
      onClick={() => toggleTheme()}
      aria-label={`Enable ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  )
}
