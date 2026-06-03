import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-right'
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <Reveal>
          <span className="inline-block mb-4 rounded-full glass px-4 py-1.5 text-xs font-medium text-violet-200/90">
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.15] text-gradient-soft">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.12}>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">{subtitle}</p>
        </Reveal>
      )}
    </div>
  )
}
