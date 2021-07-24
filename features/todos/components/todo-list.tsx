import { AnimatePresence, motion } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { TodoItem } from './todo-item'
import { Todo, TodoFilters } from '../schemas'
import { useMoveTodoMutation, useTodos } from '../queries'
import styles from '../todos.module.scss'

type Props = {
  onDeleteTodo: (todo: Todo) => void
  filters?: TodoFilters
}

function getEmptyListText(filters: TodoFilters) {
  if (filters.status === 'active') return 'You have no active todos'
  if (filters.status === 'completed') return 'You have no completed todos'
  return 'You have no todos. Add some more?'
}

export function TodoList({ onDeleteTodo, filters = {} }: Props) {
  const todoQuery = useTodos({ filters })
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const moveTodoMutation = useMoveTodoMutation()

  if (todoQuery.isLoading || todoQuery.isIdle) return <div>Loading...</div>

  if (todoQuery.isError)
    return (
      <div>
        Something went wrong{' '}
        <pre>{JSON.stringify(todoQuery.error, null, 2)}</pre>
      </div>
    )

  const isListEmpty = todoQuery.data.length === 0

  if (isListEmpty)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={styles.emptyMessage}
      >
        <p>{getEmptyListText(filters)}</p>
      </motion.div>
    )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    moveTodoMutation.mutate({ fromId: active.id, toId: over.id })
  }

  return (
    <ol role="list" className={styles.todoList}>
      <AnimatePresence>
        <DndContext
          onDragEnd={handleDragEnd}
          sensors={sensors}
          collisionDetection={closestCenter}
        >
          <SortableContext
            items={todoQuery.data}
            strategy={verticalListSortingStrategy}
          >
            {todoQuery.data.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onDeleteTodo={onDeleteTodo} />
            ))}
          </SortableContext>
        </DndContext>
      </AnimatePresence>
    </ol>
  )
}
