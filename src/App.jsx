import { useLenis } from './hooks/useLenis'
import { useReducedMotion } from './hooks/useReducedMotion'
import { Section } from './components/Section'
import { event } from './content/conference'

export default function App() {
  const reducedMotion = useReducedMotion()
  useLenis(!reducedMotion)

  return (
    <main>
      {/* Sections A–J land here, one piece at a time. */}
      <Section id="hero" bg="ink" frame="hero" className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <h1 className="display text-display">{event.wordmarkLines.join(' ')}</h1>
          <p className="label mt-6 text-muted">
            {event.season} · {event.hostSchool}
          </p>
        </div>
      </Section>
    </main>
  )
}
