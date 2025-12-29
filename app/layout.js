import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MAWB. - Portfolio',
  description: 'Full Stack Developer & Creative Designer - Portfolio with stunning 3D animations',
  keywords: 'portfolio, web developer, full stack, react, nextjs, 3d animations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}