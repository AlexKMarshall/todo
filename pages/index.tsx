import { FormEvent, useMemo, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import Head from 'next/head'
import { Todo } from 'types/todo'
import styles from '../styles/todo.module.css'

const defaultInitialTodos: Array<Todo> = [
  {
    id: nanoid(),
    title: 'Jog around the park 3x',
    completed: false,
  },
  {
    id: nanoid(),
    title: '10 minutes meditation',
    completed: false,
  },
  {
    id: nanoid(),
    title: 'Read for 1 hour',
    completed: true,
  },
]

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
    <div>
      <Head>
        <title>Todo App</title>
        <meta
          name="description"
          content="Todo App from a design by frontendmentor.io"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 tabIndex={-1} ref={headingRef}>
          Todo
        </h1>
        <form onSubmit={submitForm}>
          <input
            type="text"
            value={todoInputText}
            onChange={(e) => setTodoInputText(e.target.value)}
            aria-invalid={isInputInvalid}
            aria-label="Write a new todo item"
          />
          <button type="submit" disabled={isInputInvalid}>
            add
          </button>
        </form>
        {isListEmpty ? (
          <div>
            <p>Well done, your tasks are complete</p>
          </div>
        ) : null}
        <ol role="list" className={styles['todo-list']}>
          {filteredTodos.map((todo) => (
            <li key={todo.id}>
              <input
                type="checkbox"
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onChange={() => toggleTodoCompleted(todo.id)}
              />
              <label htmlFor={`todo-${todo.id}`}>{todo.title}</label>
              <button
                type="button"
                aria-label={`delete ${todo.title}`}
                onClick={() => deleteTodo(todo)}
              >
                &times;
              </button>
            </li>
          ))}
        </ol>
        <div>{itemsLeftText}</div>
        <button
          type="button"
          aria-label="show all todos"
          aria-pressed={currentFilter === 'all'}
          onClick={() => setCurrentFilter('all')}
        >
          All
        </button>
        <button
          type="button"
          aria-label="show active todos"
          aria-pressed={currentFilter === 'active'}
          onClick={() => setCurrentFilter('active')}
        >
          Active
        </button>
        <button
          type="button"
          aria-label="show completed todos"
          aria-pressed={currentFilter === 'completed'}
          onClick={() => setCurrentFilter('completed')}
        >
          Completed
        </button>
        <button type="button" onClick={() => clearCompletedTodos()}>
          Clear Completed
        </button>
        <div role="status" aria-live="polite" className="visually-hidden">
          {feedback}
        </div>
      </main>
    </div>
  )
}
