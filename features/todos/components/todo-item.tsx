import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { DeleteButton } from '@components/delete-button'
import { CSS } from '@dnd-kit/utilities'
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

  const { setNodeRef, attributes, listeners, transform, isDragging } =
    useSortable({
      id: todo.id,
    })

  return (
    <motion.li
      className={styles.todoItem}
      layout
      animate={{ y: transform?.y }}
      style={{
        zIndex: isDragging ? 1 : undefined,
      }}
    >
      <div ref={setNodeRef} {...attributes} {...listeners}>
        <motion.span
          className={styles.todoClipInWrapper}
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
      </div>
    </motion.li>
  )
}
