import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useReducer,
} from "react";
import allSettled from "./allSettled";
import {
  type PromiseRejection,
  type PromiseResolution,
} from "./allSettled";

import "./Trashousel.scss";

const IMAGE_URLS = [
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame1.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame2.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame3.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame4.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame5.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame6.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame7.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame8.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame9.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame10.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame11.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame12.jpg",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame13.jpg"
];

const images: Images[] = IMAGE_URLS.map((url, index) => ({
  src: url,
  href: url, // you can adjust this as needed
  alt: `alt-${index + 1}`
}));


const ROTATION = 45;
const OPACITY_ORDER = [1, 0.8, 0.5, 0.2];
const SCALE_ORDER = [1, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];

interface Images {
  src: string;
  href?: string;
  alt?: string;
}

interface FetchedItem {
  image: HTMLImageElement;
  alt?: string;
  href?: string;
}

interface ImageInfo {
  isCurrentImage: boolean;
  isVisible: boolean;
  height: number;
  width: number;
  scaledWidth: number;
  zIndex: number;
  scale: number;
  rotate: number;
  opacity: number;
  src: string;
  href: string;
  alt: string;
}

const TOUCH_START = "touchStart";
const TOUCH_MOVE = "touchMove";
const TOUCH_END = "touchEnd";

interface State {
  start: number;
  end: number;
  isLeft: boolean;
  isRight: boolean;
  isMoving: boolean;
}

type Action =
  | { type: typeof TOUCH_END }
  | { type: typeof TOUCH_START; payload: number }
  | { type: typeof TOUCH_MOVE; payload: number };

const initialState = {
  start: 0,
  end: 0,
  isLeft: false,
  isRight: false,
  isMoving: false,
};

const clamp = (value: number, lowBound: number, highBound: number) =>
  Math.max(lowBound, Math.min(highBound, value));

// https://stackoverflow.com/questions/1106339/resize-image-to-fit-in-bounding-box
const resizeImage = (
  height: number,
  width: number,
  image: HTMLImageElement
) => {
  const widthScale = width / image.width;
  const heightScale = height / image.height;
  const scale = Math.min(widthScale, heightScale);
  console.log(scale);
  return {
    height: image.height * scale,
    width: image.width * scale,
  };
};

const isPromiseResolution = <T extends unknown>(
  promise: PromiseResolution<T> | PromiseRejection
): promise is PromiseResolution<T> => {
  return (promise as PromiseResolution<T>).value !== undefined;
};

const fetchImage = ({
  src,
  href,
  alt,
}: {
  src: string;
  href: string;
  alt: string;
}) => {
  return new Promise<FetchedItem>((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve({ image, href, alt });
    image.onerror = () => reject("Oops!");
  });
};

const fetchImages = (images: Images[]) => {
  const promises = images.map(fetchImage);
  return allSettled<FetchedItem>(promises);
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case TOUCH_START:
      return {
        ...state,
        start: action.payload,
        isMoving: false,
      };
    case TOUCH_MOVE:
      if (state.start - action.payload > 70) {
        return {
          ...state,
          isRight: true,
          isLeft: false,
          isMoving: true,
          end: action.payload,
        };
      }
      if (state.start - action.payload < -70) {
        return {
          ...state,
          isRight: false,
          isLeft: true,
          isMoving: true,
          end: action.payload,
        };
      }
      return {
        ...state,
        isMoving: true,
        end: action.payload,
      };
    case TOUCH_END:
      return {
        ...state,
        isRight: false,
        isLeft: false,
        isMoving: false,
      };
    default:
      throw new Error();
  }
}

function useTouchEvent(): [(node: HTMLElement) => void, State] {
  const [el, setEl] = useState<HTMLElement | null>(null);
  // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const ref = useCallback((node: HTMLElement) => {
    if (node !== null) {
      setEl(node);
    }
  }, []);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log("useEffect useTouch");
  
    if (el !== null) {
      const handleTouchStart = (e: TouchEvent) => {
        dispatch({ type: TOUCH_START, payload: e.targetTouches[0].clientX });
      };
      const handleTouchMove = (e: TouchEvent) => {
        dispatch({ type: TOUCH_MOVE, payload: e.targetTouches[0].clientX });
      };
      const handleTouchEnd = () => {
        dispatch({ type: TOUCH_END });
      };
  
      // Add event listener
      el.addEventListener("touchstart", handleTouchStart, { passive: false });
      el.addEventListener("touchmove", handleTouchMove, { passive: false });
      el.addEventListener("touchend", handleTouchEnd, { passive: false });
  
      // Remove event listener on cleanup
      return () => {
        el.removeEventListener("touchstart", handleTouchStart);
        el.removeEventListener("touchmove", handleTouchMove);
        el.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [el]);
  

  return [ref, state];
}

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    console.log("useEffect windowSize");

    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

