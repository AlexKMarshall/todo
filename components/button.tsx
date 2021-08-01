import styled from 'styled-components'

type Props = React.ComponentPropsWithoutRef<'button'>

export function Button(props: Props) {
  return <ButtonEl type="button" {...props} />
}

export const ButtonEl = styled.button`
  border: none;
  background-color: transparent;
  font-family: inherit;
  padding: 0;
  cursor: pointer;

  @media screen and (-ms-high-contrast: active) {
    border: 2px solid currentcolor;
  }

  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  color: var(--button-color, --muted-text-color);

  transition: 220ms ease-in-out;
  transition-property: color, box-shadow;
  outline-style: solid;
  outline-color: transparent;

  &:hover,
  &:active {
    color: var(--button-hover-color, --strong-text-color);
  }

  &:focus-visible {
    outline: 5px auto;
  }
`
