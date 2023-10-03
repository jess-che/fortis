// pages/_app.tsx
import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { AppProps } from 'next/app';

export function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}