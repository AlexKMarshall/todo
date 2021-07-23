import { InputHTMLAttributes } from 'react'
import { CheckIcon } from '@icons/check-icon'
import styles from './checkbox.module.scss'
import { VisuallyHidden } from '@components/visually-hidden'

type Props = {
  id: string
  checked: boolean
  onChange: InputHTMLAttributes<HTMLInputElement>['onChange']
  label: string
}

export function Checkbox({ id, checked, onChange, label }: Props) {
  return (
    <>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className={styles.checkboxInput}
      />
      <label htmlFor={id} className={styles.label}>
        <span className={styles.checkBorderWrap}>
          <span className={styles.check}>
            <CheckIcon aria-hidden className={styles.checkIcon} />
          </span>
        </span>
        <span className={styles.labelText}>{label}</span>
      </label>
    </>
  )
}
