import { Todo, TodoFilters } from '@features/todos/schemas'
import { rest } from 'msw'
const STORAGE_KEY = 'todo-app-todos'

function getAllTodos(): Array<Todo> {
  const serializedTodos = window.localStorage.getItem(STORAGE_KEY)
  if (!serializedTodos) return []
  return JSON.parse(serializedTodos) as Array<Todo>
}

function getTodos(filters: TodoFilters = {}): Array<Todo> {
  const allTodos = getAllTodos()

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

function createTodo(newTodo: Todo): Todo {
  const oldTodos = getTodos()
  const todos = [newTodo, ...oldTodos]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  return newTodo
}

function updateTodo(updatedTodo: Todo): Todo {
  const oldTodos = getTodos()
  const todos = oldTodos.map((todo) =>
    todo.id === updatedTodo.id ? updatedTodo : todo
  )
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  return updatedTodo
}

type TError = { error: any }
type TResponse<TData> = TData | TError

export const handlers = [
  rest.get<undefined, TResponse<{ todos: Array<Todo> }>>(
    '/api/todos',
    (req, res, ctx) => {
      const { searchParams } = req.url
      const filters = Object.fromEntries(searchParams) as TodoFilters

      try {
        const todos = getTodos(filters)
        return res(ctx.status(200), ctx.json({ todos }))
      } catch (error) {
        return res(ctx.status(500), ctx.json({ error }))
      }
    }
  ),
  rest.post<{ todo: Todo }, TResponse<{ todo: Todo }>>(
    '/api/todos',
    (req, res, ctx) => {
      const { todo } = req.body

      try {
        const savedTodo = createTodo(todo)
        return res(ctx.status(201), ctx.json({ todo: savedTodo }))
      } catch (error) {
        return res(ctx.status(500), ctx.json({ error }))
      }
    }
  ),
  rest.put<{ todo: Todo }, TResponse<{ todo: Todo }>, { todoId: string }>(
    '/api/todos/:todoId',
    (req, res, ctx) => {
      const { todo } = req.body

      try {
        const updatedTodo = updateTodo(todo)
        return res(ctx.status(200), ctx.json({ todo: updatedTodo }))
      } catch (error) {
        return res(ctx.status(500), ctx.json({ error }))
      }
    }
  ),
]