// Taken from useHooks site
function useKeyPress(targetKey: string) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  function downHandler({ key }: KeyboardEvent) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  // Add event listeners
  useEffect(() => {
    console.log("useEffect useKeyPress");
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}

////// Component starts here
const Trashousel: React.FC = () => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  const increment = () => {
    setCount(count + 1);
    setItems([...items, count]);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  let className = "";
  let slidesPerSide = 3;
  let rotation = ROTATION;
  let opacityInterval = OPACITY_ORDER;
  let scaleInterval = SCALE_ORDER;

  /**
   * Sliders per side
   */
  const diff = slidesPerSide + 1 - opacityInterval.length;
  const isSlidesGreaterThanOpacityLength = diff >= 0;
  const slidesGreaterThanOpacityLength = useMemo(
    () => () =>
      [
        ...opacityInterval,
        ...Array(diff).fill(opacityInterval[opacityInterval.length - 1]),
        0,
      ],
    [diff, opacityInterval]
  );

  const slidesLessThanOpacityLength = useMemo(
    () => () => [...opacityInterval.slice(0, slidesPerSide + 1), 0],
    [opacityInterval, slidesPerSide]
  );
  const opacityIntervalOverride = useMemo(
    () =>
      slidesPerSide
        ? isSlidesGreaterThanOpacityLength
          ? slidesGreaterThanOpacityLength()
          : slidesLessThanOpacityLength()
        : OPACITY_ORDER,
    [
      isSlidesGreaterThanOpacityLength,
      slidesGreaterThanOpacityLength,
      slidesLessThanOpacityLength,
      slidesPerSide,
    ]
  );

  const coverflowRef = useRef<HTMLInputElement | undefined>();
  const [leftEdgeList, setLeftEdgeList] = useState<number[]>([]);
  const [imageList, setImageList] = useState<FetchedItem[]>([]);
  const [imageInfoList, setImageInfoList] = useState<ImageInfo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { height, width } = useWindowSize();
  const leftArrowKeyPress = useKeyPress("ArrowLeft");
  const rightArrowKeyPress = useKeyPress("ArrowRight");
  const [ref, { isMoving, isLeft, isRight }] = useTouchEvent();

  useEffect(() => {
    console.log("useEffect 1 in component, isMoving");
    if (isMoving && isLeft) {
      setCurrentIndex((currentIndex) =>
        currentIndex > 0 ? currentIndex - 1 : currentIndex
      );
    }
    if (isMoving && isRight) {
      setCurrentIndex((currentIndex) =>
        currentIndex < imageList.length - 1 ? currentIndex + 1 : currentIndex
      );
    }
  }, [isMoving, isLeft, isRight, imageList.length]);

  /**
   * Arrow Keys
   */
  useEffect(() => {
    console.log("useEffect 2 in component, arrow keys");
    if (leftArrowKeyPress) {
      setCurrentIndex((currentIndex) =>
        currentIndex > 0 ? currentIndex - 1 : currentIndex
      );
    }
    if (rightArrowKeyPress) {
      setCurrentIndex((currentIndex) =>
        currentIndex < imageList.length - 1 ? currentIndex + 1 : currentIndex
      );
    }
  }, [leftArrowKeyPress, rightArrowKeyPress, imageList.length]);

  /**
   * Image fetch
   */
  useEffect(() => {
    console.log("useEffect 3 in component, image fetch");
    const fetch2 = async (originalImageList: Images[]) => {
      const fetchedImages = await fetchImages(originalImageList);
      const succeedImages = fetchedImages
        .filter(({ status }) => {
          return status === "fulfilled";
        })
        .map((item) => {
          if (isPromiseResolution(item)) {
            return item.value;
          }

          return undefined;
        });
      console.log("succeedImages", succeedImages);
      setImageList(succeedImages);
      setCurrentIndex(Math.floor(succeedImages.length / 2));
    };
    fetch2(images);
  }, [images]);

  /**
   * Sizing / Edges
   */
  useEffect(() => {
    console.log("useEffect 4 in component, sizing/edges");
    console.log("imageList in useEffect 4", imageList);
    console.log("coverflowRef", coverflowRef.current);

    let leftEdgeList: number[] = []; // raw image no scale applied
    let imageInfoList: ImageInfo[] = [];
    let edge = 0;
    const coverflowHeight =
      coverflowRef.current !== undefined
        ? coverflowRef.current.getBoundingClientRect().height
        : 0;
    const coverflowWidth =
      coverflowRef.current !== undefined
        ? coverflowRef.current.getBoundingClientRect().width
        : 0;

    imageList.forEach((image, index) => {
      const {
        image: { src },
        href,
        alt,
      } = image;
      const imageInfo = {} as ImageInfo;
      const distanceFromMiddle = index - currentIndex;
      const absDistanceFromMiddle = Math.abs(index - currentIndex);
      const scale =
        scaleInterval[
          clamp(absDistanceFromMiddle, 0, scaleInterval.length - 1)
        ];
      const imageDimension = resizeImage(
        coverflowHeight,
        coverflowWidth,
        image.image
      );
      const scaledWidth = imageDimension.width * scale;
      leftEdgeList.push(edge);
      const rotate =
        index > currentIndex
          ? -rotation
          : index === currentIndex
          ? 0
          : rotation;
      const zIndex = 100 - absDistanceFromMiddle;
      const opacity =
        opacityIntervalOverride[
          clamp(absDistanceFromMiddle, 0, opacityIntervalOverride.length - 1)
        ];
      const isVisible =
        opacityIntervalOverride[absDistanceFromMiddle] !== 0 &&
        opacityIntervalOverride[absDistanceFromMiddle] !== undefined;

      imageInfo.isCurrentImage = index === currentIndex;
      imageInfo.isVisible = isVisible;
      imageInfo.height = imageDimension.height;
      imageInfo.width = imageDimension.width;
      imageInfo.scaledWidth = scaledWidth;
      imageInfo.zIndex = zIndex;
      imageInfo.scale = scale;
      imageInfo.rotate = rotate;
      imageInfo.opacity = opacity;
      imageInfo.src = src;
      imageInfo.href = href;
      imageInfo.alt = alt;

          // LEFT HAND SIDE
          if (distanceFromMiddle < 0) {
            // we only want to move 20% so they overlap
            edge += scaledWidth * 0.2;
          } else {
            // RIGHT HAND SIDE
            const { image: nextImage } = imageList[index + 1] || {};
            if (nextImage) {
              const nextImageDistanceFromCenter = index + 1 - currentIndex;
              const nextScale =
                scaleInterval[
                  clamp(
                    Math.abs(nextImageDistanceFromCenter),
                    0,
                    scaleInterval.length - 1
                  )
                ];
              const nextImageDimension = resizeImage(
                coverflowHeight,
                coverflowWidth,
                nextImage
              );
              const nextImageScaledWidth = nextImageDimension.width * nextScale;
              edge +=
                scaledWidth - nextImageScaledWidth + nextImageScaledWidth * 0.2;
            } else {
              edge += scaledWidth;
            }
          }
        console.log("imageinfo", imageInfo);
        imageInfoList.push(imageInfo);
    });
    console.log("imageInfoList in useEffect 4", imageInfoList);

    setImageInfoList(imageInfoList);
    setLeftEdgeList(leftEdgeList);
  }, [
    currentIndex,
    imageList,
    height,
    width,
    scaleInterval,
    opacityIntervalOverride,
  ]);

  const handleButtonClick = (index = 0, href: string) => {
    if (index === currentIndex && href) {
      window.open(href, "_blank");
    }
    setCurrentIndex(index);
  };

  console.log("image list before render", imageList);
  /**Return nonsense */
  if (!!imageInfoList.length && !(imageList.length > 0)) {
    return null;
  }

  return (
    <div>
      {/* carou start */}
      <div
        ref={coverflowRef}
        className="coverflow"
        style={{
          transform: `translateX(-${
            leftEdgeList[currentIndex] + imageInfoList[currentIndex]?.width / 2
          }px)`,
          width: "1500px",
          height: "500px",
        }}
      >
                  {imageInfoList.map((imageInfo, index) => {
            const {
              zIndex,
              href,
              src,
              alt,
              scaledWidth,
              width,
              height,
              rotate,
              opacity,
              scale,
              isCurrentImage,
              isVisible,
            } = imageInfo;
            const leftPosition = leftEdgeList[index];
            return (
              <div
                key={index}
                className={`coverflow__image-container ${
                  isVisible ? "coverflow__image-container--visible" : ""
                } ${
                  isCurrentImage ? "coverflow__image-container--active" : ""
                }`}
                style={{
                  zIndex: zIndex,
                  left: `${leftPosition}px`,
                  width: `${scaledWidth}px`,
                  height: `${height}px`,
                }}
              >
                <button
                  className="coverflow__button"
                  tabIndex={isCurrentImage && href ? 0 : -1}
                  onClick={() => {
                    if (isVisible) {
                      handleButtonClick(index, href);
                    }
                  }}
                  style={{
                    transform: `scale(${scale}) rotateY(${rotate}deg)`,
                    pointerEvents: isVisible ? "all" : "none",
                    cursor: `${isCurrentImage && href ? "pointer" : ""}`,
                  }}
                >
                  <img
                    className="coverflow__image"
                    src={src}
                    style={{
                      height: `${height}px`,
                      width: `${width}px`,
                      opacity: `${opacity}`,
                    }}
                    alt={alt}
                  />
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Trashousel;
