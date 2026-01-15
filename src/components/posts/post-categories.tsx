import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Category } from '@/payload-types'

type Props = {
  categories: Category[]
}

export function PostCategories({ categories }: Props) {
  if (!categories || categories.length === 0) return null

  return (
    <section className="my-10 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-colors">
        <h3 className="text-gray-900 dark:text-gray-100 mb-4">Categorias relacionadas</h3>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link key={category.id} href={`/posts?category=${category.title}`}>
              <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-[#0066cc] hover:text-white dark:hover:bg-blue-600 cursor-pointer transition-all">
                {category.title}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
