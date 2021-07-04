import styles from './todo-item.module.scss'

type Props = {
  children: React.ReactNode
}

export function TodoItem({ children }: Props) {
  return (
    <li className={styles.todoItem}>
      <span>{children}</span>
    </li>
  )
}
