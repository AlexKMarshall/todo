import { Todo, TodoFilters } from '@features/todos/schemas'

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

function deleteOneTodo(deletedTodoId: Todo['id']): Todo {
  const oldTodos = getTodos()
  const deletedTodo = oldTodos.find((todo) => todo.id === deletedTodoId)
  if (!deletedTodo) throw new Error(`No Todo found with id ${deletedTodoId}`)

  const todos = oldTodos.filter((todo) => todo.id !== deletedTodoId)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  return deletedTodo
}

function deleteTodos(filters: TodoFilters = {}): Array<Todo> {
  const allTodos = getTodos()
  const deletedTodos: Todo[] = []
  const remainingTodos: Todo[] = []

  for (const todo of allTodos) {
    const matchesFilter = Object.entries(filters).every(
      ([filterField, filterValue]) => {
        if (filterField in todo) {
          // we've checked that field is in our object, so the type assertion is safe
          return todo[filterField as keyof Todo] === filterValue
        }
        // ignore the field if it's not in the todo object
        return true
      }
    )

    if (matchesFilter) {
      deletedTodos.push(todo)
    } else {
      remainingTodos.push(todo)
    }
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remainingTodos))
  return deletedTodos
}

export { getTodos, createTodo, updateTodo, deleteOneTodo, deleteTodos }
