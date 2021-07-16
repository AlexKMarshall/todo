import { z } from 'zod'
import { Todo } from 'types/todo'
const STORAGE_KEY = 'todo-app-todos'

export const filtersSchema = z.object({
  status: z.enum(['active', 'completed']).optional(),
})

type Filters = z.infer<typeof filtersSchema>

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

async function getTodos(filters: Filters = {}): Promise<Array<Todo>> {
  const allTodos = await getAllTodos()

  return allTodos.filter((todo) => {
    switch (filters.status) {
      case 'active':
        return todo.completed === false
      case 'completed':
        return todo.completed === true
      default:
        return true
    }
  })
}

async function createTodo(newTodo: Todo): Promise<Todo> {
  const oldTodos = await getTodos()
  const todos = [newTodo, ...oldTodos]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  return Promise.resolve(newTodo)
}

async function updateTodo(updatedTodo: Todo): Promise<Todo> {
  const oldTodos = await getTodos()
  const todos = oldTodos.map((todo) =>
    todo.id === updatedTodo.id ? updatedTodo : todo
  )
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  return Promise.resolve(updatedTodo)
}

async function deleteTodo(deletedTodoId: Todo['id']): Promise<Todo> {
  const oldTodos = await getTodos()
  const deletedTodo = oldTodos.find((todo) => todo.id === deletedTodoId)
  if (!deletedTodo) throw new Error(`No Todo found with id ${deletedTodoId}`)

  const todos = oldTodos.filter((todo) => todo.id !== deletedTodoId)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  return Promise.resolve(deletedTodo)
}

async function clearCompletedTodos(): Promise<Array<Todo>> {
  const oldTodos = await getTodos()
  const deletedTodos = oldTodos.filter((todo) => todo.completed)
  const todos = oldTodos.filter((todo) => !todo.completed)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  return Promise.resolve(deletedTodos)
}

export { getTodos, createTodo, updateTodo, deleteTodo, clearCompletedTodos }
