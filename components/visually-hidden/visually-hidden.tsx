import styles from './visually-hidden.module.scss'

type Props = {
  children: React.ReactNode
}

export function VisuallyHidden({ children }: Props) {
  return <div className={styles.visuallyHidden}>{children}</div>
}
