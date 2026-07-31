import { useLenis } from './hooks/useLenis'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useSectionFrame } from './hooks/useSectionFrame'
import { Cursor } from './components/Cursor'
import { NavFrame } from './components/NavFrame'
import { Hero } from './components/Hero'
import { AgendaBlock } from './components/AgendaBlock'
import { Speakers } from './components/Speakers'
import { Schedule } from './components/Schedule'
import { Partners } from './components/Partners'
import { Register } from './components/Register'
import { Faq } from './components/Faq'
import { Gallery } from './components/Gallery'
import { Footer } from './components/Footer'

export default function App() {
  const reducedMotion = useReducedMotion()
  const { frameKey, theme } = useSectionFrame()

  useLenis(!reducedMotion)

  return (
    <>
      <Cursor />
      <NavFrame frameKey={frameKey} theme={theme} />

      <main>
        <Hero />
        <AgendaBlock />
        <Speakers />
        <Schedule />
        <Partners />
        <Register />
        <Faq />
        <Gallery />
      </main>

      <Footer />
    </>
  )
}
