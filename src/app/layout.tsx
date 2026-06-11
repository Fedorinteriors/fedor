import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fedor Interiors — AI Dizajn Kuhinja',
  description: 'Uploaduj skicu prostorije i dobij 5 varijanti dizajna kuhinje sa kalkulacijom i PDF-om za klijenta.',
  keywords: ['dizajn kuhinja', 'interior design', 'AI', 'kuhinja', 'renderi'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bs">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-stone-50 antialiased">{children}</body>
    </html>
  )
}
