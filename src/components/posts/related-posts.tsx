import { RelatedCard } from './related-card'
import type { Post } from '@/payload-types'

type Props = {
  posts: Post[]
}

export function RelatedPosts({ posts }: Props) {
  if (!posts || posts.length === 0) return null

  return (
    <div className="max-w-4xl mx-auto px-4 mb-8">
      <h2 className="text-gray-900 dark:text-gray-100 mb-6">Notícias relacionadas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <RelatedCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
