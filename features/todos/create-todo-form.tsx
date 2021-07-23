import { Todo } from './schemas'
import { nanoid } from 'nanoid'
import { FormEvent, useState } from 'react'
import { useCreateTodo } from './queries'
import styles from './todos.module.scss'
import { VisuallyHidden } from '@components/visually-hidden'
import { TextInput } from '@components/text-input'

type Props = {
  onCreateTodo?: (todo: Todo) => void
}

export function CreateTodoForm({ onCreateTodo }: Props) {
  const [todoInputText, setTodoInputText] = useState('')
  const isInputInvalid = todoInputText.trim().length === 0

  const createTodoMutation = useCreateTodo({
    onSuccess: (createdTodo) => {
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
      <TextInput
        value={todoInputText}
        onChange={(e) => setTodoInputText(e.target.value)}
        aria-invalid={isInputInvalid}
        label="Write a new todo item"
        placeholder="Visit the zoo"
      />
      <VisuallyHidden>
        <button type="submit" disabled={isInputInvalid} tabIndex={-1}>
          add
        </button>
      </VisuallyHidden>
    </form>
  )
}
