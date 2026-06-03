import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, Check } from 'lucide-react'
import { useLeadModal } from '../context/LeadModalContext'
import { hero } from '../data/content'
import ChatDemo from './ChatDemo'

export default function Hero() {
  const { open } = useLeadModal()

  const scrollToHow = () => {
    document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="top" className="relative overflow-hidden pt-32 sm:pt-40 pb-16 sm:pb-24">
      {/* Background glow blobs + grid */}
      <div className="absolute inset-0 -z-10">
        <div className="blob blob-anim-1 -top-32 right-1/4 h-[28rem] w-[28rem] bg-indigo-600/40" />
        <div className="blob blob-anim-2 top-10 left-1/4 h-[26rem] w-[26rem] bg-violet-600/40" />
        <div className="blob -top-20 left-1/2 h-72 w-72 -translate-x-1/2 bg-blue-500/20" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        {/* Text column */}
        <div className="text-center lg:text-right">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs sm:text-sm font-medium text-violet-100/90"
          >
            <Sparkles className="h-4 w-4 text-violet-300" />
            {hero.badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-4xl sm:text-6xl lg:text-[4.1rem] font-extrabold leading-[1.08] tracking-tight"
          >
            <span className="text-gradient-soft">כל ליד מטופל</span>
            <br />
            <span className="text-gradient">בזמן אמת</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-300/90 mx-auto lg:mx-0"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
          >
            <button
              onClick={open}
              className="shimmer group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-indigo-500 via-violet-500 to-indigo-500 px-8 py-4 text-base sm:text-lg font-semibold text-white shadow-[0_12px_45px_-10px_rgba(99,102,241,0.75)] transition-transform duration-200 hover:scale-[1.03]"
            >
              {hero.primaryCta}
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
            <button
              onClick={scrollToHow}
              className="glass inline-flex w-full sm:w-auto items-center justify-center rounded-2xl px-8 py-4 text-base sm:text-lg font-semibold text-slate-100 transition-colors duration-300 hover:bg-white/[0.06]"
            >
              {hero.secondaryCta}
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-5 text-sm text-violet-200/70"
          >
            {hero.microcopy}
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48 }}
            className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-sm text-slate-400"
          >
            {hero.trust.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-400" />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Chat demo column */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChatDemo />
        </motion.div>
      </div>
    </section>
  )
}
