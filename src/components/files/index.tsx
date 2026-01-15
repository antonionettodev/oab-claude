import React, { Fragment } from 'react'

import type { Props } from './types'

import { ImageFile } from './image-file'
import { VideoFile } from './video-file'

export const File: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const Tag = htmlElement || Fragment

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? <VideoFile {...props} /> : <ImageFile {...props} />}
    </Tag>
  )
}
