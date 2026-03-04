import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-bg font-body text-text-primary">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50" style={{ background: 'linear-gradient(135deg, #1400CC 0%, #2a1de8 100%)' }}>
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <div className="leading-tight">
              <span className="font-display font-bold text-lg text-white tracking-tight block leading-none">
                CRUD de Usuarios
              </span>
              <span className="text-white/50 text-xs font-body">Domina · People</span>
            </div>
          </Link>

          {/* Home icon */}
          <Link
            to="/"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            aria-label="Inicio"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
              <path d="M9 21V12h6v9" />
            </svg>
          </Link>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
