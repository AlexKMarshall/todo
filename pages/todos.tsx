import { FormEvent, useRef, useState } from 'react'
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
import { ActiveTodosCount } from '@components/active-todos-count'
import { useRouter } from 'next/router'

export default function Todos() {
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
              <ActiveTodosCount />
              <div className={styles.filterButtons}>
                <Link href={`/todos`}>
                  <a
                    aria-label="show all todos"
                    className={styles.link}
                    aria-current={router.asPath === '/todos'}
                  >
                    All
                  </a>
                </Link>
                <Link href={`/todos?status=active`}>
                  <a
                    aria-label="show active todos"
                    className={styles.link}
                    aria-current={router.asPath === '/todos?status=active'}
                  >
                    Active
                  </a>
                </Link>
                <Link href={`/todos?status=completed`}>
                  <a
                    aria-label="show completed todos"
                    className={styles.link}
                    aria-current={router.asPath === '/todos?status=completed'}
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
