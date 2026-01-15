'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

type NewsletterInput = {
  name: string
  email: string
  phone?: string
}

type NewsletterResponse = {
  success: boolean
  message: string
}

export async function subscribeToNewsletter(data: NewsletterInput): Promise<NewsletterResponse> {
  try {
    const payload = await getPayload({ config: configPromise })

    const existing = await payload.find({
      collection: 'newsletter',
      where: {
        email: { equals: data.email },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return {
        success: false,
        message: 'Este e-mail já está cadastrado na nossa newsletter.',
      }
    }

    await payload.create({
      collection: 'newsletter',
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        status: 'active',
      },
    })

    return {
      success: true,
      message: 'Inscrição realizada com sucesso!',
    }
  } catch (error) {
    console.error('Erro ao inscrever na newsletter:', error)

    if (error instanceof Error && error.message.includes('duplicate')) {
      return {
        success: false,
        message: 'Este e-mail já está cadastrado na nossa newsletter.',
      }
    }

    return {
      success: false,
      message: 'Erro ao realizar inscrição. Tente novamente mais tarde.',
    }
  }
}
