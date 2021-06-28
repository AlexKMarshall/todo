import { useEffect } from 'react'
import { useTheme } from '../context/theme'
import { useNotification } from '../context/notification'
import { IconButton } from './icon-button'
import { MoonIcon } from './moon-icon'
import { SunIcon } from './sun-icon'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { setNotificationMessage } = useNotification()

  useEffect(() => {
    setNotificationMessage(`Color mode is now ${theme}`)
  }, [setNotificationMessage, theme])

  return (
    <IconButton
      onClick={() => toggleTheme()}
      aria-label={`Enable ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  )
}
