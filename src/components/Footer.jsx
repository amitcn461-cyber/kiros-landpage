import { brand, footer } from '../data/content'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/[0.06] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-right">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_20px_-4px_rgba(139,92,246,0.8)]">
              <span className="h-3 w-3 rounded-full bg-white/95" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              {brand.name}
              <span className="text-gradient"> {brand.suffix}</span>
            </span>
          </div>
          <p className="max-w-md text-sm text-slate-500">{footer.tagline}</p>
        </div>
        <p className="mt-8 text-center text-xs text-slate-600">
          © {year} {brand.name} {brand.suffix}. {footer.rights}
        </p>
      </div>
    </footer>
  )
}
