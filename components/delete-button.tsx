import styled from 'styled-components'
import { WithRequired } from 'utils'
import { IconButton } from '@components/icon-button'
import { CrossIcon } from '@icons/cross-icon'

type Props = WithRequired<
  React.ComponentPropsWithoutRef<typeof IconButton>,
  'onClick'
>

export function DeleteButton(props: Props) {
  return (
    <ButtonWrapper {...props}>
      <CrossIcon />
    </ButtonWrapper>
  )
}

const ButtonWrapper = styled(IconButton)`
  --spacing: var(--s-1);
  padding: var(--spacing);
  margin: calc(-1 * var(---spacing));
`
