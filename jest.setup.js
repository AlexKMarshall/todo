import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import 'whatwg-fetch'
import { server } from './mock-server/server'

process.env.DEBUG_PRINT_LIMIT = 1500

beforeAll(() => {
  server.listen()
})
afterAll(() => {
  server.close()
})
afterEach(() => {
  server.resetHandlers()
})
