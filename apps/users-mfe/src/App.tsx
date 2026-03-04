import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib/queryClient'
import UsersPage from '@/features/users/pages/UsersPage'
import UserDetailView from '@/features/users/components/UserDetailView'
import type { User } from '@/features/users/types'

export default function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  function handleUserSelect(user: User) {
    setSelectedUser(user)
    window.dispatchEvent(new CustomEvent('user:selected', { detail: user }))
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-bg font-body text-text-primary">
        {/* Domina-style top bar */}
        <header className="bg-white border-b border-border shadow-sm">
          <div className="mx-auto max-w-7xl px-6 h-16 flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8.5L6.5 12L13 4" stroke="#FFD400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="font-display font-bold text-xl tracking-tight text-brand">
              Domina<span className="text-text-secondary font-normal text-sm ml-1.5">People</span>
            </span>
          </div>
        </header>

        {selectedUser ? (
          <UserDetailView user={selectedUser} onBack={() => setSelectedUser(null)} />
        ) : (
          <>
            {/* Hero */}
            <div className="relative bg-brand overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle at 20% 50%, #ffffff 1px, transparent 1px)',
                  backgroundSize: '60px 60px',
                }}
              />
              <div className="relative mx-auto max-w-7xl px-6 pt-10 pb-20">
                <p className="text-accent font-display font-semibold text-xs uppercase tracking-widest mb-2">
                  Directorio de Personas
                </p>
                <h1 className="font-display text-4xl font-extrabold text-white">Explora el equipo</h1>
                <p className="text-blue-200 font-body mt-2 text-base max-w-lg">
                  100 contactos globales. Busca y filtra por nombre, correo o país.
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12">
                  <path d="M0 64H1440V32C1200 64 960 64 720 32C480 0 240 0 0 32V64Z" fill="white" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <main className="mx-auto max-w-7xl px-6 py-10">
              <UsersPage onUserSelect={handleUserSelect} />
            </main>
          </>
        )}
      </div>
    </QueryClientProvider>
  )
}
