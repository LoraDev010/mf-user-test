declare module 'usersMfe/UsersFeature' {
  import type { ComponentType } from 'react'

  // Canonical User type — mirrors users-mfe/src/features/users/types.ts
  export interface User {
    login: { uuid: string; username: string }
    name: { title: string; first: string; last: string }
    email: string
    phone: string
    location: { city: string; state: string; country: string }
    picture: { large: string; medium: string; thumbnail: string }
    nat: string
    gender: string
    dob: { age: number; date: string }
  }

  export interface UsersFeatureProps {
    onUserSelect?: (user: User) => void
  }

  const UsersFeature: ComponentType<UsersFeatureProps>
  export default UsersFeature
}
