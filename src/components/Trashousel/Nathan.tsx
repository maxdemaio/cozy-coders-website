import { useState, useEffect, useRef } from 'react'
import './nathan.css'

const ROTATE = 45
const OPACITY_ORDER = [1, 0.8, 0.5, 0.2]
const SCALE_ORDER = [1, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]

// Taken from useHooks site
function useKeyPress(targetKey: string) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false)

  // If pressed key is our target key then set to true
  function downHandler({ key }: { key: string }) {
    if (key === targetKey) {
      setKeyPressed(true)
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }: { key: string }) => {
    if (key === targetKey) {
      setKeyPressed(false)
    }
  }

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return keyPressed
}

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined as number | undefined,
    height: undefined as number | undefined,
  })

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount

  return windowSize
}

function getImageWidth(image: HTMLImageElement, coverflowHeight: number) {
  return image ? image.width * (coverflowHeight / image.height) : 1
}

function getImageHeight(image: HTMLImageElement) {
  return image ? image.height * (1 / 2) : 1
}

const fetchImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image'))
  })
}

const fetchImages = (urls: string[]): Promise<HTMLImageElement[]> => {
  const promises = urls.map(fetchImage)
  return Promise.all(promises)
}

// function fetchImage(url: string) {
//   return new Promise((resolve, reject) => {
//     const img = new Image()
//     img.src = url
//     img.onload = () => resolve(img)
//     img.onerror = () => reject(new Error('Failed to load image'))
//   })
// }
//
// async function fetchImages(urls: string[]) {
//   const promises = urls.map(fetchImage)
//   return Promise.allSettled(promises).then((results) =>
//     results
//       .filter((result) => result.status === 'fulfilled')
//       .map((result) => (result as PromiseFulfilledResult<HTMLImageElement>).value),
//   )
// }

