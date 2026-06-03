import { useEffect, useRef, useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useLeadModal } from '../context/LeadModalContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { modal } from '../data/content'

const emptyForm = { fullName: '', business: '', phone: '', email: '', volume: '', honeypot: '' }

// Insert a lead into the Supabase `leads` table.
// Throws on failure so the caller can show an error message.
async function submitLead(data) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured (.env.local missing values).')
  }
  const { error } = await supabase.from('leads').insert({
    full_name:  data.fullName.trim(),
    business:   data.business.trim(),
    phone:      data.phone.trim(),
    email:      data.email.trim(),
    volume:     data.volume,
    honeypot:   data.honeypot || null,
  })
  if (error) throw error
}

function validate(form) {
  const errors = {}
  if (!form.fullName.trim()) errors.fullName = modal.errors.required
  if (!form.business.trim()) errors.business = modal.errors.required
  if (!form.phone.trim()) errors.phone = modal.errors.required
  else if (!/^[\d\s+\-()]{7,}$/.test(form.phone.trim())) errors.phone = modal.errors.phone
  if (!form.email.trim()) errors.email = modal.errors.required
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = modal.errors.email
  if (!form.volume) errors.volume = modal.errors.required
  return errors
}

const fieldClass =
  'w-full rounded-xl bg-white/[0.04] border px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition-colors duration-200 focus:outline-none focus:border-violet-400/60 focus:bg-white/[0.06]'

export default function LeadModal() {
  const { isOpen, close } = useLeadModal()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [done, setDone] = useState(false)
  const dialogRef = useRef(null)
  const firstFieldRef = useRef(null)

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setForm(emptyForm)
      setErrors({})
      setSubmitError('')
      setDone(false)
      setSubmitting(false)
      setTimeout(() => firstFieldRef.current?.focus(), 60)
    }
  }, [isOpen])

  // Scroll lock + ESC + basic focus trap
  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, close])

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Honeypot: bots fill this hidden field, humans don't
    if (form.honeypot) { setDone(true); return }
    const v = validate(form)
    setErrors(v)
    if (Object.keys(v).length > 0) return
    setSubmitError('')
    setSubmitting(true)
    try {
      await submitLead(form)
      setDone(true)
    } catch (err) {
      console.error('[KIROS] Lead submit failed:', err)
      setSubmitError(modal.errors.submit)
    } finally {
      setSubmitting(false)
    }
  }

  const fields = modal.fields

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-modal-title"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-[1.75rem] glass-strong shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
          >
            <div className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full bg-violet-600/30 blur-3xl" />

            <button
              onClick={close}
              aria-label="סגירה"
              className="absolute left-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/[0.05] text-slate-300 transition-colors hover:bg-white/[0.12]"
            >
              <X className="h-5 w-5" />
            </button>

            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 sm:p-8"
                >
                  <h2 id="lead-modal-title" className="text-2xl font-extrabold text-gradient-soft">
                    {modal.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">{modal.subtitle}</p>

                  <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                    {/* Honeypot — hidden from real users, bots fill it */}
                    <input
                      aria-hidden="true"
                      tabIndex={-1}
                      className="absolute opacity-0 pointer-events-none h-0 w-0"
                      autoComplete="off"
                      value={form.honeypot}
                      onChange={(e) => setField('honeypot', e.target.value)}
                    />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        ref={firstFieldRef}
                        id="fullName"
                        label={fields.fullName.label}
                        placeholder={fields.fullName.placeholder}
                        value={form.fullName}
                        error={errors.fullName}
                        onChange={(v) => setField('fullName', v)}
                      />
                      <Field
                        id="business"
                        label={fields.business.label}
                        placeholder={fields.business.placeholder}
                        value={form.business}
                        error={errors.business}
                        onChange={(v) => setField('business', v)}
                      />
                      <Field
                        id="phone"
                        type="tel"
                        label={fields.phone.label}
                        placeholder={fields.phone.placeholder}
                        value={form.phone}
                        error={errors.phone}
                        onChange={(v) => setField('phone', v)}
                      />
                      <Field
                        id="email"
                        type="email"
                        label={fields.email.label}
                        placeholder={fields.email.placeholder}
                        value={form.email}
                        error={errors.email}
                        onChange={(v) => setField('email', v)}
                      />
                    </div>

                    <div>
                      <label htmlFor="volume" className="mb-1.5 block text-sm font-medium text-slate-300">
                        {fields.volume.label}
                      </label>
                      <select
                        id="volume"
                        value={form.volume}
                        onChange={(e) => setField('volume', e.target.value)}
                        className={`${fieldClass} ${
                          errors.volume ? 'border-rose-400/60' : 'border-white/[0.08]'
                        } ${form.volume ? 'text-slate-100' : 'text-slate-500'}`}
                      >
                        <option value="" disabled>
                          {fields.volume.placeholder}
                        </option>
                        {fields.volume.options.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#12121d] text-slate-100">
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors.volume && <p className="mt-1 text-xs text-rose-400">{errors.volume}</p>}
                    </div>

                    {submitError && (
                      <p
                        role="alert"
                        className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300"
                      >
                        {submitError}
                      </p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: submitting ? 1 : 1.02 }}
                      whileTap={{ scale: submitting ? 1 : 0.98 }}
                      className="shimmer group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-indigo-500 via-violet-500 to-indigo-500 px-6 py-3.5 text-base font-semibold text-white shadow-[0_12px_40px_-10px_rgba(99,102,241,0.8)] disabled:opacity-70"
                    >
                      {submitting ? 'שולח...' : modal.submit}
                      {!submitting && (
                        <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 sm:p-10 text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                    className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30"
                  >
                    <CheckCircle2 className="h-9 w-9 text-emerald-400" />
                  </motion.span>
                  <h2 className="text-2xl font-extrabold text-slate-100">{modal.success.title}</h2>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
                    {modal.success.text}
                  </p>
                  <button
                    onClick={close}
                    className="mt-7 rounded-2xl glass px-7 py-3 text-sm font-semibold text-slate-100 transition-colors hover:bg-white/[0.06]"
                  >
                    {modal.success.close}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const Field = forwardRef(function Field(
  { id, label, placeholder, value, error, onChange, type = 'text' },
  ref,
) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldClass} ${error ? 'border-rose-400/60' : 'border-white/[0.08]'}`}
      />
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  )
})
