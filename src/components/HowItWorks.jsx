import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import SectionHeading from './ui/SectionHeading'
import Icon from './ui/Icon'
import { howItWorks } from '../data/content'

function Step({ step, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-start gap-5 sm:gap-7"
    >
      {/* Node on the timeline (right side for RTL) */}
      <div className="relative z-10 shrink-0">
        <motion.span
          whileHover={{ scale: 1.1 }}
          className="grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_0_30px_-6px_rgba(139,92,246,0.8)] ring-1 ring-white/10"
        >
          <Icon name={step.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
        </motion.span>
        <span className="absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-white text-[11px] font-extrabold text-indigo-700 shadow">
          {index + 1}
        </span>
      </div>

      {/* Content */}
      <div className="card-hover glass flex-1 rounded-2xl p-5 sm:p-6">
        <h3 className="text-lg font-bold text-slate-100">{step.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{step.text}</p>
      </div>
    </motion.div>
  )
}

export default function HowItWorks() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 24 })

  return (
    <section id="how" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading title={howItWorks.title} subtitle={howItWorks.subtitle} />

        <div ref={ref} className="relative mt-16">
          {/* Timeline track (right side, RTL) */}
          <div className="absolute right-7 sm:right-8 top-2 bottom-2 w-px bg-white/10" />
          <motion.div
            style={{ scaleY }}
            className="absolute right-7 sm:right-8 top-2 bottom-2 w-px origin-top bg-gradient-to-b from-indigo-400 via-violet-500 to-cyan-400"
          />

          <div className="space-y-7">
            {howItWorks.steps.map((step, i) => (
              <Step key={step.title} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
