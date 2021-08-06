import styled from 'styled-components'
import { pluralise } from '../../utils'
import { useNotification } from '@context/notification'
import { Todo, TodoFilters } from './schemas'
import { Link } from '@components/link'
import { useClearCompletedTodos, useTodos } from './queries'
import {
  CreateTodoForm as CreateTodoFormComponent,
  TodoList as TodoListComponent,
} from './components'
import { AnimatePresence } from 'framer-motion'

type Props = {
  onDeleteTodo?: (todo: Todo) => void
  filters?: TodoFilters
}

export function Todos({ onDeleteTodo = () => {}, filters = {} }: Props) {
  const { setNotificationMessage } = useNotification()

  function handleDeleteTodo(todo: Todo) {
    setNotificationMessage(`${todo.title} deleted`)
    onDeleteTodo(todo)
  }

  const clearCompletedTodosMutation = useClearCompletedTodos({
    onSuccess: () => {
      setNotificationMessage('Completed todos cleared')
    },
  })

  const activeTodosLeft = useActiveTodosLeft()
  const shouldShowClearCompleted = useShouldShowClearCompleted()

  return (
    <AppContent>
      <CreateTodoForm
        onCreateTodo={(todo) => setNotificationMessage(`${todo.title} added`)}
      />
      <BackgroundShadow />
      <TodoList onDeleteTodo={handleDeleteTodo} filters={filters} />
      <ItemsCount>{activeTodosLeft}</ItemsCount>
      <FilterLinks>
        <Link href={`/todos`}>All</Link>
        <Link href={`/todos?status=active`}>Active</Link>
        <Link href="/todos?status=completed">Completed</Link>
      </FilterLinks>
      <ClearCompleted>
        <AnimatePresence>
          {shouldShowClearCompleted ? (
            <Link onClick={() => clearCompletedTodosMutation.mutate()}>
              Clear Completed
            </Link>
          ) : null}
        </AnimatePresence>
      </ClearCompleted>
    </AppContent>
  )
}

function useActiveTodosLeft() {
  const activeTodosCountQuery = useTodos({
    filters: { status: 'active' },
    select: (todos) => todos.length,
  })

  if (!activeTodosCountQuery.isSuccess) return null

  const count = activeTodosCountQuery.data

  return `${count} ${pluralise('item', count)} left`
}

function useShouldShowClearCompleted() {
  const countCompletedTodosQuery = useTodos({
    filters: { status: 'completed' },
    select: (todos) => todos.length,
  })

  return countCompletedTodosQuery.isSuccess && countCompletedTodosQuery.data > 0
}

const AppContent = styled.div`
  --gutter: var(--s1);
  flex: 1;
  height: 0; /* otherwise 1fr grid row doesn't grow in chrome,
  but this seems to mean the height doesn't respect the content when it overflows and so we don't get the bottom margin*/
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr auto auto;
  grid-template-areas:
    'input input'
    'list list'
    'count clear'
    'filters filters';

  @media (min-width: 800px) {
    grid-template-columns: minmax(max-content, 1fr) auto minmax(
        max-content,
        1fr
      );
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      'input input input'
      'list list list'
      'count filters clear';
  }

  & > * {
    background-color: var(--main-background-color);
  }
`

const CreateTodoForm = styled(CreateTodoFormComponent)`
  grid-area: input;
`
const TodoList = styled(TodoListComponent)`
  grid-area: list;
`

const BackgroundShadow = styled.div`
  grid-row: 2 / 4;
  grid-column: 1 / -1;
  border-radius: var(--border-radius);

  box-shadow: 0 0 30px 0px var(--shadow-color);
  z-index: -1;

  position: relative;
`

const ItemsCount = styled.div`
  grid-area: count;
  border-bottom-left-radius: 4px;
  padding: var(--s0) var(--s1);
  font-size: max(var(--s-1), 15px);
  color: var(--muted-text-color);
`

const FilterLinks = styled.div`
  grid-area: filters;
  margin-top: var(--gutter);
  padding: var(--s0) var(--s1);
  border-radius: var(--border-radius);
  display: flex;
  gap: var(--s0);
  justify-content: center;
  font-size: max(var(--s-1), 15px);
  font-weight: 700;

  box-shadow: 0 0 30px 0px var(--shadow-color);

  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 20%;
    bottom: 0;
    left: 20%;
    box-shadow: 0 0 50px 10px var(--shadow-color);
    z-index: -1;
  }

  @media (min-width: 800px) {
    margin-top: 0;
    box-shadow: none;
    &::before {
      content: none;
    }
  }
`

const ClearCompleted = styled.div`
  grid-area: clear;
  display: flex;
  justify-content: flex-end;
  padding: var(--s0) var(--s1);
  border-bottom-right-radius: var(--border-radius);
  font-size: max(var(--s-1), 15px);
  color: var(--muted-text-color);
`
