import { useQuery } from 'react-query'
import { getTodos } from 'services/client'
import styles from './active-todos-count.module.scss'

export function ActiveTodosCount() {
  const activeFilter = { status: 'active' } as const
  const activeTodosCountQuery = useQuery(
    ['todos', activeFilter],
    () => getTodos(activeFilter),
    { select: (todos) => todos.length }
  )

  if (!activeTodosCountQuery.isSuccess) return null

  const itemsLeftText = `${activeTodosCountQuery.data} item${
    activeTodosCountQuery.data !== 1 ? 's' : ''
  } left`

  return <div className={styles.itemsCount}>{itemsLeftText}</div>
}
