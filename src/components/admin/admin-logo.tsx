import Image from 'next/image'
import React from 'react'

const Icon = () => {
  return (
    <Image src="/logo.svg" width={208} height={124} className="object-contain" alt="Logo OAB/SC" />
  )
}

export default Icon
