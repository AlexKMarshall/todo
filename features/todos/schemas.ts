import { z } from 'zod'

export const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['active', 'completed']),
})

export type Todo = z.infer<typeof todoSchema>

export const todoFiltersSchema = todoSchema.partial()

export type TodoFilters = z.infer<typeof todoFiltersSchema>
