import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// `isConfigured` lets the UI fail gracefully (and log a clear message)
// if the .env.local values haven't been filled in yet.
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[KIROS] Supabase לא מוגדר. מלא את VITE_SUPABASE_URL ו-VITE_SUPABASE_ANON_KEY בקובץ .env.local והפעל מחדש את השרת.',
  )
}
