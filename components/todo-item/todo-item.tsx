import { motion } from 'framer-motion'
import { useMutation, useQueryClient } from 'react-query'
import { TodoText } from '@components/todo-text'
import { DeleteButton } from '@components/delete-button'
import { deleteTodo, updateTodo } from '@services/client'
import styles from './todo-item.module.scss'
import { Todo } from 'types/todo'

type Props = {
  todo: Todo
  onDeleteTodo: (todo: Todo) => void
}

export function TodoItem({ todo, onDeleteTodo }: Props) {
  const queryClient = useQueryClient()

  const toggleTodoCompleteMutation = useMutation(
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
        queryClient.invalidateQueries(['todos'])
      },
    }
  )

  const deleteTodoMutation = useMutation(() => deleteTodo(todo.id), {
    onSuccess: () => {
      onDeleteTodo(todo)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['todos'])
    },
  })

  return (
    <motion.li
      className={styles.todoItem}
      layout
      onTap={(...args) => console.log('tapped', ...args)}
      onDrag={(...args) => console.log('dragging', ...args)}
    >
      <motion.span
        initial={{ y: '120%' }}
        animate={{ y: 0 }}
        exit={{ opacity: 0 }}
      >
        <TodoText
          todo={todo}
          onToggleCompleted={toggleTodoCompleteMutation.mutate}
        />
        <DeleteButton
          aria-label={`delete ${todo.title}`}
          onClick={() => deleteTodoMutation.mutate()}
        />
      </motion.span>
    </motion.li>
  )
}
