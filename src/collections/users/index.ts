import type { CollectionConfig } from 'payload'

import { forgotPasswordTemplate } from '@/emails/forgot-password'
import { verifyEmailTemplate } from '@/emails/verify-email'
import { nameField } from '@/fields/name'
import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'

import { getServerSideURL } from '@/lib/get-urls'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Usuário',
    plural: 'Usuários',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Gestão de Pessoas',
  },
  auth: {
    verify: {
      generateEmailHTML: ({ user, token }) => {
        const verifyUrl = `${getServerSideURL()}/admin/verify/${token}`

        return verifyEmailTemplate({
          name: user.name,
          email: user.email,
          verifyUrl,
        })
      },
    },
    forgotPassword: {
      generateEmailHTML: ({ user, token } = {}) => {
        const resetUrl = `${getServerSideURL()}/admin/reset/${token}`

        return forgotPasswordTemplate({
          name: user.name,
          email: user.email,
          resetUrl,
        })
      },
    },
  },
  fields: [nameField(), createdByField, editedByField],
}
