import styles from './todos.module.scss'
import { useNotification } from '@context/notification'
import { ActiveTodosCount } from './components/active-todos-count'
import { Todo, TodoFilters } from './schemas'
import { Link } from '@components/link'
import { useClearCompletedTodos, useTodos } from './queries'
import { CreateTodoForm } from './components/create-todo-form'
import { TodoList } from './components/todo-list'
import { AnimatePresence } from 'framer-motion'

type Props = {
  onDeleteTodo?: (todo: Todo) => void
  filters?: TodoFilters
}

export function Todos({ onDeleteTodo = () => {}, filters = {} }: Props) {
  const { setNotificationMessage } = useNotification()

  function handleDeleteTodo(todo: Todo) {
    setNotificationMessage(`${todo.title} deleted`)
    onDeleteTodo(todo)
  }

  const clearCompletedTodosMutation = useClearCompletedTodos({
    onSuccess: () => {
      setNotificationMessage('Completed todos cleared')
    },
  })

  const countCompletedTodosQuery = useTodos({
    filters: { status: 'completed' },
    select: (todos) => todos.length,
  })

  return (
    <div className={styles.appContent}>
      <CreateTodoForm
        onCreateTodo={(todo) => setNotificationMessage(`${todo.title} added`)}
      />
      <div className={styles.backgroundShadow} />
      <TodoList onDeleteTodo={handleDeleteTodo} filters={filters} />
      <ActiveTodosCount />
      <div className={styles.filterLinks}>
        <Link href={`/todos`}>All</Link>
        <Link href={`/todos?status=active`}>Active</Link>
        <Link href="/todos?status=completed">Completed</Link>
      </div>
      <div className={styles.clearCompleted}>
        <AnimatePresence>
          {countCompletedTodosQuery.isSuccess &&
          countCompletedTodosQuery.data > 0 ? (
            <Link onClick={() => clearCompletedTodosMutation.mutate()}>
              Clear Completed
            </Link>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
