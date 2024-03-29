import { cn } from '@/lib/utils'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { NextAuthProviders } from '@/components/providers/next-auth'
import { Toaster } from '@/components/ui/toaster'
import TanstackQueryProvider from '@/components/providers/tanstack-query'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'social-media',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'font-sans')}>
        <TanstackQueryProvider>
          <NextAuthProviders>
            <ThemeProvider
              themes={[
                "lightRed", "lightViolet", "lightOrange", "lightBlue", "lightGreen", "lightYellow",
                "darkRed", "darkViolet", "darkOrange", "darkBlue", "darkGreen", "darkYellow"
              ]}
              attribute='class'
              defaultTheme='lightRed'
              enableSystem={false}
              storageKey='social-media-theme'
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </NextAuthProviders>
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
