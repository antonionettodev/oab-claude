'use client'

import { CAAHeader } from '@/components/caa/header'
import { CAAAboutSection } from '@/components/caa/about'
import { CAAServicesGrid } from '@/components/caa/services'
import { CAAAidCards } from '@/components/caa/aid-cards'
import { CAAHealthPlans } from '@/components/caa/health-plans'
import { CAAPartnerships } from '@/components/caa/partnerships'
import { CAAStats } from '@/components/caa/stats'
import { CAAContactCards } from '@/components/caa/contact-cards'

export default function CAAPage() {
  const handleNavigate = (section: string) => {
    console.log('Navigate to:', section)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <CAAHeader />

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        <CAAAboutSection />
        <CAAServicesGrid onNavigate={handleNavigate} />
        <CAAAidCards />
        <CAAHealthPlans onNavigate={handleNavigate} />
        <CAAPartnerships onNavigate={handleNavigate} />
        <CAAStats />
        <CAAContactCards />
      </div>
    </div>
  )
}
