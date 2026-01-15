import RichText from '@/components/richtext'
import type { Post } from '@/payload-types'

interface PostContentProps {
  post: Post
}

export function PostContent({ post }: PostContentProps) {
  if (!post.content) return null

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8 transition-colors">
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300">
          <RichText data={post.content} />
        </div>
      </article>
    </div>
  )
}
