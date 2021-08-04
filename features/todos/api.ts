import { client } from '@services/client'
import { Todo, TodoFilters } from './schemas'

const BASE_URL = '/api/todos'

function getTodos(filters: TodoFilters = {}): Promise<Array<Todo>> {
  const searchParams = new URLSearchParams(filters).toString()

  return client<{ todos: Array<Todo> }>(`${BASE_URL}?${searchParams}`).then(
    ({ todos }) => todos
  )
}

function postTodo(todo: Todo): Promise<Todo> {
  type TodoDTO = { todo: Todo }
  return client<TodoDTO, TodoDTO>(BASE_URL, { data: { todo } }).then(
    ({ todo }) => todo
  )
}

function updateTodo(todo: Todo): Promise<Todo> {
  type TodoDTO = { todo: Todo }
  return client<TodoDTO, TodoDTO>(`${BASE_URL}/${todo.id}`, {
    data: { todo },
    method: 'PUT',
  }).then(({ todo }) => todo)
}

export { getTodos, postTodo, updateTodo }
