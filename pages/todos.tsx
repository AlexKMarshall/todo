import styled from 'styled-components'
import { useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '@context/theme'
import { ThemeToggle } from '@components/theme-toggle'
import { BackgroundImage } from '@components/background-image'
import { Todos, todoFiltersSchema } from '@features/todos'
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
            <Header>
              <Heading tabIndex={-1} ref={headingRef}>
                Todo
              </Heading>
              <ThemeToggle />
            </Header>

            <Todos
              onDeleteTodo={() => {
                headingRef.current?.focus()
              }}
              filters={filters}
            />
            <Footer>
              <small>Drag and drop to reorder list</small>
            </Footer>
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

const Header = styled.header`
  font-size: var(--s2);
  --button-color: var(--very-light-grayish-blue);
  --button-hover-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Heading = styled.h1`
  font-size: var(--s3);
  font-weight: 700;
  color: var(--heading-color);
  text-transform: uppercase;
  letter-spacing: 0.17em;
`

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: var(--muted-text-color);
`
