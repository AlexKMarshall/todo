import {
  clearCompletedTodos,
  createTodo,
  // getTodos,
  updateTodo,
  deleteTodo,
  moveTodo,
  client,
} from '@services/client'
import { Todo, TodoFilters } from './schemas'
import { getTodos } from './api'
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from 'react-query'

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
      return createTodo(todo)
    },
    {
      onSuccess: (...args) => {
        onSuccess?.(...args)
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
    onSuccess: (...args) => {
      onSuccess?.(...args)
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

  return useMutation(
    () => {
      const updatedTodo = {
        ...todo,
        status:
          todo.status === 'active'
            ? ('completed' as const)
            : ('active' as const),
      }
      return updateTodo(updatedTodo)
    },
    {
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
    onSuccess: (...args) => {
      onSuccess?.(...args)
    },
    onSettled: () => {
      queryClient.invalidateQueries(todoKeys.lists())
    },
  })
}
