import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
