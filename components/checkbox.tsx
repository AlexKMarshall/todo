import { InputHTMLAttributes } from 'react'
import { CheckIcon as CheckIconSVG } from '@icons/check-icon'
import { VisuallyHidden } from '@components/visually-hidden'
import styled from 'styled-components'

type Props = {
  id: string
  checked: boolean
  onChange: InputHTMLAttributes<HTMLInputElement>['onChange']
  label: string
}

export function Checkbox({ id, checked, onChange, label }: Props) {
  return (
    <>
      <CheckboxInput
        as="input"
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <Label htmlFor={id}>
        <CheckBorderWrap>
          <Check>
            <CheckIcon aria-hidden />
          </Check>
        </CheckBorderWrap>
        <LabelText>{label}</LabelText>
      </Label>
    </>
  )
}

const CheckboxInput = styled(VisuallyHidden)``

const Label = styled.label`
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: var(--s1);
  padding: var(--s0) var(--s1);
  outline-offset: calc(-1 * var(--s-2));
  isolation: isolate;
  cursor: pointer;

  ${CheckboxInput}:focus-visible + & {
    outline: 5px auto;
  }
`

const CheckBorderWrap = styled.span`
  --border-width: calc(max(0.125rem, 2px));
  position: relative;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: var(--border-width);
  border-radius: 50%;
  background: var(--very-muted-text-color);
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    opacity: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: var(--color-gradiant);
    border-radius: 50%;
    transition: opacity 500ms;
  }

  ${Label}:hover &::before, 
  ${CheckboxInput}:checked + ${Label} &::before {
    opacity: 1;
  }
`

const Check = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: var(--main-background-color);
  color: var(--very-muted-text-color);
  transition: background-color 500ms;

  ${CheckboxInput}:checked + ${Label} & {
    background-color: transparent;
  }
`
const CheckIcon = styled(CheckIconSVG)`
  width: var(--s-2);
  height: var(--s-2);
  stroke: currentColor;
  color: var(--main-background-color);
  transform: translateY(1px); // TODO improve the SVG centering
  opacity: 0;

  ${CheckboxInput}:checked + ${Label} & {
    opacity: 1;
  }
`

const LabelText = styled.span`
  flex-grow: 1;
  letter-spacing: -0.01em;
  transition: color 500ms;

  ${CheckboxInput}:checked + ${Label} & {
    text-decoration: line-through;
    color: var(--very-muted-text-color);
  }
`
