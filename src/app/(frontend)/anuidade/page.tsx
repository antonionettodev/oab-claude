'use client'

import { AnnuityHeader } from '@/components/annuity/header'
import { AnnuityForm } from '@/components/annuity/form'
import { AnnuityInfoCards } from '@/components/annuity/info-cards'
import { AnnuityAlert } from '@/components/annuity/alert'
import { AnnuityRenegotiation } from '@/components/annuity/renegotiation'
import { AnnuityFaq } from '@/components/annuity/faq'

export default function AnnuityPage() {
  const handleNavigate = (section: string) => {
    console.log('Navigate to:', section)
  }

  return (
    <div className="min-h-screen bg-background">
      <AnnuityHeader onNavigate={handleNavigate} />

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <AnnuityForm />
        <AnnuityInfoCards />
        <AnnuityAlert />
        <AnnuityRenegotiation onNavigate={handleNavigate} />
        <AnnuityFaq />
      </main>
    </div>
  )
}
