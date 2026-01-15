import { VerifyEmailClient } from './page.client'

type VerifyEmailPageProps = {
  params: Promise<{ token: string }>
}

export default async function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const { token } = await params

  return <VerifyEmailClient token={token} />
}
