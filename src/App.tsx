import { useLenis } from "./hooks/useLenis"
import { useScrollDriver } from './hooks/useScrollDriver'
import { useTextMotion } from './hooks/useTextMotion'
import { ClientWork } from './components/ClientWork'
import { Contact } from './components/Contact'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ScrollCursor } from './components/ScrollCursor'
import { Interstitial } from './components/Interstitial'
import { MarqueeBand } from './components/MarqueeBand'
import { Preloader } from './components/Preloader'
import { MarksSection } from './components/MarksSection'
import { ProjectsSection } from './components/ProjectsSection'
import { RecordSection } from './components/RecordSection'
import { SiteFooter } from './components/SiteFooter'
import { Skills } from './components/Skills'
import { Statement } from './components/Statement'
import { CursorDot } from './components/CursorDot'
import { PortfolioBackground } from './components/PortfolioBackground'

export default function App() {
  const scrollTo = useLenis()
  useTextMotion()
  useScrollDriver()

  return (
    <>
      <Preloader />
      <PortfolioBackground />
      <div className="noise" />
      <CursorDot />
      <Header />

      <main id="top" className="page">
        <Hero />
        <ScrollCursor />
        <Statement />
        <Interstitial />
        <Skills />
        <MarksSection />
        <ProjectsSection scrollTo={scrollTo} />
        <ClientWork />
        <RecordSection />
        <MarqueeBand />
        <Contact />
      </main>

      <SiteFooter />
    </>
  )
}
