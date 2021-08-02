import styled from 'styled-components'
import { WithRequired } from 'utils'
import { Button } from './button'

type Props = WithRequired<
  React.ComponentPropsWithoutRef<typeof Button>,
  'aria-label'
>

export function IconButton({ children, ...props }: Props) {
  return <IconButtonEl {...props}>{children}</IconButtonEl>
}

const IconButtonEl = styled(Button)`
  border-radius: 50%;
  padding: 0.35em;

  & svg {
    fill: currentColor;
    stroke: currentColor;
    width: 1em;
    height: 1em;
  }
`
