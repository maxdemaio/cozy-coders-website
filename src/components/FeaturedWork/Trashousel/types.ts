export interface CoverflowProps {
  imageUrls: string[]
  width: number
  height: number
}

export interface ImageInfo {
  isCurrentImage: boolean
  isVisible: boolean
  height: number
  width: number
  scaledWidth: number
  zIndex: number
  scale: number
  rotate: number
  opacity: number
  src: string
  href: string
  alt: string
}