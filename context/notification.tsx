import {
  ComponentPropsWithoutRef,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'
import styles from 'styles/utils.module.scss'

type WithChildren<T extends {}> = T & {
  children: ReactNode
}

type NotificationContextValue = {
  setNotificationMessage: (message: string) => void
  getNotificationProps: (
    overrides?: ComponentPropsWithoutRef<'div'>
  ) => WithChildren<ComponentPropsWithoutRef<'div'>>
}

const NotificationContext = createContext<NotificationContextValue | null>(null)
NotificationContext.displayName = 'NotificationContext'

export function NotificationProvider({
  children,
}: WithChildren<{}>): JSX.Element {
  const [notificationMessage, setNotificationMessage] = useState('')

  const getNotificationProps = useCallback(
    (overrides?: ComponentPropsWithoutRef<'div'>) => {
      return {
        role: 'status' as const,
        'aria-live': 'polite' as const,
        className: styles.visuallyHidden,
        children: notificationMessage,
        ...overrides,
      }
    },
    [notificationMessage]
  )

  const value = { getNotificationProps, setNotificationMessage }

  return (
    <NotificationContext.Provider value={value}>
      {children}
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
