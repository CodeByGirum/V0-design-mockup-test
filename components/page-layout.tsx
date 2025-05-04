import type { ReactNode } from "react"
import { Header } from "./header"
import { Footer } from "./footer"

interface PageLayoutProps {
  children: ReactNode
  transparentHeader?: boolean
  minimalFooter?: boolean
}

export function PageLayout({ children, transparentHeader = false, minimalFooter = false }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <Header transparent={transparentHeader} />
      <main className="flex-1">{children}</main>
      <Footer minimal={minimalFooter} />
    </div>
  )
}
