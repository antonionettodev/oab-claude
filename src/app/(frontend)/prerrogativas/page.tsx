import { PrerogativesHeader } from '@/components/prerogatives/header'
import { PrerogativesEmergencyBanner } from '@/components/prerogatives/emergency-banner'
import { PrerogativesAboutSection } from '@/components/prerogatives/about'
import { PrerogativesQuickActions } from '@/components/prerogatives/quick-actions'
import { PrerogativesList } from '@/components/prerogatives/list'
import { PrerogativesAlert } from '@/components/prerogatives/alert'
import { PrerogativesStats } from '@/components/prerogatives/stats'
import { PrerogativesCommission } from '@/components/prerogatives/commission'

export default function PrerogativesPage() {
  return (
    <main className="min-h-screen bg-background">
      <PrerogativesHeader />
      <PrerogativesEmergencyBanner />

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        <PrerogativesAboutSection />
        <PrerogativesQuickActions />
        <PrerogativesList />
        <PrerogativesAlert />
        <PrerogativesStats />
        <PrerogativesCommission />
      </div>
    </main>
  )
}
