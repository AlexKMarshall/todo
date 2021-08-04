import { arrayMove } from '@dnd-kit/sortable'
import { Todo, TodoFilters } from '../features/todos/schemas'

const STORAGE_KEY = 'todo-app-todos'

type ClientOptions<TData extends Object> = RequestInit & {
  data?: TData
}

async function client<TResult = unknown, TData = {}>(
  endpoint: string,
  { data, headers: customHeaders, ...initOptions }: ClientOptions<TData> = {}
): Promise<TResult> {
  const headers: HeadersInit = {}
  if (data) {
    headers['content-type'] = 'application/json'
  }

  const init: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data && JSON.stringify(data),
    headers: {
      ...headers,
      ...customHeaders,
    },
    ...initOptions,
  }

  try {
    const res = await fetch(endpoint, init)
    const result = (await res.json()) as unknown
    if (!res.ok) return Promise.reject(result)
    return result as TResult
  } catch (error) {
    console.error('in client function, ', error)
    return Promise.reject(error)
  }
}

function getAllTodos(): Promise<Array<Todo>> {
  const serializedTodos = window.localStorage.getItem(STORAGE_KEY)
  if (!serializedTodos) return Promise.resolve([])
  try {
    const todos = JSON.parse(serializedTodos) as Array<Todo>
    return Promise.resolve(todos)
  } catch (e) {
    return Promise.resolve([])
  }
}

async function getTodos(filters: TodoFilters = {}): Promise<Array<Todo>> {
  const allTodos = await getAllTodos()

  return Object.entries(filters).reduce(
    (filteredTodos, [field, filterValue]) => {
      return filteredTodos.filter((todo) => {
        if (field in todo) {
          // we've checked that field is in our object, so the type assertion is safe
          return todo[field as keyof Todo] === filterValue
        }
        // ignore the field if it's not in the todo object
        return true
      })
    },
    allTodos
  )
}

async function clearCompletedTodos(): Promise<Array<Todo>> {
  const oldTodos = await getTodos()
  const deletedTodos = oldTodos.filter((todo) => todo.status === 'completed')
  const todos = oldTodos.filter((todo) => todo.status !== 'completed')
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  return Promise.resolve(deletedTodos)
}

type MoveTodoProps = {
  fromId: Todo['id']
  toId: Todo['id']
}

async function moveTodo({ fromId, toId }: MoveTodoProps): Promise<Array<Todo>> {
  const oldTodos = await getTodos()
  const fromIndex = oldTodos.findIndex((todo) => todo.id === fromId)
  const toIndex = oldTodos.findIndex((todo) => todo.id === toId)

  const todos = arrayMove(oldTodos, fromIndex, toIndex)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  return Promise.resolve(todos)
}

export { getTodos, clearCompletedTodos, moveTodo, client }
