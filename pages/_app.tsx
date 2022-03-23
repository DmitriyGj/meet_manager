import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { withLayout } from '../public/src/HOC/Layout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default withLayout(MyApp)
