import { motion } from 'framer-motion'
import styles from './todo-item.module.scss'

type Props = {
  children: React.ReactNode
}

export function TodoItem({ children }: Props) {
  return (
    <motion.li
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layout
      className={styles.todoItem}
    >
      {children}
    </motion.li>
  )
}
