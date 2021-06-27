import '../styles/reset.scss'
import '../styles/global.css'
import { ThemeProvider } from 'context/theme'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
export default MyApp
