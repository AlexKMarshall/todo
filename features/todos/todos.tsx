import { FormEvent, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import Link from 'next/link'
import { Todo } from '@types/todo'
import { TodoList } from '@components/todo-list'
import styles from '@styles/todo.module.scss'
import { useNotification } from '@context/notification'
import { useMutation, useQueryClient } from 'react-query'
import { clearCompletedTodos, createTodo } from '@services/client'
import { ActiveTodosCount } from '@components/active-todos-count'
import { useRouter } from 'next/router'
import { TodoFilters } from '@types/todo'

type Props = {
  onDeleteTodo?: (todo: Todo) => void
  filters?: TodoFilters
}

export function Todos({ onDeleteTodo = () => {}, filters = {} }: Props) {
  const router = useRouter()
  const [todoInputText, setTodoInputText] = useState('')
  const isInputInvalid = todoInputText.trim().length === 0

  const { setNotificationMessage } = useNotification()

  const queryClient = useQueryClient()

  const createTodoMutation = useMutation(
    (todo: Todo) => {
      return createTodo(todo)
    },
    {
      onSuccess: (createdTodo) => {
        setNotificationMessage(`${createdTodo.title} added`)
        setTodoInputText('')
      },
      onSettled: () => {
        queryClient.invalidateQueries(['todos'])
      },
    }
  )

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

  const clearCompletedTodosMutation = useMutation(clearCompletedTodos, {
    onSuccess: () => {
      setNotificationMessage('Completed todos cleared')
    },
    onSettled: () => {
      queryClient.invalidateQueries(['todos'])
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
        <Link href={`/todos`}>
          <a
            aria-label="show all todos"
            className={styles.link}
            aria-current={router?.asPath === '/todos'}
          >
            All
          </a>
        </Link>
        <Link href={`/todos?status=active`}>
          <a
            aria-label="show active todos"
            className={styles.link}
            aria-current={router?.asPath === '/todos?status=active'}
          >
            Active
          </a>
        </Link>
        <Link href={`/todos?status=completed`}>
          <a
            aria-label="show completed todos"
            className={styles.link}
            aria-current={router?.asPath === '/todos?status=completed'}
          >
            Completed
          </a>
        </Link>
      </div>
      <div className={styles.clearCompleted}>
        <button
          type="button"
          onClick={() => clearCompletedTodosMutation.mutate()}
          className={styles.link}
        >
          Clear Completed
        </button>
      </div>
    </div>
  )
}
