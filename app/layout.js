import '@styles/css/globals.css'
import { Inter } from 'next/font/google'
import Nav from "@components/Nav";
import { cn } from '@lib/utils';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RKE Construction Website',
  description: 'Ernie Pineda contruction website.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cn('bg-white text-slate-900 antialiased light', inter.className)}>
      <body className='min-h-screen bg-slate-50 antialiased'>
        <Nav/>
        {children}
      </body>
    </html>
  )
}
