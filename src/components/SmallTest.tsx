import React, { useEffect, useState } from 'react';

// functions and types
import allSettled from "./promiseStuff/allSettled";
import {
  type PromiseRejection,
  type PromiseResolution,
} from "./promiseStuff/allSettled";

const IMAGES: Images[] = [
  {
    src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame1.jpg",
    href: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame1.jpg",
    alt: "alt",
  },
  {
    src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame3.jpg",
    href: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame3.jpg",
    alt: "alt",
  },
];

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

let images: Images[] = [
  {
    src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame1.jpg",
    href: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame1.jpg",
    alt: "alt",
  },
  {
    src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame3.jpg",
    href: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame3.jpg",
    alt: "alt",
  },
];

const SmallTest: React.FC = () => {
  const [imageList, setImageList] = useState<FetchedItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Image fetch
   */
  useEffect(() => {
    console.log("useEffect 1 in component, image fetch")
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


  useEffect(() => {
    // Code to run on component mount
    console.log("useEffect 2, here's the image list!", imageList);

    return () => {
      // Code to run on component unmount
    };
  }, [imageList]);

  useEffect(() => {
    // Code to run on component mount
    console.log("useEffect 3");

    return () => {
      // Code to run on component unmount
    };
  }, []);

  return (
    <div>
      my compy!
    </div>
  );
};

export default SmallTest;
