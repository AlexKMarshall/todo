import { VisuallyHidden } from '@components/visually-hidden'
import styles from './text-input.module.scss'

type Props = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'className' | 'type'
> & {
  label: string
}

export function TextInput({ label, ...delegated }: Props) {
  return (
    <label className={styles.inputWrapper}>
      <VisuallyHidden>{label}</VisuallyHidden>
      <span className={styles.decorativeCircle} />
      <input type="text" className={styles.input} {...delegated} />
    </label>
  )
}
