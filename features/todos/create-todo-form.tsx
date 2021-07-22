import { Todo } from './schemas'
import { nanoid } from 'nanoid'
import { FormEvent, useState } from 'react'
import { useCreateTodo } from './queries'
import styles from './todos.module.scss'

type Props = {
  onCreateTodo?: (todo: Todo) => void
}

export function CreateTodoForm({ onCreateTodo }: Props) {
  const [todoInputText, setTodoInputText] = useState('')
  const isInputInvalid = todoInputText.trim().length === 0

  const createTodoMutation = useCreateTodo({
    onSuccess: (createdTodo) => {
      // setNotificationMessage(`${createdTodo.title} added`)
      setTodoInputText('')
      onCreateTodo?.(createdTodo)
    },
  })

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isInputInvalid) return
    const newTodo: Todo = {
      id: nanoid(),
      title: todoInputText.trim(),
      status: 'active',
    }
    createTodoMutation.mutate(newTodo)
  }

  return (
    <form onSubmit={submitForm} className={styles.todoForm}>
      <span className={styles.decorativeCircle} />
      <input
        type="text"
        value={todoInputText}
        onChange={(e) => setTodoInputText(e.target.value)}
        aria-invalid={isInputInvalid}
        aria-label="Write a new todo item"
        placeholder="Visit the zoo"
        className={styles.todoInput}
      />
      <button
        type="submit"
        disabled={isInputInvalid}
        className={styles.visuallyHidden}
      >
        add
      </button>
    </form>
  )
}
