import '@/app/globals.css'
import { UserProvider } from "@auth0/nextjs-auth0/client"

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}history