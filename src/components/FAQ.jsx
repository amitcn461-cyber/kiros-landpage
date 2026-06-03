import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import { faq } from '../data/content'

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div
      className={`glass overflow-hidden rounded-2xl transition-colors duration-300 ${
        isOpen ? 'border-violet-400/30' : ''
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 sm:px-6 py-5 text-right"
      >
        <span className="text-base sm:text-lg font-semibold text-slate-100">{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
            isOpen ? 'bg-violet-500/20 text-violet-200' : 'bg-white/[0.05] text-slate-400'
          }`}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="px-5 sm:px-6 pb-5 text-sm sm:text-[15px] leading-relaxed text-slate-400">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading title={faq.title} subtitle={faq.subtitle} />

        <div className="mt-12 space-y-3.5">
          {faq.items.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.05}>
              <FaqItem
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
