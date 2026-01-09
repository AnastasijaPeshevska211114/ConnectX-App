import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'

import '../globals.css'
import { currentUser } from '@clerk/nextjs/server'
import TopBar from '@/components/shared/TopBar'
import LeftSideBar from '@/components/shared/LeftSideBar'
import RightSideBar from '@/components/shared/RightSideBar'
import BottomBar from '@/components/shared/BottomBar'


import { ThemeProvider } from '@/components/shared/ThemeProvider'

export const metadata: Metadata = {
  title: 'ConnectX',
  description: 'A social media app, to discover what is happening now in the world',
}

const inter = Inter({
  subsets: ['latin'],
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await currentUser()

  if (!user) {
    return (
      <html lang="en">
        <ClerkProvider>
          <body>
            <main className={`${inter.className} bg-dark-1`}>
              <div className="w-full flex justify-center items-center min-h-screen">
                {children}
              </div>
            </main>
          </body>
        </ClerkProvider>
      </html>
    )
  }

  return (
    <html lang="en">
      <ClerkProvider>
        <ThemeProvider>
          <body className={inter.className}>
            <TopBar />

            <main className="flex">
              <LeftSideBar />
              <section className="main-container">
                <div className="w-full max-w-4xl">{children}</div>
              </section>
              <RightSideBar />
            </main>

            <BottomBar />
          </body>
        </ThemeProvider>
      </ClerkProvider>
    </html>
  )
}
