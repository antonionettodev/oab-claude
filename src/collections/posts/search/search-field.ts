import { Field } from 'payload'

export const postSearchFields: Field[] = [
  {
    name: 'slug',
    type: 'text',
    admin: {
      readOnly: true,
    },
  },
  {
    label: 'Resumo',
    name: 'excerpt',
    type: 'textarea',
    admin: {
      readOnly: true,
    },
  },
  {
    label: 'Imagem Destacada',
    name: 'featuredImage',
    type: 'upload',
    relationTo: 'files',
    admin: {
      readOnly: true,
    },
  },
  {
    label: 'Publicado em',
    name: 'publishedAt',
    type: 'date',
    admin: {
      readOnly: true,
    },
  },
  {
    label: 'Categorias',
    name: 'categories',
    type: 'array',
    admin: {
      readOnly: true,
    },
    fields: [
      {
        label: 'ID da Categoria',
        name: 'categoryId',
        type: 'text',
      },
      {
        label: 'Título da Categoria',
        name: 'title',
        type: 'text',
      },
    ],
  },
  {
    label: 'Autores',
    name: 'populatedAuthors',
    type: 'array',
    admin: {
      readOnly: true,
    },
    fields: [
      {
        label: 'ID do Autor',
        name: 'authorId',
        type: 'text',
      },
      {
        label: 'Nome do Autor',
        name: 'name',
        type: 'text',
      },
    ],
  },
  {
    name: 'meta',
    type: 'group',
    admin: {
      readOnly: true,
    },
    fields: [
      {
        label: 'Título',
        name: 'title',
        type: 'text',
      },
      {
        label: 'Descrição',
        name: 'description',
        type: 'text',
      },
      {
        label: 'Imagem',
        name: 'image',
        type: 'upload',
        relationTo: 'files',
      },
    ],
  },
]
