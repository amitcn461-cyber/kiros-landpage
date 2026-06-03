import { createContext, useContext, useState, useCallback } from 'react'

const LeadModalContext = createContext(null)

export function LeadModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <LeadModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </LeadModalContext.Provider>
  )
}

export function useLeadModal() {
  const ctx = useContext(LeadModalContext)
  if (!ctx) throw new Error('useLeadModal must be used within LeadModalProvider')
  return ctx
}
