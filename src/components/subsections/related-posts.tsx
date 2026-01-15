import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Tag, Newspaper } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format-date'
import type { Post, File, Category } from '@/payload-types'

type Props = {
  posts: Post[]
  subsectionTitle: string
}

export function SubsectionRelatedPosts({ posts, subsectionTitle }: Props) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <Newspaper className="w-8 h-8 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Nenhuma notícia encontrada
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Ainda não há notícias publicadas para a Subseção de {subsectionTitle}.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Notícias da Subseção
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const image = post.featuredImage as File | null
          const category = post.categories?.[0] as Category | null

          return (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:border-[#0066cc] dark:hover:border-blue-500 transition-all cursor-pointer group block"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={image?.url || '/placeholder.svg'}
                  alt={image?.alt || post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {category && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-[#0066cc] text-white hover:bg-[#0052a3]">
                      <Tag className="w-3 h-3 mr-1" />
                      {category.title}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-[#0066cc] dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {post.publishedAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
