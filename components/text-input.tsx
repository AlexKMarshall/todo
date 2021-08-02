import { VisuallyHidden } from '@components/visually-hidden'
import styled from 'styled-components'

type Props = React.ComponentPropsWithoutRef<'input'> & {
  label: string
}

export function TextInput({ label, className, ...delegated }: Props) {
  return (
    <Wrapper className={className}>
      <VisuallyHidden>{label}</VisuallyHidden>
      <DecorativeCircle />
      <Input type="text" {...delegated} />
    </Wrapper>
  )
}

const Wrapper = styled.label`
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
`

const DecorativeCircle = styled.span`
  position: absolute;
  left: var(--s1);
  --border-width: calc(max(0.125rem, 2px));
  width: var(--s0);
  height: var(--s0);
  border: var(--border-width) solid var(--very-muted-text-color);
  border-radius: 50%;
`

const Input = styled.input`
  width: 0;
  flex: 1;
  padding-top: var(--s0);
  padding-right: var(--s1);
  padding-bottom: var(--s0);
  padding-left: calc(2 * var(--s1) + var(--s0));
  border: none;
  outline-color: transparent;
  outline-style: solid;
  background: none;

  &:focus-visible {
    outline: 5px auto;
  }
`
