'use client'

import type { StaticImageData } from 'next/image'

import { cn } from '@/lib/utils'
import NextImage from 'next/image'
import React from 'react'

import type { Props as FileProps } from '../types'

import { cssVariables } from '@/css-variables'
import { getFileUrl } from '@/lib/get-file-url'

const { breakpoints } = cssVariables

const placeholderBlur =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALYSURBVHgBlVcLlhwhCATHI+Q4uf8hcpdIepRPgdp560umW0SEosBe/vPrtxCtf8SkP1KeOJaMfVZ18px1LnPp+WVWy0ve/z7CRwbbRBXRoL6t/ZQdzjo4l2mbYV3CzvROqA8Wc1WN8vovJl/vtnQFJUJOc9EAAxvA7HmZCNBxv6rJ2A+qT9yt9pIfAjN8nylIltSAQic0Qr7C2XgS+axDihsytWU+TTq+DkgYJ0WcSZ2wrSvnzpVvStipBSFIobC4HaBi8rEPjWrlWO6BJACAFwQgnQoiv2z8XQjccnqVXxxNupj3UCscPXCguMheybXmNacbL+y98OdSPn0YhfTH8oW14qUPeceSigOil2QeGH8qR7AMGaI3JQODgevIA1KlOP88DKFD6rYqyBBgcO5NNiQ5LXuWabe3OwC5GQNyamcMDRgOF6xvbF74rLzYvMoknOrY3yE6S8JqEdbjw0G8ZJJDwCV0QzSIPtCjAoYRLd0TGwIU87eL9JQp5gMHTqkyWOxeSDw41Ds6i5yye8D3Pwg4kvFCKSXJEw4Zc9E86Hul4F5Oa71/mjYTvIJb1LugMTkjVE6eF5nfLaw2xM1EwT0p+DQGC40Cw3Y56TZq0vkiy+NBwD6XXhQLuWorSOXjOtoTU6PLdqYDGQHoeLTnlA8Vf6puLt6fCsDW+ufTiilg79HiWxountxKkxyBMGzfLAV10NjtxTremfmqIq+BkH8lswry+AnRznJxDvDFdqALCBxGZRt+vydYGMjC+byiv741o3FpFWTAkCSVNAQRW9+nBH092Xbgt0CU+4NA2z1PYx3UvKGgMwzRHeDe/r6gUlqzCjgfX1BfIt7K8UTMWwD8sl5IeCKZJM+Ei8YmgCqu/PHFZe/bpAoJ9zSI3mx8WX8f/B9ZSUHtHUveoDNQ6hLitU0bAe3+YX53sPfWcA5E0Rfs89NiA++43CHqFjdXJ79EIwj07B8+UsfOZVRPQAAAAABJRU5ErkJggg=='

export const ImageFile: React.FC<FileProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    pictureClassName,
    imgClassName,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    loading: loadingFromProps,
  } = props

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource === 'object') {
    const { alt: altFromResource, height: fullHeight, url, width: fullWidth } = resource

    width = fullWidth!
    height = fullHeight!
    alt = altFromResource || ''

    const cacheTag = resource.updatedAt

    src = getFileUrl(url, cacheTag)
  }

  const loading = loadingFromProps || (!priority ? 'lazy' : undefined)

  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
        .join(', ')

  return (
    <picture className={cn(pictureClassName)}>
      <NextImage
        alt={alt || ''}
        className={cn(imgClassName)}
        fill={fill}
        height={!fill ? height : undefined}
        placeholder="blur"
        blurDataURL={placeholderBlur}
        priority={priority}
        quality={100}
        loading={loading}
        sizes={sizes}
        src={src}
        width={!fill ? width : undefined}
      />
    </picture>
  )
}
