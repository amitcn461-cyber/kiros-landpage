import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, CheckCircle2, Sparkles } from 'lucide-react'
import { chatDemo } from '../data/content'

function TypingBubble() {
  return (
    <div className="flex items-center gap-1 rounded-2xl rounded-tr-sm bg-white/[0.06] px-4 py-3 w-fit">
      <span className="typing-dot h-2 w-2 rounded-full bg-violet-300" style={{ animationDelay: '0s' }} />
      <span className="typing-dot h-2 w-2 rounded-full bg-violet-300" style={{ animationDelay: '0.2s' }} />
      <span className="typing-dot h-2 w-2 rounded-full bg-violet-300" style={{ animationDelay: '0.4s' }} />
    </div>
  )
}

export default function ChatDemo() {
  const { messages, summary } = chatDemo
  const [shown, setShown] = useState(0) // number of messages revealed
  const [typing, setTyping] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [started, setStarted] = useState(false)
  const containerRef = useRef(null)
  const scrollRef = useRef(null)

  // Start when scrolled into view
  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Drive the conversation
  useEffect(() => {
    if (!started) return
    let timers = []

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setShown(messages.length)
      setShowSummary(true)
      return
    }

    const run = (i) => {
      if (i >= messages.length) {
        timers.push(setTimeout(() => setShowSummary(true), 600))
        return
      }
      setTyping(true)
      timers.push(
        setTimeout(() => {
          setTyping(false)
          setShown(i + 1)
          timers.push(setTimeout(() => run(i + 1), 650))
        }, 900),
      )
    }
    timers.push(setTimeout(() => run(0), 500))
    return () => timers.forEach(clearTimeout)
  }, [started, messages.length])

  // Auto-scroll the chat body
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [shown, typing, showSummary])

  return (
    <div ref={containerRef} className="relative">
      <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-violet-600/20 blur-3xl" />

      <div className="glass-strong overflow-hidden rounded-[1.75rem] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_20px_-4px_rgba(139,92,246,0.9)]">
              <Bot className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">KIROS AI</p>
              <p className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                מגיב עכשיו
              </p>
            </div>
          </div>
          <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[11px] text-slate-400">
            {chatDemo.subtitle}
          </span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="h-[320px] sm:h-[360px] space-y-3 overflow-y-auto px-4 py-5">
          <AnimatePresence initial={false}>
            {messages.slice(0, shown).map((m, i) => {
              const isKiros = m.from === 'kiros'
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className={`flex items-end gap-2 ${isKiros ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                      isKiros
                        ? 'bg-gradient-to-br from-indigo-500 to-violet-600'
                        : 'bg-white/[0.08]'
                    }`}
                  >
                    {isKiros ? (
                      <Bot className="h-4 w-4 text-white" />
                    ) : (
                      <User className="h-4 w-4 text-slate-300" />
                    )}
                  </span>
                  <p
                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      isKiros
                        ? 'rounded-tr-sm bg-gradient-to-l from-indigo-500/90 to-violet-600/90 text-white'
                        : 'rounded-tl-sm bg-white/[0.07] text-slate-100'
                    }`}
                  >
                    {m.text}
                  </p>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {typing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-end gap-2"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600">
                <Bot className="h-4 w-4 text-white" />
              </span>
              <TypingBubble />
            </motion.div>
          )}

          {/* Summary card */}
          <AnimatePresence>
            {showSummary && (
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-2 rounded-2xl border border-violet-400/25 bg-violet-500/[0.08] p-4"
              >
                <div className="mb-3 flex items-center gap-2 text-violet-200">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-xs font-semibold">{summary.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {summary.rows.map((r) => (
                    <div
                      key={r.label}
                      className={`rounded-xl bg-black/20 px-3 py-2 ${
                        r.highlight ? 'col-span-2 border border-emerald-400/25' : ''
                      }`}
                    >
                      <p className="text-[11px] text-slate-400">{r.label}</p>
                      <p
                        className={`text-sm font-bold ${
                          r.highlight ? 'text-emerald-300' : 'text-slate-100'
                        }`}
                      >
                        {r.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-500/[0.08] px-3 py-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <p className="text-xs leading-relaxed text-emerald-100/90">
                    <span className="font-semibold">{summary.recommendationLabel}: </span>
                    {summary.recommendation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
