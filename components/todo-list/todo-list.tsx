import styles from './todo-list.module.scss'

type Props = { children: React.ReactNode }

export function TodoList({ children }: Props) {
  return (
    <ol role="list" className={styles.todoList}>
      {children}
    </ol>
  )
}
