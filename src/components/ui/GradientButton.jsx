import { motion } from 'framer-motion'

const base =
  'relative inline-flex items-center justify-center gap-2 rounded-2xl font-semibold tracking-tight transition-colors duration-300 focus-visible:outline-none disabled:opacity-60 disabled:cursor-not-allowed'

const sizes = {
  md: 'px-6 py-3 text-[15px]',
  lg: 'px-8 py-4 text-base sm:text-lg',
}

export default function GradientButton({
  children,
  variant = 'primary',
  size = 'lg',
  className = '',
  ...props
}) {
  const isPrimary = variant === 'primary'

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`${base} ${sizes[size]} ${
        isPrimary
          ? 'shimmer text-white bg-gradient-to-l from-indigo-500 via-violet-500 to-indigo-500 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.7)] hover:shadow-[0_14px_50px_-8px_rgba(139,92,246,0.85)]'
          : 'glass text-slate-100 hover:border-violet-400/40 hover:bg-white/[0.06]'
      } ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
