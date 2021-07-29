import styles from '../todos.module.scss'
import { useActiveTodosCount } from '../queries'

export function ActiveTodosCount() {
  const activeTodosCountQuery = useActiveTodosCount()

  if (!activeTodosCountQuery.isSuccess) return null

  const itemsLeftText = `${activeTodosCountQuery.data} item${
    activeTodosCountQuery.data !== 1 ? 's' : ''
  } left`

  return <div className={styles.itemsCount}>{itemsLeftText}</div>
}
