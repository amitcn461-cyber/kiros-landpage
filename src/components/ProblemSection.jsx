import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import Icon from './ui/Icon'
import CountUp from './ui/CountUp'
import { problem } from '../data/content'

export default function ProblemSection() {
  return (
    <section id="problem" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={problem.title} subtitle={problem.subtitle} />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problem.cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08}>
              <div className="card-hover glass h-full rounded-2xl p-6">
                <span className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-rose-500/10 text-rose-300 ring-1 ring-rose-400/20">
                  <Icon name={card.icon} className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-bold text-slate-100">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Stats */}
        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-4 rounded-3xl glass p-6 sm:p-8 sm:grid-cols-3">
            {problem.stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl sm:text-5xl font-extrabold text-gradient">
                  <CountUp end={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} />
                </p>
                <p className="mt-2 text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-slate-600">{problem.statsNote}</p>
        </Reveal>
      </div>
    </section>
  )
}
