import { FormEvent, useMemo, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import Head from 'next/head'
import Image from 'next/image'
import { Todo } from 'types/todo'
import { CrossIcon } from '@components/cross-icon'
import { CheckIcon } from '@components/check-icon'
import styles from '../styles/todo.module.scss'
import backgroundLight from '../public/bg-light.jpg'

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
  const [todos, setTodos] = useState(initialTodos)

  const [todoInputText, setTodoInputText] = useState('')
  const isInputInvalid = todoInputText.trim().length === 0

  const [feedback, setFeedback] = useState('')

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isInputInvalid) return
    const newTodo = {
      id: nanoid(),
      title: todoInputText.trim(),
      completed: false,
    }
    setTodos((existingTodos) => [newTodo, ...existingTodos])
    setFeedback(`${newTodo.title} added`)
    setTodoInputText('')
  }

  const [currentFilter, setCurrentFilter] = useState<Filter>('all')
  const currentFilterFunction = filterFunctions.get(currentFilter)

  const filteredTodos = useMemo(
    () => (currentFilterFunction ? todos.filter(currentFilterFunction) : todos),
    [currentFilterFunction, todos]
  )

  function toggleTodoCompleted(todoId: Todo['id']) {
    setTodos((existingTodos) =>
      existingTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  function deleteTodo(todo: Todo) {
    setTodos((existingTodos) => existingTodos.filter((t) => t !== todo))
    setFeedback(`${todo.title} deleted`)
    headingRef.current?.focus()
  }

  function clearCompletedTodos() {
    setTodos((existingTodos) => existingTodos.filter((todo) => !todo.completed))
    setFeedback('Completed todos cleared')
  }

  const numberTodosActive = useMemo(
    () => todos.filter(getFilterFunction('active')).length,
    [todos]
  )

  const itemsLeftText = `${numberTodosActive} item${
    numberTodosActive !== 1 ? 's' : ''
  } left`

  const isListEmpty = todos.length === 0

  const headingRef = useRef<HTMLHeadingElement>(null)

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
          <Image src={backgroundLight} alt="" layout="fill" objectFit="cover" />
        </div>
        <div className={styles.center}>
          <main className={styles.cover}>
            <h1 tabIndex={-1} ref={headingRef} className={styles.heading}>
              Todo
            </h1>
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
              <ol role="list" className={styles.todoList}>
                {filteredTodos.map((todo) => (
                  <li key={todo.id} className={styles.todoItem}>
                    <input
                      type="checkbox"
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onChange={() => toggleTodoCompleted(todo.id)}
                      className={styles.todoCompletedCheckboxInput}
                    />
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={styles.todoItemLabel}
                    >
                      <span className={styles.todoItemCheckBorderWrap}>
                        <span className={styles.todoItemCheck}>
                          <CheckIcon aria-hidden className={styles.checkIcon} />
                        </span>
                      </span>
                      <span className={styles.todoItemText}>{todo.title}</span>
                    </label>
                    <button
                      type="button"
                      aria-label={`delete ${todo.title}`}
                      onClick={() => deleteTodo(todo)}
                      className={styles.deleteTodoButton}
                    >
                      <CrossIcon className={styles.deleteTodoIcon} />
                    </button>
                  </li>
                ))}
              </ol>
              {isListEmpty ? (
                <div className={styles.emptyMessage}>
                  <p>Well done, your tasks are complete</p>
                </div>
              ) : null}
              <div className={styles.itemsCount}>{itemsLeftText}</div>
              <div className={styles.filterButtons}>
                <button
                  type="button"
                  aria-label="show all todos"
                  aria-pressed={currentFilter === 'all'}
                  onClick={() => setCurrentFilter('all')}
                  className={styles.link}
                >
                  All
                </button>
                <button
                  type="button"
                  aria-label="show active todos"
                  aria-pressed={currentFilter === 'active'}
                  onClick={() => setCurrentFilter('active')}
                  className={styles.link}
                >
                  Active
                </button>
                <button
                  type="button"
                  aria-label="show completed todos"
                  aria-pressed={currentFilter === 'completed'}
                  onClick={() => setCurrentFilter('completed')}
                  className={styles.link}
                >
                  Completed
                </button>
              </div>
              <div className={styles.clearCompleted}>
                <button
                  type="button"
                  onClick={() => clearCompletedTodos()}
                  className={styles.link}
                >
                  Clear Completed
                </button>
              </div>
              <div
                role="status"
                aria-live="polite"
                className={styles.visuallyHidden}
              >
                {feedback}
              </div>
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
