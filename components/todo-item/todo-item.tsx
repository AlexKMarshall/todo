import { motion } from 'framer-motion'
import { TodoText } from '@components/todo-text'
import { DeleteButton } from '@components/delete-button'
import styles from './todo-item.module.scss'
import { Todo } from 'types/todo'
import {
  useDeleteTodo,
  useToggleTodoComplete,
} from '../../features/todos/queries'

type Props = {
  todo: Todo
  onDeleteTodo: (todo: Todo) => void
}

export function TodoItem({ todo, onDeleteTodo }: Props) {
  const toggleTodoCompleteMutation = useToggleTodoComplete({ todo })

  const deleteTodoMutation = useDeleteTodo({
    todo,
    onSuccess: () => {
      onDeleteTodo(todo)
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
