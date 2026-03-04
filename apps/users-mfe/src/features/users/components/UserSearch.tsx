import { useEffect, useState } from 'react'
import { useUsersStore } from '../store/usersStore'
import { useDebounce } from '@/shared/hooks/useDebounce'

export default function UserSearch() {
  const setSearch = useUsersStore((s) => s.setSearch)
  const [value, setValue] = useState('')
  const debounced = useDebounce(value, 300)

  useEffect(() => {
    setSearch(debounced)
  }, [debounced, setSearch])

  return (
    <div className="relative">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 text-brand w-4 h-4 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar por nombre, correo o país…"
        className="w-full bg-white border border-border rounded-xl pl-11 pr-4 py-3.5 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all font-body shadow-sm"
        aria-label="Buscar personas"
      />
    </div>
  )
}
