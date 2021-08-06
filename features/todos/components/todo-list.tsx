import styled from 'styled-components'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableTodoItem, TodoItem } from './todo-item'
import { Todo, TodoFilters } from '../schemas'
import { useMoveTodoMutation, useTodos } from '../queries'

type Props = {
  onDeleteTodo: (todo: Todo) => void
  filters?: TodoFilters
  className?: string
}

export function TodoList({ onDeleteTodo, filters = {}, className }: Props) {
  const todoQuery = useTodos({ filters })
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const moveTodoMutation = useMoveTodoMutation()
  const [draggingId, setDraggingId] = useState<string | null>(null)

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
      <EmptyMessage
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={className}
      >
        <p>{getEmptyListText(filters)}</p>
      </EmptyMessage>
    )

  function handleDragStart(event: DragStartEvent) {
    setDraggingId(event.active.id)
  }

  function handleDragEnd(event: DragEndEvent) {
    setDraggingId(null)
    const { active, over } = event

    if (!over || active.id === over.id) return

    moveTodoMutation.mutate({ fromId: active.id, toId: over.id })
  }

  const draggingTodo = todoQuery.data.find((t) => t.id === draggingId)

  return (
    <Ol role="list" className={className}>
      <AnimatePresence>
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          collisionDetection={closestCenter}
        >
          <SortableContext
            items={todoQuery.data}
            strategy={verticalListSortingStrategy}
          >
            {todoQuery.data.map((todo) => (
              <SortableTodoItem
                id={todo.id}
                key={todo.id}
                todo={todo}
                onDeleteTodo={onDeleteTodo}
              />
            ))}
          </SortableContext>
          <DragOverlay>
            {draggingTodo ? (
              <TodoItem todo={draggingTodo} isDragging={true} dragOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      </AnimatePresence>
    </Ol>
  )
}

function getEmptyListText(filters: TodoFilters) {
  if (filters.status === 'active') return 'You have no active todos'
  if (filters.status === 'completed') return 'You have no completed todos'
  return 'You have no todos. Add some more?'
}

const Ol = styled.ol`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  isolation: isolate;

  & > ::first-child {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  & > * {
    border-top: 1px hidden var(--divider-color);
    border-bottom: 1px solid var(--divider-color);
  }
`

const EmptyMessage = motion(styled.div`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: var(--s0) var(--s1);
  color: var(--muted-text-color);
`)
