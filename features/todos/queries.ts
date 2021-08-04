import { Todo, TodoFilters } from './schemas'
import {
  getTodos,
  postTodo,
  updateTodo,
  deleteTodo,
  clearCompletedTodos,
  moveTodo,
} from './api'
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from 'react-query'
import { arrayMove } from '@dnd-kit/sortable'

const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: TodoFilters = {}) => [...todoKeys.lists(), filters] as const,
}

type UseTodosProps<TData> = {
  filters?: TodoFilters
  select?: (todos: Array<Todo>) => TData
}

export function useTodos<TData = Array<Todo>>({
  filters = {},
  select,
}: UseTodosProps<TData> = {}) {
  return useQuery(todoKeys.list(filters), () => getTodos(filters), { select })
}

type UseCreateTodoProps = {
  onSuccess?: UseMutationOptions<Todo, unknown, Todo>['onSuccess']
}

export function useCreateTodo({ onSuccess }: UseCreateTodoProps = {}) {
  const queryClient = useQueryClient()

  return useMutation(
    (todo: Todo) => {
      return postTodo(todo)
    },
    {
      onMutate: async (newTodo: Todo) => {
        await queryClient.cancelQueries(todoKeys.lists())
        const previousTodos = queryClient.getQueryData<Array<Todo>>(
          todoKeys.list()
        )

        if (previousTodos) {
          queryClient.setQueryData<Array<Todo>>(todoKeys.list(), [
            newTodo,
            ...previousTodos,
          ])
        }

        return { previousTodos }
      },
      onSuccess: (...args) => {
        onSuccess?.(...args)
      },
      onError: (_err, _variables, context) => {
        if (context?.previousTodos) {
          queryClient.setQueryData<Array<Todo>>(
            todoKeys.list(),
            context.previousTodos
          )
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(todoKeys.lists())
      },
    }
  )
}

type UseClearCompletedTodosProps = {
  onSuccess?: UseMutationOptions<Array<Todo>>['onSuccess']
}

export function useClearCompletedTodos({
  onSuccess,
}: UseClearCompletedTodosProps = {}) {
  const queryClient = useQueryClient()

  return useMutation(clearCompletedTodos, {
    onMutate: async () => {
      await queryClient.cancelQueries(todoKeys.lists())
      const previousTodos = queryClient.getQueryData<Array<Todo>>(
        todoKeys.list()
      )

      if (previousTodos) {
        queryClient.setQueryData<Array<Todo>>(
          todoKeys.list(),
          previousTodos.filter((todo) => todo.status !== 'completed')
        )
      }

      return { previousTodos }
    },
    onSuccess: (...args) => {
      onSuccess?.(...args)
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData<Array<Todo>>(
          todoKeys.list(),
          context.previousTodos
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(todoKeys.lists())
    },
  })
}

type UseToggleTodoCompleteProps = {
  todo: Todo
}

export function useToggleTodoComplete({ todo }: UseToggleTodoCompleteProps) {
  const queryClient = useQueryClient()
  const updatedTodo = {
    ...todo,
    status:
      todo.status === 'active' ? ('completed' as const) : ('active' as const),
  }
  return useMutation(
    () => {
      return updateTodo(updatedTodo)
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(todoKeys.lists())
        const previousTodos = queryClient.getQueryData<Array<Todo>>(
          todoKeys.list()
        )

        if (previousTodos) {
          queryClient.setQueryData<Array<Todo>>(
            todoKeys.list(),
            previousTodos.map((todo) =>
              todo.id === updatedTodo.id ? updatedTodo : todo
            )
          )
        }

        return { previousTodos }
      },
      onError: (_err, _variables, context) => {
        if (context?.previousTodos) {
          queryClient.setQueryData<Array<Todo>>(
            todoKeys.list(),
            context.previousTodos
          )
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(todoKeys.lists())
      },
    }
  )
}

export function useMoveTodoMutation() {
  const queryClient = useQueryClient()

  type MoveTodoVariables = {
    fromId: Todo['id']
    toId: Todo['id']
  }

  return useMutation(
    ({ fromId, toId }: MoveTodoVariables) => moveTodo({ fromId, toId }),
    {
      onMutate: async ({ fromId, toId }: MoveTodoVariables) => {
        await queryClient.cancelQueries(todoKeys.lists())
        const previousTodos = queryClient.getQueryData<Array<Todo>>(
          todoKeys.list()
        )

        if (previousTodos) {
          const fromIndex = previousTodos.findIndex((t) => t.id === fromId)
          const toIndex = previousTodos.findIndex((t) => t.id === toId)
          if (fromIndex === toIndex || fromIndex === -1 || toIndex === -1)
            return { previousTodos }

          const reorderedTodos = arrayMove(previousTodos, fromIndex, toIndex)

          queryClient.setQueryData<Array<Todo>>(todoKeys.list(), reorderedTodos)
        }

        return { previousTodos }
      },
      onError: (_err, _variables, context) => {
        if (context?.previousTodos) {
          queryClient.setQueryData<Array<Todo>>(
            todoKeys.list(),
            context.previousTodos
          )
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(todoKeys.lists())
      },
    }
  )
}

type UseDeleteTodoProps = {
  todo: Todo
  onSuccess?: UseMutationOptions<Todo>['onSuccess']
}

export function useDeleteTodo({ todo, onSuccess }: UseDeleteTodoProps) {
  const queryClient = useQueryClient()

  return useMutation(() => deleteTodo(todo.id), {
    onMutate: async () => {
      await queryClient.cancelQueries(todoKeys.lists())
      const previousTodos = queryClient.getQueryData<Array<Todo>>(
        todoKeys.list()
      )

      if (previousTodos) {
        queryClient.setQueryData<Array<Todo>>(
          todoKeys.list(),
          previousTodos.filter((t) => t.id !== todo.id)
        )
      }

      return { previousTodos }
    },

    onSuccess: (...args) => {
      onSuccess?.(...args)
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData<Array<Todo>>(
          todoKeys.list(),
          context.previousTodos
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(todoKeys.lists())
    },
  })
}
