import { useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '@context/theme'
import { ThemeToggle } from '@components/theme-toggle'
import { BackgroundImage } from '@components/background-image'
import styles from '@styles/todo.module.scss'
import { Todos, todoFiltersSchema } from '@features/todos'
import styled from 'styled-components'
import { Center, Cover, CoverInner } from '@components/layout'

export default function TodosPage() {
  const headingRef = useRef<HTMLHeadingElement>(null)

  const { query } = useRouter()
  const filters = todoFiltersSchema.parse(query)
  const { theme } = useTheme()

  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta
          name="description"
          content="Todo App from a design by frontendmentor.io"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Screen>
        <AnimatePresence>
          <BackgroundWrapper key={theme} exit={{ opacity: 0 }}>
            <BackgroundImage />
          </BackgroundWrapper>
        </AnimatePresence>
        <Center>
          <Cover as="main">
            <header className={styles.header}>
              <h1 tabIndex={-1} ref={headingRef} className={styles.heading}>
                Todo
              </h1>
              <ThemeToggle />
            </header>

            <Todos
              onDeleteTodo={() => {
                headingRef.current?.focus()
              }}
              filters={filters}
            />
            <footer className={styles.footer}>
              <small>Drag and drop to reorder list</small>
            </footer>
          </Cover>
        </Center>
      </Screen>
    </>
  )
}

const Screen = styled.div`
  min-height: 100%;
  display: grid;
  grid-template-areas: 'screen';

  & > * {
    grid-area: screen;
  }
`

const BackgroundWrapper = motion(styled.div`
  position: relative;
  max-height: 33vh;
  width: 100%;
  background: var(--background-gradiant);
`)
