import './globals.css';
import { Nunito } from 'next/font/google';
import { UserProvider } from '@auth0/nextjs-auth0/client';

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });

export const metadata = {
  title: 'Fortis',
  description: 'CS316 Project: Jessica Chen (jc939), Anirudh Jain (aj383), Swarajh Mehta (sm961), Austin Huang (ash110), Benjamin Chauhan (bsc32)',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={nunito.className}>{children}</body>
      </UserProvider>
    </html>
  )
}
