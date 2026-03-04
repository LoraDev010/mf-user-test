import React, { Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingScreen from '@/shared/components/LoadingScreen'
import { useSelectedUserStore } from '@/stores/selectedUserStore'
import type { User } from '@/types'

const UsersFeature = React.lazy(() => import('usersMfe/UsersFeature'))

export default function HomePage() {
  const navigate = useNavigate()
  const setUser = useSelectedUserStore((s) => s.setUser)

  function handleUserSelect(user: User) {
    setUser(user)
    navigate(`/users/${user.login.uuid}`)
  }

  return (
    <div className="bg-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <Suspense fallback={<LoadingScreen />}>
          <UsersFeature onUserSelect={handleUserSelect} />
        </Suspense>
      </div>
    </div>
  )
}
