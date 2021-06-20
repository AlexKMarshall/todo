import { FormEvent, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import Head from 'next/head'
import Image from 'next/image'
import { Todo } from 'types/todo'
// import styles from '../styles/Home.module.css'

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

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isInputInvalid) return
    setTodos((existingTodos) => {
      const newTodo = {
        id: nanoid(),
        title: todoInputText.trim(),
        completed: false,
      }
      return [newTodo, ...existingTodos]
    })
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

  const numberTodosActive = useMemo(
    () => todos.filter(getFilterFunction('active')).length,
    [todos]
  )

  const itemsLeftText = `${numberTodosActive} item${
    numberTodosActive !== 1 ? 's' : ''
  } left`

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
        <h1>Todo</h1>
        <form onSubmit={submitForm}>
          <label htmlFor="new-todo">Create a new todo...</label>
          <input
            type="text"
            name="new-todo"
            id="new-todo"
            value={todoInputText}
            onChange={(e) => setTodoInputText(e.target.value)}
            aria-invalid={isInputInvalid}
          />
          <button type="submit" disabled={isInputInvalid}>
            add
          </button>
        </form>
        <div>
          <p>Well done, your tasks are complete</p>
        </div>
        <ol>
          {filteredTodos.map((todo) => (
            <li key={todo.id}>
              <input
                type="checkbox"
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onChange={() => toggleTodoCompleted(todo.id)}
              />
              <label htmlFor={`todo-${todo.id}`}>{todo.title}</label>
            </li>
          ))}
        </ol>
        <div>{itemsLeftText}</div>
        <button
          type="button"
          aria-label="show all todos"
          onClick={() => setCurrentFilter('all')}
        >
          All
        </button>
        <button
          type="button"
          aria-label="show active todos"
          onClick={() => setCurrentFilter('active')}
        >
          Active
        </button>
        <button
          type="button"
          aria-label="show completed todos"
          onClick={() => setCurrentFilter('completed')}
        >
          Completed
        </button>
      </main>
    </div>
  )
}
