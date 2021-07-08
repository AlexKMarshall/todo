import { motion } from 'framer-motion'
import styles from './todo-item.module.scss'

type Props = {
  children: React.ReactNode
}

export function TodoItem({ children }: Props) {
  return (
    <motion.li className={styles.todoItem} layout>
      <motion.span
        initial={{ y: '120%' }}
        animate={{ y: 0 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.span>
    </motion.li>
  )
}
