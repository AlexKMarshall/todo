type Props = {
  className?: string
  'aria-hidden'?: boolean
}

export function CheckIcon(props: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11" {...props}>
      <defs />
      <path fill="none" strokeWidth="2" d="M1 4.304L3.696 7l6-6" />
    </svg>
  )
}
