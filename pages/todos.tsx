import { FormEvent, useMemo, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import Head from 'next/head'
import Link from 'next/link'
import { Todo } from 'types/todo'
import { TodoList } from '@components/todo-list'
import { ThemeToggle } from '@components/theme-toggle'
import { BackgroundImage } from '@components/background-image'
import styles from '@styles/todo.module.scss'
import { ScreenReaderNotification } from '@components/screen-reader-notification'
import { useNotification } from '@context/notification'
import { useMutation, useQueryClient } from 'react-query'
import { clearCompletedTodos, createTodo } from 'services/client'

type Filter = 'all' | 'active' | 'completed'
type FilterFunction = (todo: Todo) => boolean

const filterFunctions = new Map<Filter, FilterFunction>([
  ['all', () => true],
  ['active', (todo) => !todo.completed],
  ['completed', (todo) => todo.completed],
])

function getFilterFunction(filter: Filter): FilterFunction {
  return filterFunctions.get(filter) ?? (() => true)
}

export default function Home({
  initialTodos = [],
}: { initialTodos?: Todo[] } = {}) {
  const [oldTodos, setTodos] = useState(initialTodos)

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
    const newTodo = {
      id: nanoid(),
      title: todoInputText.trim(),
      completed: false,
    }
    createTodoMutation.mutate(newTodo)
  }

  const [oldFilter, setOldFilter] = useState<Filter>('all')
  const [filters, setFilters] = useState<
    { status: 'active' | 'completed' } | undefined
  >()

  function handleDeleteTodo(todo: Todo) {
    setNotificationMessage(`${todo.title} deleted`)
    headingRef.current?.focus()
  }

  // function clearCompletedTodos() {
  //   setTodos((existingTodos) => existingTodos.filter((todo) => !todo.completed))
  //   setNotificationMessage('Completed todos cleared')
  // }

  const numberTodosActive = useMemo(
    () => oldTodos.filter(getFilterFunction('active')).length,
    [oldTodos]
  )

  const itemsLeftText = `${numberTodosActive} item${
    numberTodosActive !== 1 ? 's' : ''
  } left`

  const isListEmpty = oldTodos.length === 0

  const headingRef = useRef<HTMLHeadingElement>(null)

  const clearCompletedTodosMutation = useMutation(clearCompletedTodos, {
    onSuccess: () => {
      setNotificationMessage('Completed todos cleared')
    },
    onSettled: () => {
      queryClient.invalidateQueries(['todos'])
    },
  })

  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta
          name="description"
          content="Todo App from a design by frontendmentor.io"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.screen}>
        <div className={styles.background}>
          <BackgroundImage />
        </div>
        <div className={styles.center}>
          <main className={styles.cover}>
            <header className={styles.header}>
              <h1 tabIndex={-1} ref={headingRef} className={styles.heading}>
                Todo
              </h1>
              <ThemeToggle />
            </header>
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
              <TodoList onDeleteTodo={handleDeleteTodo} />
              <div className={styles.itemsCount}>{itemsLeftText}</div>
              <div className={styles.filterButtons}>
                <Link href={`/todos`}>
                  <a aria-label="show all todos" className={styles.link}>
                    All
                  </a>
                </Link>
                <Link href={`/todos?status=active`}>
                  <a aria-label="show active todos" className={styles.link}>
                    Active
                  </a>
                </Link>
                <Link href={`/todos?status=completed`}>
                  <a aria-label="show completed todos" className={styles.link}>
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
              <ScreenReaderNotification />
            </div>
            {/* <footer>
            <small>Some footer text</small>
          </footer> */}
          </main>
        </div>
      </div>
    </>
  )
}
