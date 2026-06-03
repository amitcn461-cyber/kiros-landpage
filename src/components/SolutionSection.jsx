import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import Icon from './ui/Icon'
import { solution } from '../data/content'

export default function SolutionSection() {
  return (
    <section id="solution" className="relative py-24 sm:py-28">
      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="blob top-20 right-10 h-72 w-72 bg-indigo-600/20" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={solution.title} subtitle={solution.subtitle} />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {solution.cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08}>
              <div className="card-hover glass relative h-full overflow-hidden rounded-2xl p-6">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl" />
                <span className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 text-violet-200 ring-1 ring-violet-400/25">
                  <Icon name={card.icon} className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-bold text-slate-100">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
