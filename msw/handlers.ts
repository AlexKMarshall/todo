import { Todo, TodoFilters } from '@features/todos/schemas'
import { rest } from 'msw'
import {
  createTodo,
  deleteOneTodo,
  deleteTodos,
  getTodos,
  moveTodo,
  updateTodo,
} from './todo.local-storage.model'

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
  rest.put<{ todo: Todo }, TResponse<{ todo: Todo }>, { todoId: Todo['id'] }>(
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
  rest.put<
    { toId: Todo['id'] },
    TResponse<{ todos: Array<Todo> }>,
    { todoId: Todo['id'] }
  >('/api/todos/:todoId/move', (req, res, ctx) => {
    const { todoId: fromId } = req.params
    const { toId } = req.body

    try {
      const todos = moveTodo({ fromId, toId })
      return res(ctx.status(200), ctx.json({ todos }))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error }))
    }
  }),
  rest.delete<undefined, TResponse<{ todo: Todo }>, { todoId: string }>(
    '/api/todos/:todoId',
    (req, res, ctx) => {
      const { todoId } = req.params

      try {
        const deletedTodo = deleteOneTodo(todoId)
        return res(ctx.status(200), ctx.json({ todo: deletedTodo }))
      } catch (error) {
        return res(ctx.status(500), ctx.json({ error }))
      }
    }
  ),
  rest.delete<undefined, TResponse<{ todos: Array<Todo> }>>(
    '/api/todos',
    (req, res, ctx) => {
      const { searchParams } = req.url
      const filters = Object.fromEntries(searchParams) as TodoFilters

      try {
        const deletedTodos = deleteTodos(filters)
        return res(ctx.status(200), ctx.json({ todos: deletedTodos }))
      } catch (error) {
        return res(ctx.status(500), ctx.json({ error }))
      }
    }
  ),
]
