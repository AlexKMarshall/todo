import { useRouter } from 'next/dist/client/router'
import { createContext, ReactNode, useContext } from 'react'
import { TodoFilters, todoFiltersSchema } from 'types/todo'

type WithChildren<T extends {}> = T & {
  children: ReactNode
}

const TodoFilterContext = createContext<TodoFilters | undefined>(undefined)
TodoFilterContext.displayName = 'FilterContext'

export function TodoFilterProvider({ children }: WithChildren<{}>) {
  const { query } = useRouter()
  const filters = todoFiltersSchema.parse(query)

  return (
    <TodoFilterContext.Provider value={filters}>
      {children}
    </TodoFilterContext.Provider>
  )
}

export function useTodoFilters() {
  const context = useContext(TodoFilterContext)
  if (context === undefined)
    throw new Error(`useTodoFilters must be used within a <FilterProvider>`)
  return context
}
