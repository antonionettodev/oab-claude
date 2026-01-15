'use client'

import { useState } from 'react'
import { Building2, Users, Newspaper, DoorOpen, MessageSquare } from 'lucide-react'
import type { Subsection, SubsectionMember, SubsectionRoom, Post } from '@/payload-types'
import { SubsectionAboutTab } from './about-tab'
import { SubsectionDirectoryTab } from './directory-tab'
import { SubsectionContactTab } from './contact-tab'
import { SubsectionRelatedPosts } from './related-posts'
import { SubsectionEmptyTab } from './empty-tab'
import { SubsectionRoomTab } from './room-tab'

interface SubsectionTabsProps {
  subsection: Subsection
  members: SubsectionMember[]
  rooms: SubsectionRoom[]
  posts: Post[]
}

type TabKey = 'sobre' | 'diretoria' | 'noticias' | 'salas' | 'contato'

const tabs = [
  { key: 'sobre' as TabKey, label: 'Sobre', icon: Building2 },
  { key: 'diretoria' as TabKey, label: 'Diretoria', icon: Users },
  { key: 'noticias' as TabKey, label: 'Notícias', icon: Newspaper },
  { key: 'salas' as TabKey, label: 'Salas', icon: DoorOpen },
  { key: 'contato' as TabKey, label: 'Contato', icon: MessageSquare },
]

export function SubsectionTabs({ subsection, members, posts, rooms }: SubsectionTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('sobre')

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {activeTab === 'sobre' && <SubsectionAboutTab subsection={subsection} />}
        {activeTab === 'diretoria' && <SubsectionDirectoryTab members={members} />}
        {activeTab === 'noticias' && (
          <SubsectionRelatedPosts posts={posts} subsectionTitle={subsection.title} />
        )}
        {activeTab === 'salas' && <SubsectionRoomTab rooms={rooms} />}
        {activeTab === 'contato' && <SubsectionContactTab subsection={subsection} />}
      </div>
    </>
  )
}
