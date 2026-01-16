import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { RegistrationStatus } from '@/components/events/registration-status'

interface PageProps {
  params: Promise<{
    slug: string
    registrationId: string
  }>
  searchParams: Promise<{
    status?: string
  }>
}

export default async function RegistrationPage({ params, searchParams }: PageProps) {
  const { slug, registrationId } = await params
  const { status } = await searchParams

  const payload = await getPayload({ config })

  // Fetch the registration with event and payment data
  const registration = await payload.findByID({
    collection: 'registrations',
    id: registrationId,
    depth: 2,
  })

  if (!registration) {
    notFound()
  }

  // Verify the registration belongs to this event
  const event = typeof registration.event === 'object' ? registration.event : null

  if (!event || event.slug !== slug) {
    notFound()
  }

  // Fetch payment data if exists
  let payment = null
  if (registration.payment) {
    const paymentId =
      typeof registration.payment === 'object' ? registration.payment.id : registration.payment
    payment = await payload.findByID({
      collection: 'payments',
      id: paymentId,
      depth: 0,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <RegistrationStatus
        registration={registration}
        event={event}
        payment={payment}
        initialStatus={status}
      />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params

  const payload = await getPayload({ config })

  const event = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!event.docs[0]) {
    return { title: 'Inscrição não encontrada' }
  }

  return {
    title: `Inscrição - ${event.docs[0].title}`,
    description: `Confirmação de inscrição para ${event.docs[0].title}`,
  }
}
