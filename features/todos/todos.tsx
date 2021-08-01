import styled from 'styled-components'
import { pluralise } from 'utils'
import styles from './todos.module.scss'
import { useNotification } from '@context/notification'
import { Todo, TodoFilters } from './schemas'
import { Link } from '@components/link'
import { useClearCompletedTodos, useTodos } from './queries'
import { CreateTodoForm as CreateTodoFormComponent } from './components/create-todo-form'
import { TodoList as TodoListComponent } from './components/todo-list'
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

  const activeTodosLeft = useActiveTodosLeft()
  const shouldShowClearCompleted = useShouldShowClearCompleted()

  return (
    <div className={styles.appContent}>
      <CreateTodoForm
        onCreateTodo={(todo) => setNotificationMessage(`${todo.title} added`)}
      />
      <div className={styles.backgroundShadow} />
      <TodoList onDeleteTodo={handleDeleteTodo} filters={filters} />
      <div className={styles.itemsCount}>{activeTodosLeft}</div>
      <div className={styles.filterLinks}>
        <Link href={`/todos`}>All</Link>
        <Link href={`/todos?status=active`}>Active</Link>
        <Link href="/todos?status=completed">Completed</Link>
      </div>
      <div className={styles.clearCompleted}>
        <AnimatePresence>
          {shouldShowClearCompleted ? (
            <Link onClick={() => clearCompletedTodosMutation.mutate()}>
              Clear Completed
            </Link>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

function useActiveTodosLeft() {
  const activeTodosCountQuery = useTodos({
    filters: { status: 'active' },
    select: (todos) => todos.length,
  })

  if (!activeTodosCountQuery.isSuccess) return null

  const count = activeTodosCountQuery.data

  return `${count} ${pluralise('item', count)} left`
}

function useShouldShowClearCompleted() {
  const countCompletedTodosQuery = useTodos({
    filters: { status: 'completed' },
    select: (todos) => todos.length,
  })

  return countCompletedTodosQuery.isSuccess && countCompletedTodosQuery.data > 0
}

const CreateTodoForm = styled(CreateTodoFormComponent)`
  grid-area: input;
`
const TodoList = styled(TodoListComponent)`
  grid-area: list;
`
