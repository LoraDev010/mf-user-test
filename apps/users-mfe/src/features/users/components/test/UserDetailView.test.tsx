import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import UserDetailView from '@/features/users/components/UserDetailView'
import type { User } from '@/features/users/types'

const baseUser: User = {
  login: { uuid: 'uuid-detail', username: 'jdoe' },
  name: { title: 'Mr', first: 'John', last: 'Doe' },
  email: 'john@test.com',
  phone: '+57 300 000 0000',
  gender: 'male',
  dob: { date: '1990-06-15T00:00:00.000Z', age: 34 },
  location: { city: 'Bogotá', state: 'DC', country: 'Colombia' },
  picture: { large: 'l.jpg', medium: 'm.jpg', thumbnail: 't.jpg' },
  nat: 'CO',
}

describe('UserDetailView', () => {
  it('renders key user details', () => {
    render(<UserDetailView user={baseUser} onBack={() => {}} />)
    expect(screen.getByText('Perfil de Usuario')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('34 años')).toBeInTheDocument()
    expect(screen.getByText('john@test.com')).toBeInTheDocument()
    expect(screen.getByText('+57 300 000 0000')).toBeInTheDocument()
    expect(screen.getByText('Masculino')).toBeInTheDocument()
    expect(screen.getByText('uuid-detail')).toBeInTheDocument()
    expect(screen.getByText(/1990/)).toBeInTheDocument()
  })

  it('renders placeholder date when dob is missing', () => {
    const userNoDob = { ...baseUser, dob: undefined }
    render(<UserDetailView user={userNoDob} onBack={() => {}} />)
    expect(screen.getByText('FECHA DE NACIMIENTO')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('calls onBack when clicking "Volver"', () => {
    const onBack = jest.fn()
    render(<UserDetailView user={baseUser} onBack={onBack} />)
    fireEvent.click(screen.getByRole('button', { name: 'Volver' }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})

