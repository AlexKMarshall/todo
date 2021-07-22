import styles from './todos.module.scss'
import { useNotification } from '@context/notification'
import { ActiveTodosCount } from '@components/active-todos-count'
import { Todo, TodoFilters } from './schemas'
import { Link } from '@components/link'
import { useClearCompletedTodos } from './queries'
import { CreateTodoForm } from './create-todo-form'
import { TodoList } from './todo-list'

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
        <Link onClick={() => clearCompletedTodosMutation.mutate()}>
          Clear Completed
        </Link>
      </div>
    </div>
  )
}
