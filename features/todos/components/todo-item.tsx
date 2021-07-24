import { motion } from 'framer-motion'
import { DeleteButton } from '@components/delete-button'
import styles from '../todos.module.scss'
import { Todo } from 'types/todo'
import { useDeleteTodo, useToggleTodoComplete } from '../queries'
import { Checkbox } from '@components/checkbox/checkbox'

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
        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.status === 'completed'}
          onChange={() => toggleTodoCompleteMutation.mutate()}
          label={todo.title}
        />
        <DeleteButton
          aria-label={`delete ${todo.title}`}
          onClick={() => deleteTodoMutation.mutate()}
        />
      </motion.span>
    </motion.li>
  )
}
