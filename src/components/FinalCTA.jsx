import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Reveal from './ui/Reveal'
import { useLeadModal } from '../context/LeadModalContext'
import { finalCta } from '../data/content'

export default function FinalCTA() {
  const { open } = useLeadModal()

  return (
    <section id="cta" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] glass-strong px-6 py-14 sm:px-12 sm:py-20 text-center">
          {/* glow backdrop */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="blob blob-anim-1 -top-20 right-1/4 h-72 w-72 bg-indigo-600/40" />
            <div className="blob blob-anim-2 -bottom-24 left-1/4 h-72 w-72 bg-violet-600/40" />
          </div>

          <Reveal>
            <h2 className="mx-auto max-w-3xl text-3xl sm:text-5xl font-extrabold leading-[1.18] text-gradient-soft">
              {finalCta.title}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300/90">
              {finalCta.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <motion.button
              onClick={open}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="shimmer group mt-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-indigo-500 via-violet-500 to-indigo-500 px-9 py-4 text-base sm:text-lg font-semibold text-white shadow-[0_14px_50px_-10px_rgba(99,102,241,0.85)]"
            >
              {finalCta.cta}
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            </motion.button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
