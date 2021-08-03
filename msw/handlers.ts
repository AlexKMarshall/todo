import { Todo } from '@features/todos/schemas'
import { rest } from 'msw'
const STORAGE_KEY = 'todo-app-todos'

export const handlers = [
  rest.get('/api/todos', (_req, res, ctx) => {
    const serializedTodos = window.localStorage.getItem(STORAGE_KEY)

    if (!serializedTodos) {
      const todos: Array<Todo> = []
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
      return res(ctx.status(200), ctx.json({ todos }))
    }

    try {
      const todos = JSON.parse(serializedTodos) as Array<Todo>
      return res(ctx.status(200), ctx.json({ todos }))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error }))
    }
  }),
]
