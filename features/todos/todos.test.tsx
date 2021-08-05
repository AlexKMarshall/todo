import { render, screen } from '../../test/test-utils'
import userEvent, { specialChars } from '@testing-library/user-event'
import faker from 'faker'
import { Todo } from './schemas'
import { initialise } from '../../mock-server/todo.model'
import { Todos } from './todos'
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react'

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

beforeEach(() => {
  initialise()
})

describe('Todo Page', () => {
  it('should render a list of todos in order', async () => {
    const todos = [buildTodo(), buildTodo(), buildTodo()]
    await initialise(todos)

    render(<Todos />)

    await waitForElementToBeRemoved(() => screen.getByText(/loading.../i))

    const listItems = screen.getAllByRole('listitem')

    listItems.forEach((listItem, index) => {
      const expectedTodo = todos[index]
      expect(listItem).toHaveTextContent(expectedTodo.title)
    })
  })
  it('should show an empty list message when there are no todos', async () => {
    initialise()

    render(<Todos />)

    await waitForElementToBeRemoved(() => screen.getByText(/loading.../i))

    const emptyListRegex = new RegExp('you have no todos', 'i')
    expect(screen.getByText(emptyListRegex)).toBeInTheDocument()
  })
  it('should not show empty list message when there are some todos', async () => {
    initialise([buildTodo()])

    render(<Todos />)

    await waitForElementToBeRemoved(() => screen.getByText(/loading.../i))

    const emptyListRegex = new RegExp('You have no todos', 'i')
    expect(screen.queryByText(emptyListRegex)).not.toBeInTheDocument()
  })
  it('should show all todos when filter is empty', async () => {
    const activeTodo = buildTodo({ status: 'active' })
    const completedTodo = buildTodo({ status: 'completed' })

    initialise([activeTodo, completedTodo])

    render(<Todos filters={{}} />)

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))
    expect(screen.getByText(activeTodo.title)).toBeInTheDocument()
    expect(screen.getByText(completedTodo.title)).toBeInTheDocument()
  })
  it('should only show active todos when filter is status: "active"', async () => {
    const activeTodo = buildTodo({ status: 'active' })
    const completedTodo = buildTodo({ status: 'completed' })

    initialise([activeTodo, completedTodo])

    render(<Todos filters={{ status: 'active' }} />)

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))
    expect(screen.getByText(activeTodo.title)).toBeInTheDocument()
    expect(screen.queryByText(completedTodo.title)).not.toBeInTheDocument()
  })
  it('should only show completed todos when filter is status: "completed"', async () => {
    const activeTodo = buildTodo({ status: 'active' })
    const completedTodo = buildTodo({ status: 'completed' })

    initialise([activeTodo, completedTodo])

    render(<Todos filters={{ status: 'completed' }} />)

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))
    expect(screen.queryByText(activeTodo.title)).not.toBeInTheDocument()
    expect(screen.getByText(completedTodo.title)).toBeInTheDocument()
  })
  describe('should show number of active todos', () => {
    it('no active todos', async () => {
      const noActiveTodos = [
        buildTodo({ status: 'completed' }),
        buildTodo({ status: 'completed' }),
      ]

      initialise(noActiveTodos)
      render(<Todos />)

      expect(await screen.findByText(/0 items left/i)).toBeInTheDocument()
    })
    it('one active todo', async () => {
      const noActiveTodos = [
        buildTodo({ status: 'active' }),
        buildTodo({ status: 'completed' }),
      ]

      initialise(noActiveTodos)
      render(<Todos />)

      expect(await screen.findByText(/1 item left/i)).toBeInTheDocument()
    })
    it('two active todos', async () => {
      const noActiveTodos = [
        buildTodo({ status: 'active' }),
        buildTodo({ status: 'active' }),
      ]

      initialise(noActiveTodos)
      render(<Todos />)

      expect(await screen.findByText(/2 items left/i)).toBeInTheDocument()
    })
  })
  it('should be possible to complete and uncomplete a todo', async () => {
    const todo = buildTodo({ status: 'active' })
    initialise([todo])

    render(<Todos />)

    await waitForElementToBeRemoved(screen.getByText(/loading/i))

    expect(await screen.findByText(/1 item left/i)).toBeInTheDocument()

    const todoCompleteCheckbox = screen.getByRole('checkbox', {
      name: todo.title,
    })

    userEvent.click(todoCompleteCheckbox)
    await waitFor(() => expect(todoCompleteCheckbox).toBeChecked())
    expect(await screen.findByText(/0 items left/i)).toBeInTheDocument()

    userEvent.click(todoCompleteCheckbox)
    await waitFor(() => expect(todoCompleteCheckbox).not.toBeChecked())
    expect(await screen.findByText(/1 item left/i)).toBeInTheDocument()
  })
  it('should allow user to enter todo', async () => {
    initialise()

    render(<Todos />)

    const newTodoTitle = 'Some new todo'
    const todoInput = screen.getByLabelText(/write a new todo item/i)
    userEvent.type(todoInput, newTodoTitle)
    userEvent.type(todoInput, specialChars.enter)

    expect(await screen.findByText(newTodoTitle)).toBeInTheDocument()

    expect(screen.getByText(/1 item left/i)).toBeInTheDocument()
    expect(todoInput).toHaveValue('')
  })
  it('should not allow user to enter empty todo', () => {
    initialise()
    render(<Todos />)

    const todoInput = screen.getByLabelText(/write a new todo item/i)
    const addButton = screen.getByRole('button', { name: /add/i })
    const emptyText = '    '
    userEvent.type(todoInput, emptyText)
    expect(todoInput).toBeInvalid()
    expect(addButton).toBeDisabled()

    const nonEmptyText = 'some text'
    userEvent.type(todoInput, nonEmptyText)
    expect(todoInput).toBeValid()
    expect(addButton).toBeEnabled()
  })
  it('should be possible to delete a todo', async () => {
    const todo = buildTodo()
    initialise([todo])
    render(<Todos />)

    const deleteLabelRegex = new RegExp(`delete ${todo.title}`, 'i')

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

    userEvent.click(screen.getByRole('button', { name: deleteLabelRegex }))
    await waitFor(() => {
      expect(screen.queryByText(todo.title)).not.toBeInTheDocument()
    })
  })
  it('should be possible to clear completed todos', async () => {
    const completedTodo = buildTodo({ status: 'completed' })
    const activeTodo = buildTodo({ status: 'active' })

    initialise([completedTodo, activeTodo])

    render(<Todos />)

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

    expect(screen.getByText(completedTodo.title)).toBeInTheDocument()
    expect(screen.getByText(activeTodo.title)).toBeInTheDocument()

    userEvent.click(
      await screen.findByRole('button', { name: /clear completed/i })
    )

    await waitFor(() => {
      expect(screen.queryByText(completedTodo.title)).not.toBeInTheDocument()
    })
    expect(screen.getByText(activeTodo.title)).toBeInTheDocument()
  })
})
