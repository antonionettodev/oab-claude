import { Field } from 'payload'

export const createdByField: Field = {
  name: 'createdBy',
  type: 'relationship',
  relationTo: 'users',
  label: 'Criado Por',
  admin: {
    readOnly: true,
    position: 'sidebar',
    description: 'Usuário que criou este registro',
    condition: (data) => {
      return Boolean(data?.createdBy)
    },
  },
  hooks: {
    beforeChange: [
      ({ req, operation, value }) => {
        if (operation === 'create' && req.user) {
          return req.user.id
        }
        return value
      },
    ],
  },
}
