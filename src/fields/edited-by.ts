import type { Field } from 'payload'

export const editedByField: Field = {
  name: 'editedBy',
  type: 'relationship',
  relationTo: 'users',
  label: 'Editado Por',
  admin: {
    readOnly: true,
    position: 'sidebar',
    description: 'Usuário que fez a última edição',
    condition: (data) => {
      return Boolean(data?.editedBy)
    },
  },
  hooks: {
    beforeChange: [
      ({ req, operation, value }) => {
        if (operation === 'update' && req.user) {
          return req.user.id
        }

        return value
      },
    ],
  },
}
