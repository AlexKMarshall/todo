import { render, screen } from '../test-utils'
import userEvent, { specialChars } from '@testing-library/user-event'
import Image from 'next/image'
import faker from 'faker'
import * as client from '../../services/client'
import { Todo } from 'types/todo'
import TodoPage from '@pages/todos'
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react'

jest.mock('../../services/client')

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
    }
  },
}))

jest.mock('next/image', () => {
  const FakeImage = jest.fn(() => null)
  return FakeImage
})

function randomPick<T>(arr: Array<T>): T {
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}

function buildTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: faker.datatype.uuid(),
    title: faker.commerce.productName(),
    status: randomPick<Todo['status']>(['active', 'completed']),
    ...overrides,
  }
}

beforeEach(() => {})

describe('Todo Page', () => {
  it('should render the heading', () => {
    const mockGetTodos = client.getTodos as jest.Mock
    mockGetTodos.mockResolvedValueOnce([])

    render(<TodoPage />)
    const heading = screen.getByRole('heading', {
      name: /todo/i,
    })
    expect(heading).toBeInTheDocument()
  })

  it('should render a list of todos in order', async () => {
    const todos = [buildTodo(), buildTodo(), buildTodo()]

    const mockGetTodos = client.getTodos as jest.Mock
    mockGetTodos.mockResolvedValueOnce(todos)

    render(<TodoPage />)

    await waitForElementToBeRemoved(() => screen.getByText(/loading.../i))

    const listItems = screen.getAllByRole('listitem')

    listItems.forEach((listItem, index) => {
      const expectedTodo = todos[index]
      expect(listItem).toHaveTextContent(expectedTodo.title)
    })
  })
  it('should show an empty list message when there are no todos', async () => {
    const mockGetTodos = client.getTodos as jest.Mock
    mockGetTodos.mockResolvedValueOnce([])

    render(<TodoPage />)

    await waitForElementToBeRemoved(() => screen.getByText(/loading.../i))

    const emptyListRegex = new RegExp('well done, your tasks are complete', 'i')
    expect(screen.getByText(emptyListRegex)).toBeInTheDocument()
  })
  it('should not show empty list message when there are some todos', async () => {
    const mockGetTodos = client.getTodos as jest.Mock
    mockGetTodos.mockResolvedValueOnce([buildTodo()])

    render(<TodoPage />)

    await waitForElementToBeRemoved(() => screen.getByText(/loading.../i))

    const emptyListRegex = new RegExp('well done, your tasks are complete', 'i')
    expect(screen.queryByText(emptyListRegex)).not.toBeInTheDocument()
  })
  // it('should render filtered todos', async () => {
  //   const activeTodo = buildTodo({ completed: false })
  //   const completedTodo = buildTodo({ completed: true })

  //   render(<TodoPage initialTodos={[activeTodo, completedTodo]} />)

  //   const allButton = screen.getByRole('button', { name: /show all todos/i })
  //   const activeButton = screen.getByRole('button', {
  //     name: /show active todos/i,
  //   })
  //   const completedButton = screen.getByRole('button', {
  //     name: /show completed todos/i,
  //   })

  //   userEvent.click(activeButton)
  //   await waitFor(() => {
  //     expect(screen.queryByText(completedTodo.title)).not.toBeInTheDocument()
  //   })
  //   expect(screen.getByText(activeTodo.title)).toBeInTheDocument()
  //   expect(activeButton).toHaveAttribute('aria-pressed', 'true')
  //   expect(allButton).toHaveAttribute('aria-pressed', 'false')
  //   expect(completedButton).toHaveAttribute('aria-pressed', 'false')

  //   userEvent.click(completedButton)
  //   await waitFor(() => {
  //     expect(screen.queryByText(activeTodo.title)).not.toBeInTheDocument()
  //   })
  //   expect(screen.getByText(completedTodo.title)).toBeInTheDocument()
  //   expect(completedButton).toHaveAttribute('aria-pressed', 'true')
  //   expect(activeButton).toHaveAttribute('aria-pressed', 'false')
  //   expect(allButton).toHaveAttribute('aria-pressed', 'false')

  //   userEvent.click(allButton)
  //   await waitFor(() => {
  //     expect(screen.getByText(activeTodo.title)).toBeInTheDocument()
  //   })
  //   expect(screen.getByText(completedTodo.title)).toBeInTheDocument()
  //   expect(allButton).toHaveAttribute('aria-pressed', 'true')
  //   expect(completedButton).toHaveAttribute('aria-pressed', 'false')
  //   expect(activeButton).toHaveAttribute('aria-pressed', 'false')
  // })

  // it('should show number of active todos', () => {
  //   const noActiveTodos = [
  //     buildTodo({ completed: true }),
  //     buildTodo({ completed: true }),
  //   ]
  //   render(<TodoPage initialTodos={noActiveTodos} />)
  //   expect(screen.getByText(/0 items left/i)).toBeInTheDocument()

  //   const oneActiveTodo = [
  //     buildTodo({ completed: false }),
  //     buildTodo({ completed: true }),
  //   ]
  //   render(<TodoPage initialTodos={oneActiveTodo} />)
  //   expect(screen.getByText(/1 item left/i)).toBeInTheDocument()

  //   const twoActiveTodos = [
  //     buildTodo({ completed: false }),
  //     buildTodo({ completed: false }),
  //   ]
  //   render(<TodoPage initialTodos={twoActiveTodos} />)
  //   expect(screen.getByText(/2 items left/i)).toBeInTheDocument()
  // })
  // it('should allow user to enter todo', () => {
  //   render(<TodoPage initialTodos={[]} />)

  //   const newTodoTitle = 'Some new todo'
  //   const todoInput = screen.getByLabelText(/write a new todo item/i)
  //   userEvent.type(todoInput, newTodoTitle)
  //   userEvent.type(todoInput, specialChars.enter)

  //   expect(screen.getByText(newTodoTitle)).toBeInTheDocument()
  //   expect(screen.getByText(/1 item left/i)).toBeInTheDocument()
  //   expect(todoInput).toHaveValue('')
  // })
  // it('should not allow user to enter empty todo', () => {
  //   render(<TodoPage initialTodos={[]} />)

  //   const todoInput = screen.getByLabelText(/write a new todo item/i)
  //   const addButton = screen.getByRole('button', { name: /add/i })
  //   const emptyText = '    '
  //   userEvent.type(todoInput, emptyText)
  //   expect(todoInput).toBeInvalid()
  //   expect(addButton).toBeDisabled()

  //   const nonEmptyText = 'some text'
  //   userEvent.type(todoInput, nonEmptyText)
  //   expect(todoInput).toBeValid()
  //   expect(addButton).toBeEnabled()
  // })
  // it('should be possible to complete and uncomplete a todo', () => {
  //   const todo = buildTodo({ completed: false })
  //   render(<TodoPage initialTodos={[todo]} />)

  //   expect(screen.getByText(/1 item left/i)).toBeInTheDocument()

  //   const todoCompleteCheckbox = screen.getByRole('checkbox', {
  //     name: todo.title,
  //   })

  //   userEvent.click(todoCompleteCheckbox)
  //   expect(todoCompleteCheckbox).toBeChecked()
  //   expect(screen.getByText(/0 items left/i)).toBeInTheDocument()

  //   userEvent.click(todoCompleteCheckbox)
  //   expect(todoCompleteCheckbox).not.toBeChecked()
  //   expect(screen.getByText(/1 item left/i)).toBeInTheDocument()
  // })
  // it('should be possible to delete a todo', async () => {
  //   const todo = buildTodo()
  //   render(<TodoPage initialTodos={[todo]} />)

  //   const deleteLabelRegex = new RegExp(`delete ${todo.title}`, 'i')
  //   userEvent.click(screen.getByRole('button', { name: deleteLabelRegex }))
  //   await waitFor(() => {
  //     expect(screen.queryByText(todo.title)).not.toBeInTheDocument()
  //   })
  // })
  // it('should be possible to clear completed todos', async () => {
  //   const completedTodo = buildTodo({ completed: true })
  //   const activeTodo = buildTodo({ completed: false })

  //   render(<TodoPage initialTodos={[completedTodo, activeTodo]} />)

  //   expect(screen.getByText(completedTodo.title)).toBeInTheDocument()
  //   expect(screen.getByText(activeTodo.title)).toBeInTheDocument()

  //   userEvent.click(screen.getByRole('button', { name: /clear completed/i }))

  //   await waitFor(() => {
  //     expect(screen.queryByText(completedTodo.title)).not.toBeInTheDocument()
  //   })
  //   expect(screen.getByText(activeTodo.title)).toBeInTheDocument()
  // })
})
