import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import Icon from './ui/Icon'
import { audience } from '../data/content'

export default function Audience() {
  return (
    <section id="audience" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={audience.title} subtitle={audience.subtitle} />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {audience.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="card-hover glass flex h-full items-center gap-4 rounded-2xl p-5 sm:p-6">
                <span className="inline-grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 text-violet-200 ring-1 ring-violet-400/25">
                  <Icon name={item.icon} className="h-6 w-6" />
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
                  {item.title}
                </h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
