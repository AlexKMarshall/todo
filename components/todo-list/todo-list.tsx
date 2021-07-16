import { AnimatePresence, motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { getTodos } from 'services/client'
import { TodoItem } from '@components/todo-item'

import styles from './todo-list.module.scss'
import { Todo } from 'types/todo'

type Props = {
  onDeleteTodo: (todo: Todo) => void
}

export function TodoList({ onDeleteTodo }: Props) {
  const todoQuery = useQuery(['todos'], getTodos)

  if (todoQuery.isLoading || todoQuery.isIdle) return <div>Loadonig...</div>

  if (todoQuery.isError)
    return (
      <div>
        Something went wrong{' '}
        <pre>{JSON.stringify(todoQuery.error, null, 2)}</pre>
      </div>
    )

  const isListEmpty = todoQuery.data.length === 0

  if (isListEmpty)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={styles.emptyMessage}
      >
        <p>Well done, your tasks are complete. Add some more?</p>
      </motion.div>
    )

  console.log(todoQuery.data)

  return (
    <ol role="list" className={styles.todoList}>
      <AnimatePresence>
        {todoQuery.data.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onDeleteTodo={onDeleteTodo} />
        ))}
      </AnimatePresence>
    </ol>
  )
}
