import { client } from '@services/client'
import { Todo, TodoFilters } from './schemas'

const BASE_URL = '/api/todos'

function getTodos(filters: TodoFilters = {}): Promise<Array<Todo>> {
  const searchParams = new URLSearchParams(filters).toString()
  console.log({ searchParams })

  return client<{ todos: Array<Todo> }>(`${BASE_URL}?${searchParams}`).then(
    ({ todos }) => todos
  )
}

export { getTodos }
