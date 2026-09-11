import { useScrollDriver } from './hooks/useScrollDriver'
import { useTextMotion } from './hooks/useTextMotion'
import { BackgroundVideo } from './components/BackgroundVideo'
import { ClientWork } from './components/ClientWork'
import { Contact } from './components/Contact'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Interstitial } from './components/Interstitial'
import { MarqueeBand } from './components/MarqueeBand'
import { Preloader } from './components/Preloader'
import { ProjectsSection } from './components/ProjectsSection'
import { RecordSection } from './components/RecordSection'
import { SiteFooter } from './components/SiteFooter'
import { Skills } from './components/Skills'
import { Statement } from './components/Statement'
import { WebGLLayer } from './components/WebGLLayer'

export default function App() {
  useTextMotion()
  useScrollDriver()

  return (
    <>
      <Preloader />
      <BackgroundVideo />
      <WebGLLayer />
      <div className="noise" />
      <Header />

      <main id="top" className="page">
        <Hero />
        <Statement />
        <Interstitial />
        <Skills />
        <ProjectsSection />
        <ClientWork />
        <RecordSection />
        <MarqueeBand />
        <Contact />
      </main>

      <SiteFooter />
    </>
  )
}
