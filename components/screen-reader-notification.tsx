import { useNotification } from '@context/notification'

export function ScreenReaderNotification(): JSX.Element {
  const { getNotificationProps } = useNotification()

  return <div {...getNotificationProps()} />
}
