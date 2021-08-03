import { QueryClient, QueryClientProvider } from 'react-query'
import '../styles/reset.scss'
import '../styles/global.css'
import { ThemeProvider } from 'context/theme'
import { NotificationProvider } from 'context/notification'
import type { AppProps } from 'next/app'

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../msw')
}

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
export default MyApp
