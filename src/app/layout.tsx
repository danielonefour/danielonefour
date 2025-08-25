import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import "@flaticon/flaticon-uicons/css/all/all.css";


import ReactQueryProvider from '@/lib/react-query-provider'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700'], 
})

export const metadata: Metadata = {
  title: 'Daniel One Four',
  description: 'Professional coaching services to help you achieve your goals and transform your life.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased bg-white text-gray-900 min-h-screen">
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  )
}
