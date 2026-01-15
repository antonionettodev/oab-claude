import Link from 'next/link'
import { Newspaper, ChevronRight } from 'lucide-react'

export function PostsCta() {
  return (
    <section className="my-16 px-4">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-8 text-center transition-colors shadow-sm">
        <Newspaper className="w-12 h-12 text-[#0066cc] dark:text-blue-400 mx-auto mb-4" />

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Fique por dentro
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Confira todas as notícias da OAB Santa Catarina
        </p>

        <Link
          href="/posts"
          className="bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          Ver todas as notícias
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  )
}
