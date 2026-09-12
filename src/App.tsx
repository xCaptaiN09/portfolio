import { useLenis } from "./hooks/useLenis"
import { useScrollDriver } from './hooks/useScrollDriver'
import { useTextMotion } from './hooks/useTextMotion'
import { BackgroundVideo } from './components/BackgroundVideo'
import { ClientWork } from './components/ClientWork'
import { Contact } from './components/Contact'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { BrandFlyer } from './components/BrandFlyer'
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
import { WebGLLayer } from './components/WebGLLayer'

export default function App() {
  useLenis()
  useTextMotion()
  useScrollDriver()

  return (
    <>
      <Preloader />
      <BackgroundVideo />
      <WebGLLayer />
      <div className="noise" />
      <CursorDot />
      <Header />

      <main id="top" className="page">
        <Hero />
      <BrandFlyer />
        <Statement />
        <Interstitial />
        <Skills />
        <MarksSection />
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
