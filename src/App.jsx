import { useLenis } from './hooks/useLenis'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useSectionFrame } from './hooks/useSectionFrame'
import { Cursor } from './components/Cursor'
import { NavFrame } from './components/NavFrame'
import { Hero } from './components/Hero'

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
        {/* Sections C–J land here, one piece at a time. */}
      </main>
    </>
  )
}
