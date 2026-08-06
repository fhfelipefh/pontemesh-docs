import { useRef } from 'react'
import { ArchitectureSection } from './components/ArchitectureSection'
import { DownloadSection } from './components/DownloadSection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { usePageAnimations } from './hooks/usePageAnimations'

export function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  usePageAnimations(rootRef)

  return (
    <div ref={rootRef}>
      <Header />
      <Hero />
      <ArchitectureSection />
      <DownloadSection />
      <Footer />
    </div>
  )
}
