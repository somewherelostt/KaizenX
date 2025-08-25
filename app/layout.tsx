import type React from "react"
import type { Metadata } from "next"
import { Urbanist } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BottomNav } from "@/components/bottom-nav"
import { WalletProvider } from "@/contexts/WalletContext"

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
})

export const metadata: Metadata = {
  title: "Kaizen - Web3 Events & NFTs",
  description: "Discover, attend, and collect NFTs from Web3 events on Stellar blockchain",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={urbanist.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-black text-white min-h-screen" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <WalletProvider>
            {children}
            {/* Bottom Navigation Bar */}
            <BottomNav />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
