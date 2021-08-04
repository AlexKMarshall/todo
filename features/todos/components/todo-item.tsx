import { motion } from 'framer-motion'
import { Transform } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { DeleteButton as DeleteButtonComponent } from '@components/delete-button'
import { Todo } from '../schemas'
import { useDeleteTodo, useToggleTodoComplete } from '../queries'
import { Checkbox } from '@components/checkbox'
import { useTheme } from '@context/theme'
import { forwardRef } from 'react'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import styled from 'styled-components'

type Props = {
  todo: Todo
  onDeleteTodo?: (todo: Todo) => void
  // Todo, extract from useSortable
  dragAttributes?: {
    role: string
    tabIndex: number
    'aria-pressed': boolean | undefined
    'aria-roledescription': string
    'aria-describedby': string
  }
  dragListeners?: DraggableSyntheticListeners
  dragTransform?: Transform | null
  isDragging?: boolean
  dragOverlay?: boolean
}

export const TodoItem = forwardRef<HTMLDivElement, Props>(function TodoItem(
  {
    todo,
    onDeleteTodo,
    dragAttributes,
    dragListeners,
    dragTransform,
    isDragging,
    dragOverlay,
  },
  ref
) {
  const toggleTodoCompleteMutation = useToggleTodoComplete({ todo })

  const deleteTodoMutation = useDeleteTodo({
    todo,
    onSuccess: () => {
      onDeleteTodo?.(todo)
    },
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
    <MotionLi
      layoutId={todo.id}
      style={{ boxShadow: `0 0 0 0 ${outlineColor}, 0 0 0 0 ${shadowColor}` }}
      animate={
        dragTransform
          ? {
              x: dragTransform.x,
              y: dragTransform.y,
              opacity: isDragging ? 0 : 1,
            }
          : {
              ...initialStyles,
              scale: dragOverlay ? 1.05 : 1,
              zIndex: dragOverlay ? 1 : 0,
              boxShadow: dragOverlay
                ? `0 0 0 1px ${outlineColor}, 0px 15px 15px 0 ${shadowColor}`
                : `0 0 0 0 ${outlineColor}, 0 0 0 0 ${shadowColor}`,
            }
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
      <DragHandle ref={ref} {...dragAttributes} {...dragListeners}>
        <FadeIn
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
        </FadeIn>
      </DragHandle>
    </MotionLi>
  )
})

type SortableTodoItemProps = {
  todo: Todo
  onDeleteTodo: (todo: Todo) => void
  id: string
}

export function SortableTodoItem({
  id,
  todo,
  onDeleteTodo,
}: SortableTodoItemProps) {
  const { setNodeRef, attributes, listeners, transform, isDragging } =
    useSortable({
      id,
      transition: null,
    })

  return (
    <TodoItem
      todo={todo}
      onDeleteTodo={onDeleteTodo}
      ref={setNodeRef}
      dragAttributes={attributes}
      dragListeners={listeners}
      dragTransform={transform}
      isDragging={isDragging}
    />
  )
}

const Li = styled.li`
  background-color: var(--main-background-color);
  overflow: hidden;
`

const MotionLi = motion(Li)

const DragHandle = styled.div`
  &:focus-visible {
    outline-offset: calc(-1 * var(--s-2));
  }
`
const FadeIn = motion(styled.div`
  display: flex;
  align-items: center;
  gap: var(--s1);
  padding-right: var(--s1);
`)

const DeleteButton = styled(DeleteButtonComponent)`
  @media (hover: hover) and (pointer: fine) {
    opacity: 0;
    transition: opacity 200ms ease-in-out;

    ${Li}:hover &,
    ${Li}:focus-within & {
      opacity: 1;
    }
  }
`
