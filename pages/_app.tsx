import '../styles/reset.scss'
import '../styles/global.css'
import { ThemeProvider } from 'context/theme'
import { NotificationProvider } from 'context/notification'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </ThemeProvider>
  )
}
export default MyApp
