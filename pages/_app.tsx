import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { withLayout } from '../public/src/HOC/Layout/Layout';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const cache = createCache({
  key: 'css',
  prepend: true,
});

function MyApp({ Component, pageProps }: AppProps) {
  return ( <CacheProvider value={cache}>
          <Component {...pageProps} />
    </CacheProvider>)
}

export default withLayout(MyApp)
