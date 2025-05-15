import { Geist, Geist_Mono, Inter } from "next/font/google"
import "@/styles/globals.css"
import { ThemeProviders } from "@/context/ThemeProvider"
import { Toaster } from "@ridex/ui/components/sonner"
import { satoshi } from "@/styles/fonts"
import AuthProvider from "@/context/AuthProvider"
import ReduxProvider from "@/context/ReduxProvider"
import { cn } from "@ridex/ui/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
  auth
}: Readonly<{
  children: React.ReactNode,
  auth: React.ReactNode
}>) {

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(satoshi.variable, inter.variable, fontSans.variable, fontMono.variable)}
    >
      <AuthProvider>
        <body
          className={`antialiased font-display`}
        >
          <ReduxProvider>
            <ThemeProviders>
              {children}
              {auth}
              <Toaster position="top-right" richColors invert duration={1500} />
            </ThemeProviders>
          </ReduxProvider>
        </body>
      </AuthProvider>
    </html>
  )
}
