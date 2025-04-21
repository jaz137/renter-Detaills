import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Redibo',
  description: 'Ingenieria de Software',
  generator: 'dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
