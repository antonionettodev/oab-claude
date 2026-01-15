import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, Tag, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format-date'
import { Search, File } from '@/payload-types'

interface PostCardProps {
  post: Search
  index: number
}

export function PostCard({ post, index }: PostCardProps) {
  const formattedDate = post.publishedAt ? formatDate(post.publishedAt) : ''

  const firstCategory = post.categories?.[0]?.title || null

  const featuredImage = post.featuredImage
  const imageUrl =
    typeof featuredImage === 'object' && featuredImage !== null
      ? (featuredImage as File).url
      : '/placeholder.svg'

  const imageAlt =
    typeof featuredImage === 'object' && featuredImage !== null
      ? (featuredImage as File).alt || post.title
      : post.title

  const firstAuthor = post.populatedAuthors?.[0]?.name || 'OAB/SC'

  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:border-[#0066cc] dark:hover:border-blue-500 transition-all group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl || '/placeholder.svg'}
          alt={imageAlt || post.title || 'Imagem da notícia'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {firstCategory && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-[#0066cc] text-white hover:bg-[#0052a3]">
              <Tag className="w-3 h-3 mr-1" />
              {firstCategory}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-[#0066cc] dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

        <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400">
          {formattedDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            <span>{firstAuthor}</span>
          </div>
        </div>

        <Link
          href={`/posts/${post.slug}`}
          className="mt-4 w-full bg-gray-100 dark:bg-gray-700 text-[#0066cc] dark:text-blue-400 py-2 px-4 rounded-lg hover:bg-[#0066cc] hover:text-white dark:hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group-hover:bg-[#0066cc] group-hover:text-white"
        >
          Ler mais
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  )
}
