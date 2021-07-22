import {
  clearCompletedTodos,
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from '@services/client'
import { Todo, TodoFilters } from '@types/todo'
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

type UseTodosProps = {
  filters?: TodoFilters
}

export function useTodos({ filters = {} }: UseTodosProps = {}) {
  return useQuery(todoKeys.list(filters), () => getTodos(filters))
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
