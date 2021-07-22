import { motion } from 'framer-motion'
import { CheckIcon } from '@icons/check-icon'
import { DeleteButton } from '@components/delete-button'
import styles from './todos.module.scss'
import { Todo } from 'types/todo'
import { useDeleteTodo, useToggleTodoComplete } from './queries'

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
        <input
          type="checkbox"
          id={`todo-${todo.id}`}
          checked={todo.status === 'completed'}
          onChange={() => toggleTodoCompleteMutation.mutate()}
          className={styles.todoCompletedCheckboxInput}
        />
        <label htmlFor={`todo-${todo.id}`} className={styles.todoItemLabel}>
          <span className={styles.todoItemCheckBorderWrap}>
            <span className={styles.todoItemCheck}>
              <CheckIcon aria-hidden className={styles.checkIcon} />
            </span>
          </span>
          <span className={styles.todoItemText}>{todo.title}</span>
        </label>
        <DeleteButton
          aria-label={`delete ${todo.title}`}
          onClick={() => deleteTodoMutation.mutate()}
        />
      </motion.span>
    </motion.li>
  )
}