function Nathan({ imageUrls }: { imageUrls: string[] }) {
  // const [originalImageWidthRatioList, setOriginalImageWidthRatioList] = useState([])
  const coverflowRef = useRef<HTMLDivElement>(null)

  const [leftEdgeList, setLeftEdgeList] = useState<number[]>([])
  const [imageList, setImageList] = useState<HTMLImageElement[]>([])

  const [imageWidthList, setImageWidthList] = useState<number[]>([])
  // const [imageScaledWidth, setImageScaledWidth] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [maxWidth, setMaxWidth] = useState<number | undefined>()
  const [maxHeight, setMaxHeight] = useState<number | undefined>()

  // const { width, height } = useWindowSize()

  /**
   * Arrow Keys
   */
  const { height } = useWindowSize()
  const leftArrowKeyPress = useKeyPress('ArrowLeft')
  const rightArrowKeyPress = useKeyPress('ArrowRight')

  const prevLeftKeyPress = useRef<boolean | undefined>()
  const prevRightKeyPress = useRef<boolean | undefined>()

  useEffect(() => {
    // Function to handle the state update
    const updateIndex = () => {
      if (leftArrowKeyPress && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      } else if (rightArrowKeyPress && currentIndex < imageList.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    }

    // Check if the key presses have changed
    if (leftArrowKeyPress !== prevLeftKeyPress.current || rightArrowKeyPress !== prevRightKeyPress.current) {
      updateIndex()
      prevLeftKeyPress.current = leftArrowKeyPress
      prevRightKeyPress.current = rightArrowKeyPress
    }
  }, [leftArrowKeyPress, rightArrowKeyPress, currentIndex, imageList.length])


  /**
   * Image fetch
   */

  useEffect(() => {
    async function fetchAndSetImages() {
      try {
        const imgs = await fetchImages(imageUrls)
        setImageList(imgs)
        setCurrentIndex(Math.floor(imgs.length / 2))
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }
    fetchAndSetImages()
  }, [imageUrls])

  /**
   * Sizing / Edges
   */
  useEffect(() => {
    if (!coverflowRef.current) return
    const leftEdgeList: number[] = [] // raw image no scale applied
    const imageWidthList: number[] = [] // raw image width values stored for quick look up by index
    let edge = 0
    let currHeight = 0
    let currWidth = 0
    const coverflowHeight = coverflowRef.current !== undefined ? coverflowRef.current.getBoundingClientRect().height : 0
    // const coverflowHeight = height ? height : 0

    // TODO: make all other images that arent the current image scale bigger without affect how far apart they are
    //
    imageList.forEach((image, index) => {
      const distanceFromMiddle = index - currentIndex
      const scale = SCALE_ORDER[Math.min(SCALE_ORDER.length - 1, Math.abs(distanceFromMiddle))]

      leftEdgeList.push(edge)
      const imageWidth = getImageWidth(image, coverflowHeight)
      imageWidthList.push(imageWidth)
      const scaledWidth = getImageWidth(image, coverflowHeight) * scale

      // LEFT HAND SIDE
      if (distanceFromMiddle < 0) {
        // we only want to move 20% so they overlap
        edge += scaledWidth * 0.2
      } else {
        // RIGHT HAND SIDE
        const nextImage = imageList[index + 1]
        if (nextImage) {
          const nextImageDistanceFromCenter = index + 1 - currentIndex
          const nextScale = SCALE_ORDER[Math.min(SCALE_ORDER.length - 1, Math.abs(nextImageDistanceFromCenter))]
          console.log(`nextScale `, nextScale)
          const nextScaledWidth = getImageWidth(nextImage, coverflowHeight) * nextScale
          edge += scaledWidth - nextScaledWidth + nextScaledWidth * 0.2
        } else {
          edge += scaledWidth
        }
      }
      currWidth += edge
      currHeight = Math.max(currHeight, getImageHeight(image))
    })
    console.log(`left Edge List Current `, leftEdgeList[currentIndex])
    console.log(`image list current / 2 `, imageList[currentIndex]?.width / 2)
    setLeftEdgeList(leftEdgeList)
    setImageWidthList(imageWidthList)
    setMaxHeight(currHeight)
    setMaxWidth(edge)
  }, [currentIndex, imageList, height])

  if (!imageList.length) {
    return <div>No Images Loaded!</div>
  }
  return (
    <div className="h-[60vh] mt-12 mb-16">
      {/* add orange border here on the ref for debugging if needed */}
      <div
        ref={coverflowRef}
        className="relative flex items-center left-1/2 h-full"
        style={{
          transform: `translateX(-${leftEdgeList[currentIndex] + imageWidthList[currentIndex] / 2}px)`,
          width: `${maxWidth}px`,
          transition:
            'transform 500ms cubic-bezier(0.215, 0.61, 0.355, 1), width 500ms cubic-bezier(0.215, 0.61, 0.355, 1)',
        }}
        onTouchMove={(e) => console.log(e)}
      >
        {imageUrls.map((imageUrl, index) => {
          const imageWidth = imageWidthList[index]
          const isCurrentImage = currentIndex === index
          const distanceFromMiddle = Math.abs(currentIndex - index)
          const leftPosition = leftEdgeList[index]
          const rotate = index > currentIndex ? -ROTATE : index === currentIndex ? 0 : ROTATE
          const zIndex = 100 - distanceFromMiddle
          const opacity = OPACITY_ORDER[Math.min(OPACITY_ORDER.length - 1, distanceFromMiddle)]
          const scale = SCALE_ORDER[Math.min(SCALE_ORDER.length - 1, distanceFromMiddle)]
          const scaledWidth = imageWidth * scale
          return (
            <div
              key={`image-${index}`}
              className={isCurrentImage ? `absolute my-active` : `absolute`}
              style={{
                zIndex: `${zIndex}`,
                left: `${leftPosition}px`,
                perspective: `100vw`,
                transition: `left 500ms cubic-bezier(0.215, 0.61, 0.355, 1)`,
                pointerEvents: `none`,
                userSelect: `none`,
                width: `${scaledWidth}px`,
              }}
            >
              <div
                tabIndex={0}
                onClick={() => setCurrentIndex(index)}
                style={{
                  transform: `scale(${scale}) rotateY(${rotate}deg)`,
                  transition: `transform 500ms cubic-bezier(0.215, 0.61, 0.355, 1), opacity 500ms cubic-bezier(0.215, 0.61, 0.355, 1)`,
                  pointerEvents: `all`,
                }}
              >
                <img
                  src={imageUrl}
                  className='hover:border-2 hover:border-orange-500'
                  style={{
                    display: `block`,
                    transform: `translateZ(0)`,
                    width: `${imageWidth}px`,
                    opacity: `${opacity}`,
                    transition: `transform 500ms cubic-bezier(0.215, 0.61, 0.355, 1), opacity 500ms cubic-bezier(0.215, 0.61, 0.355, 1)`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Nathan;