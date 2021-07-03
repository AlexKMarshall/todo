import { ReactNode } from 'react'
import styles from '@styles/icon-button.module.scss'

type Props = {
  'aria-label': string
  children: ReactNode
} & React.ComponentPropsWithoutRef<'button'>

export function IconButton({ children, ...props }: Props) {
  return (
    <button type="button" className={styles.iconButton} {...props}>
      {children}
    </button>
  )
}
