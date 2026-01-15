import Image from 'next/image'
import React from 'react'

const Icon = () => {
  return (
    <Image src="/logo.svg" width={54} height={32} className="object-contain" alt="Ícone OAB/SC" />
  )
}

export default Icon
