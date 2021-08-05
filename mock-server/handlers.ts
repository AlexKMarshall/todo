import { Todo, TodoFilters } from '@features/todos/schemas'
import { rest } from 'msw'
import * as todoModel from './todo.model'
// import { create, deleteOne, deleteMany, find, move, update } from './todo.model'

type TError = { error: any }
type TResponse<TData> = TData | TError

export const handlers = [
  rest.get<undefined, TResponse<{ todos: Array<Todo> }>>(
    '/api/todos',
    async (req, res, ctx) => {
      const { searchParams } = req.url
      const filters = Object.fromEntries(searchParams) as TodoFilters

      try {
        const todos = await todoModel.find(filters)
        return res(ctx.status(200), ctx.json({ todos }))
      } catch (error) {
        return res(ctx.status(500), ctx.json({ error }))
      }
    }
  ),
  rest.post<{ todo: Todo }, TResponse<{ todo: Todo }>>(
    '/api/todos',
    async (req, res, ctx) => {
      const { todo } = req.body

      try {
        const savedTodo = await todoModel.create(todo)
        return res(ctx.status(201), ctx.json({ todo: savedTodo }))
      } catch (error) {
        return res(ctx.status(500), ctx.json({ error }))
      }
    }
  ),
  rest.put<{ todo: Todo }, TResponse<{ todo: Todo }>, { todoId: Todo['id'] }>(
    '/api/todos/:todoId',
    async (req, res, ctx) => {
      const { todo } = req.body

      try {
        const updatedTodo = await todoModel.update(todo)
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
  >('/api/todos/:todoId/move', async (req, res, ctx) => {
    const { todoId: fromId } = req.params
    const { toId } = req.body

    try {
      const todos = await todoModel.move({ fromId, toId })
      return res(ctx.status(200), ctx.json({ todos }))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error }))
    }
  }),
  rest.delete<undefined, TResponse<{ todo: Todo }>, { todoId: string }>(
    '/api/todos/:todoId',
    async (req, res, ctx) => {
      const { todoId } = req.params

      try {
        const deletedTodo = await todoModel.deleteOne(todoId)
        return res(ctx.status(200), ctx.json({ todo: deletedTodo }))
      } catch (error) {
        return res(ctx.status(500), ctx.json({ error }))
      }
    }
  ),
  rest.delete<undefined, TResponse<{ todos: Array<Todo> }>>(
    '/api/todos',
    async (req, res, ctx) => {
      const { searchParams } = req.url
      const filters = Object.fromEntries(searchParams) as TodoFilters

      try {
        const deletedTodos = await todoModel.deleteMany(filters)
        return res(ctx.status(200), ctx.json({ todos: deletedTodos }))
      } catch (error) {
        return res(ctx.status(500), ctx.json({ error }))
      }
    }
  ),
]
