import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from '@/shared/components/ErrorFallback'
import { useUsers } from '../hooks/useUsers'
import { useUsersStore } from '../store/usersStore'
import UserCard from './UserCard'
import type { User } from '../types'

interface Props {
  onUserSelect?: (user: User) => void
  onEdit?: (user: User) => void
  onNewUser?: () => void
  total: number
}

export default function UserList({ onUserSelect, onEdit, onNewUser, total }: Props) {
  const { users, isLoading } = useUsers()
  const localUsers = useUsersStore((s) => s.localUsers)
  const localUuids = new Set(localUsers.map((u) => u.login.uuid))

  if (isLoading) {
    return (
      <>
        <ListHeader total={0} onNewUser={onNewUser} loading />
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          aria-busy="true"
          aria-label="Cargando personas"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface rounded-2xl h-64 animate-pulse border border-border"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="h-1.5 bg-brand/20 rounded-t-2xl" />
            </div>
          ))}
        </div>
      </>
    )
  }

  if (!users.length) {
    return (
      <>
        <ListHeader total={total} onNewUser={onNewUser} />
        <div className="text-center py-28">
          <p className="text-text-secondary font-body text-sm">No se encontraron personas con esa búsqueda.</p>
          <p className="text-brand font-body text-xs mt-1">Intenta con otro nombre, correo o país.</p>
        </div>
      </>
    )
  }

  return (
    <ErrorBoundary FallbackComponent={({ error }) => <ErrorFallback error={error} />}>
      <ListHeader total={total} onNewUser={onNewUser} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.map((user, i) => (
          <UserCard
            key={user.login.uuid}
            user={user}
            index={i}
            onSelect={onUserSelect}
            onEdit={onEdit}
            isLocal={localUuids.has(user.login.uuid)}
          />
        ))}
      </div>
    </ErrorBoundary>
  )
}

function ListHeader({
  total,
  onNewUser,
  loading,
}: {
  total: number
  onNewUser?: () => void
  loading?: boolean
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm px-6 py-5 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand/10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1400CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <h2 className="font-display font-bold text-lg text-text-primary leading-none">Listado de Usuarios</h2>
          {!loading && (
            <p className="text-brand text-xs font-body mt-0.5">{total} usuarios registrados</p>
          )}
        </div>
      </div>
      <button
        onClick={onNewUser}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold font-body text-white transition-all hover:opacity-90 active:scale-95 shadow-md"
        style={{ background: 'linear-gradient(135deg, #1400CC 0%, #2a1de8 100%)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nuevo Usuario
      </button>
    </div>
  )
}

