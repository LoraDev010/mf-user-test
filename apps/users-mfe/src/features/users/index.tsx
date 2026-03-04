/**
 * UsersFeature — Micro Frontend public API
 *
 * This module is exposed via Module Federation as './UsersFeature'.
 * It is self-contained: provides its own QueryClient and Zustand store.
 *
 * Props:
 *   onUserSelect?: (user: User) => void  — callback for cross-app communication
 *
 * Also dispatches window CustomEvent 'user:selected' with { detail: User }
 * for host applications that prefer an event-bus pattern.
 */
import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib/queryClient'
import UsersPage from './pages/UsersPage'
import type { User } from './types'

export type { User }

export interface UsersFeatureProps {
  onUserSelect?: (user: User) => void
}

const UsersFeature: React.FC<UsersFeatureProps> = ({ onUserSelect }) => (
  <QueryClientProvider client={queryClient}>
    <UsersPage onUserSelect={onUserSelect} />
  </QueryClientProvider>
)

export default UsersFeature
