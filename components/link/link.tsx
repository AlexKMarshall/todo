import NextLink from 'next/link'
import { useRouter } from 'next/router'
import styles from './link.module.scss'

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
      <NextLink href={props.href}>
        <a className={styles.link} aria-current={router?.asPath === props.href}>
          {props.children}
        </a>
      </NextLink>
    )
  }

  return (
    <button onClick={props.onClick} className={styles.link} type="button">
      {props.children}
    </button>
  )
}
