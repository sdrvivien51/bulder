"use client"

import { ThemeProvider } from "next-themes";
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

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
          defaultTheme="dark"
          enableSystem={false}
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
