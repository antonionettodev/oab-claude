'use client'

import { cn } from '@/lib/utils'
import React, { useEffect, useRef } from 'react'

import type { Props as FileProps } from '../types'

import { getFileUrl } from '@/lib/get-file-url'

export const VideoFile: React.FC<FileProps> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {})
    }
  }, [])

  if (resource && typeof resource === 'object') {
    const { filename } = resource

    return (
      <video
        autoPlay
        className={cn(videoClassName)}
        controls={false}
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        <source src={getFileUrl(`/file/${filename}`)} />
      </video>
    )
  }

  return null
}
