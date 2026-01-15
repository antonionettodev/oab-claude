import type { CollectionConfig } from 'payload'

import { nameField } from '@/fields/name'
import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { textareaField } from '@/fields/textarea'
import { anyone } from '@/access/anyone'
import { trimHook } from '@/hooks/trim'

/**
 * Collection: Palestrantes
 *
 * Gerencia os palestrantes que podem participar de eventos e cursos.
 */
export const Speakers: CollectionConfig = {
  slug: 'speakers',
  labels: {
    singular: 'Palestrante',
    plural: 'Palestrantes',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Eventos',
    defaultColumns: ['name', 'professionalTitle', 'isActive', 'createdAt'],
    description: 'Palestrantes e apresentadores de eventos',
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      type: 'row',
      fields: [
        nameField({
          label: 'Nome Completo',
          placeholder: 'Ex: Dr. João Silva',
          required: true,
          width: '50%',
        }),
        {
          name: 'professionalTitle',
          type: 'text',
          label: 'Título Profissional',
          required: true,
          maxLength: 100,
          admin: {
            placeholder: 'Ex: Especialista em Direito Penal',
            width: '50%',
          },
          hooks: {
            beforeChange: [trimHook],
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'E-mail',
          admin: {
            placeholder: 'palestrante@email.com',
            width: '50%',
          },
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefone',
          maxLength: 20,
          admin: {
            placeholder: '(00) 00000-0000',
            width: '50%',
          },
        },
      ],
    },
    textareaField({
      name: 'bio',
      label: 'Biografia',
      placeholder: 'Biografia do palestrante...',
      description: 'Biografia completa para exibição no site',
      maxLength: 2000,
    }),
    textareaField({
      name: 'shortBio',
      label: 'Biografia Resumida',
      placeholder: 'Breve descrição do palestrante...',
      description: 'Texto curto para exibição em cartões e listagens',
      maxLength: 200,
    }),
    {
      type: 'group',
      label: 'Mídia',
      fields: [
        {
          name: 'photo',
          type: 'upload',
          label: 'Foto do Palestrante',
          relationTo: 'files',
          admin: {
            description: 'Foto profissional (recomendado: 400x400px)',
          },
        },
      ],
    },
    {
      type: 'group',
      label: 'Redes Sociais',
      admin: {
        description: 'Links para redes sociais e sites',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'linkedin',
              type: 'text',
              label: 'LinkedIn',
              maxLength: 200,
              admin: {
                placeholder: 'https://linkedin.com/in/usuario',
                width: '50%',
              },
            },
            {
              name: 'lattes',
              type: 'text',
              label: 'Currículo Lattes',
              maxLength: 200,
              admin: {
                placeholder: 'http://lattes.cnpq.br/...',
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'website',
          type: 'text',
          label: 'Site Pessoal',
          maxLength: 200,
          admin: {
            placeholder: 'https://www.seusite.com.br',
          },
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Ativo',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Palestrantes inativos não aparecem nas listagens',
      },
    },
    createdByField,
    editedByField,
  ],
}
