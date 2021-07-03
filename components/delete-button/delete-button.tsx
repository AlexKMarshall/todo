import { CrossIcon } from '@icons/cross-icon'
import styles from './delete-button.module.scss'

type ButtonProps = React.ComponentPropsWithoutRef<'button'>

type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

type WithoutClassName<T extends {}> = Omit<T, 'className'>

type Props = WithoutClassName<
  WithRequired<ButtonProps, 'aria-label' | 'onClick'>
>

export function DeleteButton(props: Props) {
  return (
    <button type="button" {...props} className={styles.deleteTodoButton}>
      <CrossIcon className={styles.deleteTodoIcon} />
    </button>
  )
}
