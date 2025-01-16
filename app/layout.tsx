import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Toaster } from 'sonner'
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://open-automa.com'),
  title: {
    default: 'OpenAutoma - Outils d\'IA et Automatisation',
    template: '%s | OpenAutoma'
  },
  description: 'Découvrez les meilleurs outils d\'IA et solutions no-code pour automatiser votre travail.',
  keywords: ['automatisation', 'IA', 'no-code', 'outils', 'productivité'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'votre-code-verification-google',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <title>OpenAutoma - Outils d&apos;IA et Automatisation</title>
        <meta 
          name="description" 
          content="Découvrez les meilleurs outils d&apos;IA et solutions no-code pour automatiser votre travail." 
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
