import { AnimatePresence, motion } from 'framer-motion'
import { TodoItem } from './todo-item'
import { Todo, TodoFilters } from './schemas'
import { useTodos } from './queries'
import styles from './todos.module.scss'

type Props = {
  onDeleteTodo: (todo: Todo) => void
  filters?: TodoFilters
}

export function TodoList({ onDeleteTodo, filters = {} }: Props) {
  const todoQuery = useTodos({ filters })

  if (todoQuery.isLoading || todoQuery.isIdle) return <div>Loading...</div>

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
