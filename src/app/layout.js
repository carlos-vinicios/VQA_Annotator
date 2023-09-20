import './globals.css'
import { Inter } from 'next/font/google'
import Provider from '@/context/Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'VQA Annotator',
  description: 'Ferramenta para anotação de documentos.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <Provider>
        <body className={inter.main}>{children}</body>
      </Provider>
    </html>
  )
}
