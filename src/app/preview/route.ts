import type { CollectionSlug, PayloadRequest } from 'payload'
import { getPayload } from 'payload'

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

import configPromise from '@payload-config'

export async function GET(req: NextRequest): Promise<Response> {
  const payload = await getPayload({ config: configPromise })

  const { searchParams } = new URL(req.url)

  const path = searchParams.get('path')
  const collection = searchParams.get('collection') as CollectionSlug
  const slug = searchParams.get('slug')
  const previewSecret = searchParams.get('previewSecret')

  if (previewSecret !== process.env.PAYLOAD_PREVIEW_SECRET) {
    return new Response('Você não tem permissão para acessar essa página', { status: 403 })
  }

  if (!path || !collection || !slug) {
    return new Response('Params insuficientes', { status: 404 })
  }

  if (!path.startsWith('/')) {
    return new Response('Esse endpoint só está disponível para previews relativos', { status: 500 })
  }

  let user

  try {
    user = await payload.auth({
      req: req as unknown as PayloadRequest,
      headers: req.headers,
    })
  } catch (error) {
    payload.logger.error({ err: error }, 'Erro verificando o token')
    return new Response('Você não tem permissão para acessar essa página', { status: 403 })
  }

  const draft = await draftMode()

  if (!user) {
    draft.disable()
    return new Response('Você não tem permissão para acessar essa página', { status: 403 })
  }

  draft.enable()

  redirect(path)
}
