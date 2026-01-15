import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format-date'
import type { Post, File, Category } from '@/payload-types'

type Props = {
  post: Post
}

export function RelatedCard({ post }: Props) {
  const image = post.featuredImage as File | null
  const category = post.categories?.[0] as Category | null

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:border-[#0066cc] dark:hover:border-blue-500 transition-all cursor-pointer group block"
    >
      <div className="relative h-40 overflow-hidden">
        <Image
          src={image?.url || '/placeholder.svg'}
          alt={image?.alt || post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {category && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-[#0066cc] text-white hover:bg-[#0052a3] text-xs">
              <Tag className="w-3 h-3 mr-1" />
              {category.title}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-[#0066cc] dark:group-hover:text-blue-400 transition-colors text-base">
          {post.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 line-clamp-2">{post.excerpt}</p>

        {post.publishedAt && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
