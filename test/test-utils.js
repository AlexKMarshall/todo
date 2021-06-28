import { render } from '@testing-library/react'
import { ThemeProvider } from '../context/theme'
import { NotificationProvider } from '../context/notification'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

const Providers = ({ children }) => {
  return (
    <ThemeProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </ThemeProvider>
  )
}

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: Providers, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
