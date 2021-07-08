import { AnimatePresence } from 'framer-motion'
import styles from './todo-list.module.scss'

type Props = { children: React.ReactNode }

export function TodoList({ children }: Props) {
  return (
    <ol role="list" className={styles.todoList}>
      <AnimatePresence>{children}</AnimatePresence>
    </ol>
  )
}
