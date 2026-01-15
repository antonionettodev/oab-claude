import type { StaticImageData } from 'next/image'

import { cn } from '@/lib/utils'
import React from 'react'
import RichText from '@/components/richtext'

import type { FileBlock as FileBlockProps } from '@/payload-types'

import { File } from '@/components/files'

type Props = FileBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const FileBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    file,
    staticImage,
    disableInnerContainer,
  } = props

  let caption
  if (file && typeof file === 'object') caption = file.caption

  return (
    <div
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {(file || staticImage) && (
        <File
          imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
          resource={file}
          src={staticImage}
        />
      )}
      {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}
