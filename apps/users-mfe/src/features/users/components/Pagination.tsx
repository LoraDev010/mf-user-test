import { motion } from 'motion/react'
import { useUsersStore } from '../store/usersStore'

interface Props {
  totalPages: number
  total: number
}

export default function Pagination({ totalPages, total }: Props) {
  const { page, pageSize, setPage } = useUsersStore()

  if (totalPages <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const pages = buildPageRange(page, totalPages)

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <p className="text-text-secondary text-xs font-body">
        Mostrando{' '}
        <span className="text-brand font-semibold">
          {start}–{end}
        </span>{' '}
        de <span className="text-text-primary font-semibold">{total}</span> personas
      </p>
      <nav className="flex items-center gap-1.5" aria-label="Paginación">
        <PageBtn onClick={() => setPage(page - 1)} disabled={page === 1}>
          ←
        </PageBtn>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="text-text-secondary px-1 text-sm">
              …
            </span>
          ) : (
            <motion.button
              key={p}
              onClick={() => setPage(p as number)}
              whileTap={{ scale: 0.88 }}
              className={`w-9 h-9 rounded-xl text-xs font-display font-semibold transition-all ${
                p === page
                  ? 'bg-brand text-white shadow-md'
                  : 'text-text-secondary border border-border bg-white hover:border-brand hover:text-brand'
              }`}
            >
              {p}
            </motion.button>
          ),
        )}
        <PageBtn onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          →
        </PageBtn>
      </nav>

      {/* Domina-style yellow accent bar under pagination */}
      <div className="w-16 h-0.5 bg-accent rounded-full" />
    </div>
  )
}

function PageBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3 h-9 rounded-xl text-sm font-body text-text-secondary border border-border bg-white hover:border-brand hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  )
}

function buildPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}
