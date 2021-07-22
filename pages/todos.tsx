import { useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ThemeToggle } from '@components/theme-toggle'
import { BackgroundImage } from '@components/background-image'
import styles from '@styles/todo.module.scss'
import { ScreenReaderNotification } from '@components/screen-reader-notification'
import { Todos, todoFiltersSchema } from '@features/todos'

export default function TodosPage() {
  const headingRef = useRef<HTMLHeadingElement>(null)

  const { query } = useRouter()
  const filters = todoFiltersSchema.parse(query)

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

      <div className={styles.screen}>
        <div className={styles.background}>
          <BackgroundImage />
        </div>
        <div className={styles.center}>
          <main className={styles.cover}>
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
            <ScreenReaderNotification />
            {/* <footer>
            <small>Some footer text</small>
          </footer> */}
          </main>
        </div>
      </div>
    </>
  )
}
