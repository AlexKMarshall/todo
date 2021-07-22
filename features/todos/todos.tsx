import { FormEvent, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import NextLink from 'next/link'
import { Todo } from '@types/todo'
import { TodoList } from '@components/todo-list'
import styles from '@styles/todo.module.scss'
import { useNotification } from '@context/notification'
import { ActiveTodosCount } from '@components/active-todos-count'
import { useRouter } from 'next/router'
import { TodoFilters } from '@types/todo'
import { Link } from '@components/link'
import { useClearCompletedTodos, useCreateTodo } from './queries'

type Props = {
  onDeleteTodo?: (todo: Todo) => void
  filters?: TodoFilters
}

export function Todos({ onDeleteTodo = () => {}, filters = {} }: Props) {
  const router = useRouter()
  const [todoInputText, setTodoInputText] = useState('')
  const isInputInvalid = todoInputText.trim().length === 0

  const { setNotificationMessage } = useNotification()

  const createTodoMutation = useCreateTodo({
    onSuccess: (createdTodo) => {
      setNotificationMessage(`${createdTodo.title} added`)
      setTodoInputText('')
    },
  })

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isInputInvalid) return
    const newTodo: Todo = {
      id: nanoid(),
      title: todoInputText.trim(),
      status: 'active',
    }
    createTodoMutation.mutate(newTodo)
  }

  const headingRef = useRef<HTMLHeadingElement>(null)

  function handleDeleteTodo(todo: Todo) {
    setNotificationMessage(`${todo.title} deleted`)
    onDeleteTodo(todo)
    headingRef.current?.focus()
  }

  const clearCompletedTodosMutation = useClearCompletedTodos({
    onSuccess: () => {
      setNotificationMessage('Completed todos cleared')
    },
  })

  return (
    <div className={styles.appContent}>
      <form onSubmit={submitForm} className={styles.todoForm}>
        <span className={styles.decorativeCircle} />
        <input
          type="text"
          value={todoInputText}
          onChange={(e) => setTodoInputText(e.target.value)}
          aria-invalid={isInputInvalid}
          aria-label="Write a new todo item"
          placeholder="Visit the zoo"
          className={styles.todoInput}
        />
        <button
          type="submit"
          disabled={isInputInvalid}
          className={styles.visuallyHidden}
        >
          add
        </button>
      </form>
      <div className={styles.backgroundShadow} />
      <TodoList onDeleteTodo={handleDeleteTodo} filters={filters} />
      <ActiveTodosCount />
      <div className={styles.filterButtons}>
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
