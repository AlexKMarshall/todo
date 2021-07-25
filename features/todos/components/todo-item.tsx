import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { DeleteButton } from '@components/delete-button'
import styles from '../todos.module.scss'
import { Todo } from 'types/todo'
import { useDeleteTodo, useToggleTodoComplete } from '../queries'
import { Checkbox } from '@components/checkbox/checkbox'
import { useTheme } from '@context/theme'

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
      transition: null,
    })

  const { theme } = useTheme()

  const outlineColor =
    theme === 'light' ? 'hsla(233, 11%, 84%, 100%)' : 'hsla(234, 11%, 52%)'
  const shadowColor =
    theme === 'light' ? 'hsla(236, 9%, 61%, 30%)' : 'hsla(0, 0%, 0%, 40%)'

  const initialStyles = {
    x: 0,
    y: 0,
    scale: 1,
  }

  return (
    <motion.li
      className={styles.todoItem}
      layoutId={todo.id}
      animate={
        transform
          ? {
              x: transform.x,
              y: transform.y,
              scale: isDragging ? 1.05 : 1,
              zIndex: isDragging ? 1 : 0,
              boxShadow: isDragging
                ? `0 0 0 1px ${outlineColor}, 0px 15px 15px 0 ${shadowColor}`
                : `0 0 0 0 ${outlineColor}, 0 0 0 0 ${shadowColor}`,
            }
          : initialStyles
      }
      transition={{
        duration: !isDragging ? 0.25 : 0,
        easings: { type: 'spring' },
        scale: {
          duration: 0.25,
        },
        zIndex: {
          delay: isDragging ? 0 : 0.25,
        },
      }}
    >
      <div ref={setNodeRef} {...attributes} {...listeners}>
        <motion.span
          className={styles.todoClipInWrapper}
          // initial={{ y: '120%' }}
          // animate={{ y: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
