import NextLink from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'

type BaseProps = {
  children: React.ReactNode
}

type AnchorProps = {
  href: string
}

type ButtonProps = {
  onClick: () => void
}

type Props = BaseProps & (AnchorProps | ButtonProps)

export function Link(props: Props) {
  const router = useRouter()

  if ('href' in props) {
    return (
      <NextLink href={props.href} passHref>
        <Wrapper as="a" aria-current={router?.asPath === props.href}>
          {props.children}
        </Wrapper>
      </NextLink>
    )
  }

  return (
    <Wrapper as="button" type="button" onClick={props.onClick}>
      {props.children}
    </Wrapper>
  )
}

const Wrapper = styled.a`
  background-color: transparent;
  text-decoration: none;
  border: none;
  outline: none;
  padding: 0;
  color: var(--muted-text-color);
  cursor: pointer;

  &[aria-pressed='true'],
  &[aria-current='true'] {
    color: var(--primary-blue);
  }

  &:hover {
    color: var(--strong-text-color);
  }

  &:focus {
    outline: 2px auto;
    outline-offset: 5px;
  }
`
