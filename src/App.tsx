import { ArchitectureSection } from './components/ArchitectureSection'
import { DownloadSection } from './components/DownloadSection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'

export function App() {
  return (
    <>
      <Header />
      <Hero />
      <ArchitectureSection />
      <DownloadSection />
      <Footer />
    </>
  )
}
