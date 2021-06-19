import { render, screen } from '../test-utils'
import userEvent from '@testing-library/user-event'
import faker from 'faker'
import { Todo } from 'types/todo'
import TodoPage from '@pages/index'

function buildTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: faker.datatype.uuid(),
    title: faker.commerce.productName(),
    completed: faker.datatype.boolean(),
    ...overrides,
  }
}

describe('Todo Page', () => {
  it('should render the heading', () => {
    render(<TodoPage />)
    const heading = screen.getByRole('heading', {
      name: /todo/i,
    })
    expect(heading).toBeInTheDocument()
  })

  it('should render a list of todos in order', () => {
    const todos = [buildTodo(), buildTodo(), buildTodo()]

    render(<TodoPage initialTodos={todos} />)

    const listItems = screen.getAllByRole('listitem')

    listItems.forEach((listItem, index) => {
      const expectedTodo = todos[index]
      expect(listItem).toHaveTextContent(expectedTodo.title)
    })
  })

  it('should render filtered todos', () => {
    const activeTodo = buildTodo({ completed: false })
    const completedTodo = buildTodo({ completed: true })

    render(<TodoPage initialTodos={[activeTodo, completedTodo]} />)

    userEvent.click(screen.getByRole('button', { name: /active/i }))
    expect(screen.getByText(activeTodo.title)).toBeInTheDocument()
    expect(screen.queryByText(completedTodo.title)).not.toBeInTheDocument()

    userEvent.click(screen.getByRole('button', { name: /completed/i }))
    expect(screen.queryByText(activeTodo.title)).not.toBeInTheDocument()
    expect(screen.getByText(completedTodo.title)).toBeInTheDocument()

    userEvent.click(screen.getByRole('button', { name: /all/i }))
    expect(screen.getByText(activeTodo.title)).toBeInTheDocument()
    expect(screen.getByText(completedTodo.title)).toBeInTheDocument()
  })

  it('should show number of active todos', () => {
    const noActiveTodos = [
      buildTodo({ completed: true }),
      buildTodo({ completed: true }),
    ]
    render(<TodoPage initialTodos={noActiveTodos} />)
    expect(screen.getByText(/0 items left/i)).toBeInTheDocument()

    const oneActiveTodo = [
      buildTodo({ completed: false }),
      buildTodo({ completed: true }),
    ]
    render(<TodoPage initialTodos={oneActiveTodo} />)
    expect(screen.getByText(/1 item left/i)).toBeInTheDocument()

    const twoActiveTodos = [
      buildTodo({ completed: false }),
      buildTodo({ completed: false }),
    ]
    render(<TodoPage initialTodos={twoActiveTodos} />)
    expect(screen.getByText(/2 items left/i)).toBeInTheDocument()
  })
})
