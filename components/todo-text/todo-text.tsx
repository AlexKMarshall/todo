import { CheckIcon } from '@icons/check-icon'
import { Todo } from 'types/todo'
import styles from './todo-text.module.scss'

type Props = {
  todo: Todo
  onToggleCompleted: () => void
}
export function TodoText({ todo, onToggleCompleted }: Props) {
  return (
    <>
      <input
        type="checkbox"
        id={`todo-${todo.id}`}
        checked={todo.status === 'completed'}
        onChange={onToggleCompleted}
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
    </>
  )
}
