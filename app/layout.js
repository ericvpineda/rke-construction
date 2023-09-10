import './globals.css'
import { Inter } from 'next/font/google'
import Nav from "@components/Nav";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RKE Construction Website',
  description: 'Ernie Pineda contruction website.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Nav/>
        {children}
      </body>
    </html>
  )
}
