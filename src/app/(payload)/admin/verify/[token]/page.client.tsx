'use client'

import { useEffect, useState } from 'react'
import { MinimalTemplate } from '@payloadcms/next/templates'
import { Button } from '@payloadcms/ui'
import Link from 'next/link'
import Image from 'next/image'

type VerifyEmailClientProps = {
  token: string
}

type VerificationStatus = 'loading' | 'success' | 'error'

export function VerifyEmailClient({ token }: VerifyEmailClientProps) {
  const [status, setStatus] = useState<VerificationStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    async function verifyEmail() {
      try {
        const res = await fetch(`/api/users/verify/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (res.ok) {
          setStatus('success')
        } else {
          const data = await res.json()
          setErrorMessage(data.errors?.[0]?.message || 'Token inválido ou expirado.')
          setStatus('error')
        }
      } catch {
        setErrorMessage('Erro ao conectar com o servidor. Tente novamente.')
        setStatus('error')
      }
    }

    verifyEmail()
  }, [token])

  return (
    <MinimalTemplate>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        <Link href="/" style={{ flexShrink: 0 }}>
          <Image src="/logo.svg" alt="OAB Santa Catarina" width={208} height={124} />
        </Link>

        <div>
          <h1 style={{ marginTop: 0 }}>Verificação de Email</h1>

          {status === 'loading' && (
            <div className="loading">
              <p>Verificando seu email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="success">
              <p>Seu email foi verificado com sucesso!</p>
              <p>Agora você pode fazer login e acessar o painel administrativo.</p>
              <Button el="link" Link={Link} url="/admin/login">
                Ir para Login
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="error">
              <p>{errorMessage}</p>
              <Button el="link" Link={Link} url="/admin/login" buttonStyle="secondary">
                Ir para Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </MinimalTemplate>
  )
}
