import { PostCard } from '@/components/posts/card'
import { PostsPagination } from '@/components/posts/pagination'
import { PostsCategoryFilters } from '@/components/posts/filters'
import { Category, Search } from '@/payload-types'
import { Newspaper } from 'lucide-react'
import { NewsletterCta } from '../newsletter/cta'

interface PostsGridSectionProps {
  posts: Search[]
  categories: Category[]
  currentCategory?: string
  currentSearch?: string
  pagination: {
    page: number
    totalPages: number
    totalDocs: number
  }
}

export function PostsGridSection({
  posts,
  categories,
  currentCategory,
  currentSearch,
  pagination,
}: PostsGridSectionProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 lg:pb-12">
      <PostsCategoryFilters
        categories={categories}
        totalDocs={pagination.totalDocs}
        currentSearch={currentSearch}
      />

      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-12">
              <PostsPagination currentPage={pagination.page} totalPages={pagination.totalPages} />
            </div>
          )}
        </>
      ) : (
        <EmptyState currentSearch={currentSearch} />
      )}

      <NewsletterCta />
    </div>
  )
}

function EmptyState({ currentSearch }: { currentSearch?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-12 text-center transition-colors">
      <Newspaper className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
      <h3 className="text-gray-900 dark:text-gray-100 mb-2">Nenhuma notícia encontrada</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {currentSearch
          ? `Não encontramos resultados para "${currentSearch}". Tente ajustar os filtros ou termo de busca.`
          : 'Tente ajustar os filtros ou termo de busca.'}
      </p>
    </div>
  )
}
