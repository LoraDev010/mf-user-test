import type { User } from '../types'

interface InfoItem {
  label: string
  value: string
  accent?: boolean
  mono?: boolean
}

function InfoCard({
  title,
  items,
}: {
  title: string
  items: InfoItem[]
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="h-1 bg-brand" />
      <div className="p-5">
        <h3 className="font-display font-bold text-sm text-text-primary mb-4">{title}</h3>
        <ul className="space-y-3">
          {items.map(({ label, value, accent, mono }) => (
            <li key={label} className="bg-white rounded-xl border border-border px-4 py-3">
              <p className="text-[10px] font-semibold text-text-secondary font-body uppercase tracking-wide mb-1">{label}</p>
              <p
                className={`text-sm font-body break-all ${
                  accent ? 'text-brand font-semibold' : mono ? 'text-text-secondary font-mono text-[11px]' : 'text-text-primary'
                }`}
              >
                {value}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function UserDetailView({ user, onBack }: { user: User; onBack: () => void }) {
  const fullName = `${user.name.first} ${user.name.last}`
  const dob = user.dob?.date
    ? new Date(user.dob.date).toLocaleDateString('es-CO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—'

  return (
    <div>
      <div
        className="pt-8 pb-16 px-6 relative"
        style={{ background: 'linear-gradient(135deg, #1400CC 0%, #2a1de8 100%)' }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h1 className="font-display font-bold text-white text-xl">Perfil de Usuario</h1>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-brand text-sm font-semibold font-body hover:bg-white/90 transition-colors shadow-md"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Volver
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 -mt-16 pb-16">
        <div className="relative z-10 bg-surface rounded-2xl border border-border shadow-md p-6 mb-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-brand/20 shadow-md shrink-0">
            <img src={user.picture.large} alt={fullName} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-text-primary leading-none">{fullName}</h2>
            <p className="text-text-secondary text-sm font-body mt-1.5">{user.dob?.age} años</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <InfoCard
            title="Información de Contacto"
            items={[
              { label: 'EMAIL', value: user.email, accent: true },
              { label: 'TELÉFONO', value: user.phone, accent: true },
              { label: 'FECHA DE NACIMIENTO', value: dob },
            ]}
          />
          <InfoCard
            title="Información Personal"
            items={[
              { label: 'NOMBRE', value: user.name.first },
              { label: 'APELLIDO', value: user.name.last },
              { label: 'GÉNERO', value: user.gender === 'male' ? 'Masculino' : 'Femenino' },
            ]}
          />
          <InfoCard
            title="Información del Sistema"
            items={[
              { label: 'ID DEL USUARIO', value: user.login.uuid, mono: true },
              { label: 'ALMACENAMIENTO', value: 'Los datos se guardan en localStorage del navegador' },
              { label: 'PRIVACIDAD', value: 'Todos los datos permanecen en tu navegador' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
