import type { User } from '../types'
import styles from './UserDetailView.module.scss'

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
    <div className={styles.infoCard}>
      <div className={styles.infoCardBar} />
      <div className={styles.infoCardBody}>
        <h3 className={styles.infoCardTitle}>{title}</h3>
        <ul className={styles.infoItemList}>
          {items.map(({ label, value, accent, mono }) => (
            <li key={label} className={styles.infoItem}>
              <p className={styles.infoItemLabel}>{label}</p>
              <p
                className={[
                  styles.infoItemValue,
                  accent ? styles.accent : mono ? styles.mono : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
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
        timeZone: 'UTC',
      })
    : '—'

  return (
    <div>
      <div className={styles.heroHeader}>
        <div className={styles.accentBar} />
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h1 className={styles.headerTitle}>Perfil de Usuario</h1>
          </div>
          <button onClick={onBack} className={styles.backBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Volver
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.profileCard}>
          <div className={styles.profileAvatar}>
            <img src={user.picture.large} alt={fullName} className={styles.profileAvatarImg} />
          </div>
          <div>
            <h2 className={styles.profileName}>{fullName}</h2>
            <p className={styles.profileAge}>{user.dob?.age} años</p>
          </div>
        </div>

        <div className={styles.infoGrid}>
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
