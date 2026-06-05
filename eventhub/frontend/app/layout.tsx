import type { Metadata } from 'next'
import { Syne, Inter } from 'next/font/google'
import './globals.css'
import ToasterProvider from '@/components/ToasterProvider'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'EventHub - Platform Event Kampus',
  description: 'Temukan dan kelola event kampus terbaik di satu platform.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${syne.variable} ${inter.variable}`}>
      <body className="bg-[#0a0a0f] text-[#f1f5f9] font-inter">
        {children}
        <ToasterProvider />
      </body>
    </html>
  )
}
