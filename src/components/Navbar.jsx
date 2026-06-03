import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLeadModal } from '../context/LeadModalContext'
import { brand, hero } from '../data/content'

export default function Navbar() {
  const { open } = useLeadModal()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6"
    >
      <nav
        className={`mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all duration-500 ${
          scrolled ? 'glass-strong shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)]' : 'bg-transparent'
        }`}
      >
        <a href="#top" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_24px_-4px_rgba(139,92,246,0.8)]">
            <span className="h-3 w-3 rounded-full bg-white/95" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            {brand.name}
            <span className="text-gradient"> {brand.suffix}</span>
          </span>
        </a>

        <button
          onClick={open}
          className="rounded-xl bg-gradient-to-l from-indigo-500 to-violet-600 px-4 sm:px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.04] shadow-[0_8px_30px_-10px_rgba(99,102,241,0.7)]"
        >
          {hero.primaryCta}
        </button>
      </nav>
    </motion.header>
  )
}
