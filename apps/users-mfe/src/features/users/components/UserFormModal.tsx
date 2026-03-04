import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useUsersStore } from '../store/usersStore'
import type { User } from '../types'

interface Props {
  open: boolean
  editUser?: User | null
  onClose: () => void
}

interface FormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string
  gender: 'male' | 'female'
}

const empty: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  gender: 'male',
}

function calcAge(dateStr: string): number {
  const dob = new Date(dateStr)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

export default function UserFormModal({ open, editUser, onClose }: Props) {
  const addUser = useUsersStore((s) => s.addUser)
  const updateUser = useUsersStore((s) => s.updateUser)

  const [form, setForm] = useState<FormValues>(empty)
  const [errors, setErrors] = useState<Partial<FormValues>>({})

  useEffect(() => {
    if (editUser) {
      setForm({
        firstName: editUser.name.first,
        lastName: editUser.name.last,
        email: editUser.email,
        phone: editUser.phone,
        dob: editUser.dob?.date ? editUser.dob.date.split('T')[0] : '',
        gender: (editUser.gender as 'male' | 'female') || 'male',
      })
    } else {
      setForm(empty)
    }
    setErrors({})
  }, [editUser, open])

  function validate(): boolean {
    const e: Partial<FormValues> = {}
    if (!form.firstName.trim()) e.firstName = 'Requerido'
    if (!form.lastName.trim()) e.lastName = 'Requerido'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.phone.trim()) e.phone = 'Requerido'
    if (!form.dob) e.dob = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return

    const fullName = `${form.firstName} ${form.lastName}`
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1400CC&color=fff&size=128`

    const user: User = editUser
      ? {
          ...editUser,
          name: { ...editUser.name, first: form.firstName, last: form.lastName },
          email: form.email,
          phone: form.phone,
          gender: form.gender,
          dob: { date: form.dob, age: calcAge(form.dob) },
        }
      : {
          login: { uuid: crypto.randomUUID(), username: form.email },
          name: { title: form.gender === 'male' ? 'Mr' : 'Ms', first: form.firstName, last: form.lastName },
          email: form.email,
          phone: form.phone,
          gender: form.gender,
          dob: { date: form.dob, age: calcAge(form.dob) },
          location: { city: '', state: '', country: '' },
          picture: { large: avatarUrl, medium: avatarUrl, thumbnail: avatarUrl },
          nat: 'CO',
        }

    if (editUser) {
      updateUser(user)
    } else {
      addUser(user)
    }
    onClose()
  }

  function set(field: keyof FormValues) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={editUser ? 'Editar usuario' : 'Nuevo usuario'}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22 }}
            className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #1400CC 0%, #2a1de8 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h2 className="font-display font-bold text-white text-lg leading-none">
                  {editUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Accent bar */}
            <div className="h-1 bg-accent" />

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre" error={errors.firstName}>
                  <input
                    className={inputCls(!!errors.firstName)}
                    placeholder="Carlos"
                    value={form.firstName}
                    onChange={set('firstName')}
                  />
                </Field>
                <Field label="Apellido" error={errors.lastName}>
                  <input
                    className={inputCls(!!errors.lastName)}
                    placeholder="García"
                    value={form.lastName}
                    onChange={set('lastName')}
                  />
                </Field>
              </div>

              <Field label="Correo electrónico" error={errors.email}>
                <input
                  type="email"
                  className={inputCls(!!errors.email)}
                  placeholder="carlos@example.com"
                  value={form.email}
                  onChange={set('email')}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Teléfono" error={errors.phone}>
                  <input
                    className={inputCls(!!errors.phone)}
                    placeholder="+57 310 987 6543"
                    value={form.phone}
                    onChange={set('phone')}
                  />
                </Field>
                <Field label="Fecha de nacimiento" error={errors.dob}>
                  <input
                    type="date"
                    className={inputCls(!!errors.dob)}
                    value={form.dob}
                    onChange={set('dob')}
                  />
                </Field>
              </div>

              <Field label="Género">
                <select className={inputCls(false)} value={form.gender} onChange={set('gender')}>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </Field>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold font-body text-text-secondary border border-border hover:bg-surface-2 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold font-body text-white shadow-md hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #1400CC 0%, #2a1de8 100%)' }}
                >
                  {editUser ? 'Guardar cambios' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function inputCls(hasError: boolean) {
  return `w-full bg-white border ${hasError ? 'border-red-400 focus:ring-red-200' : 'border-border focus:border-brand focus:ring-brand/20'} rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 transition-all font-body`
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text-secondary font-body mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1 font-body">{error}</p>}
    </div>
  )
}
