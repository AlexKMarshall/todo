import { arrayMove } from '@dnd-kit/sortable'
import { Todo, TodoFilters } from '@features/todos/schemas'

const STORAGE_KEY = 'todo-app-todos'

type TodoStore = {
  order: Array<Todo['id']>
  items: {
    [id: string]: Todo
  }
}

const todoStore: TodoStore = { order: [], items: {} }

function persist() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todoStore))
}
function load() {
  const serializedTodoStore = window.localStorage.getItem(STORAGE_KEY)
  if (!serializedTodoStore) {
    return
  }
  Object.assign(todoStore, JSON.parse(serializedTodoStore))
}

try {
  load()
} catch (_e) {
  persist()
}

async function findAll(): Promise<Array<Todo>> {
  try {
    load()
    return todoStore.order
      .map((todoId) => todoStore.items[todoId])
      .filter((todo) => todo)
  } catch (error) {
    return Promise.reject({ error })
  }
}

function find(filters: TodoFilters = {}): Promise<Array<Todo>> {
  return findAll().then((allTodos) =>
    allTodos.filter((todo) =>
      Object.entries(filters).every(([filterField, filterValue]) => {
        if (filterField in todo) {
          // we've checked that field is in our object, so the type assertion is safe
          return todo[filterField as keyof Todo] === filterValue
        }
        // ignore the field if it's not in the todo object
        return true
      })
    )
  )
}

async function create(newTodo: Todo): Promise<Todo> {
  todoStore.items[newTodo.id] = newTodo
  todoStore.order = [newTodo.id, ...todoStore.order]
  persist()
  return newTodo
}

async function update(updatedTodo: Todo): Promise<Todo> {
  todoStore.items[updatedTodo.id] = updatedTodo
  persist()
  return updatedTodo
}

async function deleteOne(deletedTodoId: Todo['id']): Promise<Todo> {
  const deletedTodo = todoStore.items[deletedTodoId]
  if (!deletedTodo) throw new Error(`No Todo found with id ${deletedTodoId}`)

  todoStore.order = todoStore.order.filter((id) => id !== deletedTodoId)
  delete todoStore.items[deletedTodoId]

  persist()
  return deletedTodo
}

async function deleteMany(filters: TodoFilters = {}): Promise<Array<Todo>> {
  const idsToDelete: Array<Todo['id']> = []
  const idsToKeep: Array<Todo['id']> = []

  for (const id of todoStore.order) {
    const todo = todoStore.items[id]
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
      idsToDelete.push(id)
    } else {
      idsToKeep.push(id)
    }
  }

  const deletedTodos: Array<Todo> = []
  idsToDelete.forEach((id) => {
    deletedTodos.push(todoStore.items['id'])
    delete todoStore.items['id']
  })

  todoStore.order = idsToKeep

  persist()
  return deletedTodos
}

type MoveTodoProps = {
  fromId: Todo['id']
  toId: Todo['id']
}

async function move({ fromId, toId }: MoveTodoProps): Promise<Array<Todo>> {
  const fromIndex = todoStore.order.findIndex((id) => id === fromId)
  const toIndex = todoStore.order.findIndex((id) => id === toId)

  todoStore.order = arrayMove(todoStore.order, fromIndex, toIndex)

  persist()
  return find()
}

async function initialise(todos: Array<Todo> = []) {
  todoStore.order = todos.map((todo) => todo.id)
  todoStore.items = todos.reduce((items, todo) => {
    items[todo.id] = todo
    return items
  }, {} as typeof todoStore['items'])
  persist()
}

export {
  find,
  create,
  update,
  deleteOne,
  deleteMany,
  move,
  initialise,
  todoStore,
}
