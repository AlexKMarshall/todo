import { Todo } from 'types/todo'
const STORAGE_KEY = 'todo-app-todos'

function getTodos(): Promise<Array<Todo>> {
  const serializedTodos = window.localStorage.getItem(STORAGE_KEY)
  if (!serializedTodos) return Promise.resolve([])
  try {
    const todos = JSON.parse(serializedTodos) as Array<Todo>
    return Promise.resolve(todos)
  } catch (e) {
    return Promise.resolve([])
  }
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

export { getTodos, createTodo, updateTodo, deleteTodo }
