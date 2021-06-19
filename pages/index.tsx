import { FormEvent, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import Head from 'next/head'
import Image from 'next/image'
// import styles from '../styles/Home.module.css'

const defaultInitialTodos = [
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

type Todo = typeof defaultInitialTodos[number]
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

export default function Home({ initialTodos = defaultInitialTodos } = {}) {
  const [todos, setTodos] = useState(initialTodos)
  const [currentFilter, setCurrentFilter] = useState<Filter>('all')
  const [todoInputText, setTodoInputText] = useState('')

  const currentFilterFunction = filterFunctions.get(currentFilter)

  const filteredTodos = useMemo(
    () => (currentFilterFunction ? todos.filter(currentFilterFunction) : todos),
    [currentFilterFunction, todos]
  )

  const numberTodosActive = useMemo(
    () => todos.filter(getFilterFunction('active')).length,
    [todos]
  )

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!todoInputText) return
    setTodos((existingTodos) => {
      const newTodo = { id: nanoid(), title: todoInputText, completed: false }
      return [newTodo, ...existingTodos]
    })
    setTodoInputText('')
  }

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
          />
          <button type="submit">add</button>
        </form>
        <div>
          <p>Well done, your tasks are complete</p>
        </div>
        <ol>
          {filteredTodos.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
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
