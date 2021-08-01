import styles from '../todos.module.scss'
import { useTodos } from '../queries'

export function ActiveTodosCount() {
  const activeTodosCountQuery = useTodos({
    filters: { status: 'active' },
    select: (todos) => todos.length,
  })

  if (!activeTodosCountQuery.isSuccess) return null

  const itemsLeftText = `${activeTodosCountQuery.data} item${
    activeTodosCountQuery.data !== 1 ? 's' : ''
  } left`

  return <div className={styles.itemsCount}>{itemsLeftText}</div>
}
