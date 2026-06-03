import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import Icon from './ui/Icon'
import { businessValue } from '../data/content'

export default function BusinessValue() {
  return (
    <section id="value" className="relative py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="blob bottom-0 left-10 h-72 w-72 bg-violet-600/20" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={businessValue.title} subtitle={businessValue.subtitle} />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businessValue.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.07}>
              <div className="card-hover glass h-full rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 text-emerald-300 ring-1 ring-emerald-400/20">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-bold text-slate-100">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
