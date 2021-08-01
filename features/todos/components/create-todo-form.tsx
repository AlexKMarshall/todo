import { Todo } from '../schemas'
import { nanoid } from 'nanoid'
import { FormEvent, useState } from 'react'
import { useCreateTodo } from '../queries'
import { VisuallyHidden } from '@components/visually-hidden'
import { TextInput } from '@components/text-input'
import styled from 'styled-components'

type Props = {
  onCreateTodo?: (todo: Todo) => void
  className?: string
}

export function CreateTodoForm({ onCreateTodo, className }: Props) {
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
    <Form onSubmit={submitForm} className={className}>
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
    </Form>
  )
}

const Form = styled.form`
  /* grid-area: input; // move this bit */
  align-items: center;
  margin-bottom: var(--gutter);
  border-radius: var(--border-radius);

  box-shadow: 0 0 30px 0px var(--shadow-color);

  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 20%;
    bottom: 0;
    left: 20%;
    box-shadow: 0 0 50px 10px var(--shadow-color);
    z-index: -1;
  }
`
