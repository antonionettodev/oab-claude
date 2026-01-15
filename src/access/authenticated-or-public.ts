import type { Access } from 'payload'

export const authenticatedOrPublic: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    isPublic: {
      equals: true,
    },
  }
}
