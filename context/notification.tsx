import { createContext, ReactNode, useContext, useState } from 'react'
import { VisuallyHidden } from '@components/visually-hidden'

type WithChildren<T extends {}> = T & {
  children: ReactNode
}

type NotificationContextValue = {
  setNotificationMessage: (message: string) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)
NotificationContext.displayName = 'NotificationContext'

export function NotificationProvider({
  children,
}: WithChildren<{}>): JSX.Element {
  const [notificationMessage, setNotificationMessage] = useState('')

  const value = { setNotificationMessage }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <VisuallyHidden>
        <div role="status" aria-live="polite">
          {notificationMessage}
        </div>
      </VisuallyHidden>
    </NotificationContext.Provider>
  )
}

export function useNotification(): NotificationContextValue {
  const context = useContext(NotificationContext)
  if (!context)
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    )
  return context
}
