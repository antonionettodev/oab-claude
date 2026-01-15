'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronRight,
  Calendar,
  User,
  Clock,
  Tag,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link2,
} from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { formatDateFull } from '@/lib/format-date'
import type { Post } from '@/payload-types'
import { formatAuthors } from '@/lib/format-authors'

interface PostHeaderProps {
  post: Post
}

export function PostHeader({ post }: PostHeaderProps) {
  const firstCategory =
    post.categories?.[0] && typeof post.categories[0] === 'object' ? post.categories[0] : null

  const authorsText = formatAuthors(post.populatedAuthors ?? []) || 'OAB/SC'

  const imageUrl =
    typeof post.featuredImage === 'object' && post.featuredImage !== null
      ? post.featuredImage.url
      : null

  const imageAlt =
    typeof post.featuredImage === 'object' && post.featuredImage !== null
      ? post.featuredImage.alt || post.title
      : post.title

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      '_blank',
      'width=600,height=400',
    )
  }

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`,
      '_blank',
      'width=600,height=400',
    )
  }

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      '_blank',
      'width=600,height=400',
    )
  }

  const shareByEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(post.title)}&body=Confira esta notícia: ${encodeURIComponent(currentUrl)}`
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      toast.success('Link copiado para a área de transferência!')
    } catch {
      toast.error('Erro ao copiar link')
    }
  }

  return (
    <>
      <div className="bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="text-white/80 hover:text-white cursor-pointer">
                    Início
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/60">
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/posts" className="text-white/80 hover:text-white cursor-pointer">
                    Notícias
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/60">
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white line-clamp-1 max-w-[200px]">
                  {post.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Link
            href="/posts"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para notícias
          </Link>

          {firstCategory && (
            <div className="mb-4">
              <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
                <Tag className="w-3 h-3 mr-1" />
                {firstCategory.title}
              </Badge>
            </div>
          )}

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            {post.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDateFull(post.publishedAt)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{authorsText}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime} min de leitura</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {imageUrl && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden mb-8 transition-colors">
            <div className="relative h-64 md:h-96 overflow-hidden">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        )}

        {post.excerpt && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6 mb-8 transition-colors">
            <p className="text-gray-900 dark:text-gray-100 text-lg leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 mb-8 transition-colors">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-gray-100">Compartilhar:</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={shareOnFacebook}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1565D8] transition-all"
              >
                <Facebook className="w-4 h-4" />
                <span className="hidden sm:inline">Facebook</span>
              </button>
              <button
                onClick={shareOnTwitter}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A8CD8] transition-all"
              >
                <Twitter className="w-4 h-4" />
                <span className="hidden sm:inline">Twitter</span>
              </button>
              <button
                onClick={shareOnLinkedIn}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-all"
              >
                <Linkedin className="w-4 h-4" />
                <span className="hidden sm:inline">LinkedIn</span>
              </button>
              <button
                onClick={shareByEmail}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">E-mail</span>
              </button>
              <button
                onClick={copyLink}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
              >
                <Link2 className="w-4 h-4" />
                <span className="hidden sm:inline">Copiar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
