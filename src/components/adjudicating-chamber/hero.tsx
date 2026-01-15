import Link from 'next/link'
import { Scale } from 'lucide-react'

export function AdjudicatingChamberHeroSection() {
  return (
    <div className="bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="hover:underline">
                Início
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-300">Câmara Julgadora</li>
          </ol>
        </nav>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-bold">Câmara Julgadora</h1>
        </div>

        <p className="text-lg text-gray-100 max-w-3xl">
          Conheça a composição das Câmaras Julgadoras da OAB/SC.
        </p>
      </div>
    </div>
  )
}
