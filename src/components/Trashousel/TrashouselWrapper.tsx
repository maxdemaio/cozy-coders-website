// I have this wrapped so I can dymanically import the Trashousel component
// with height and width props based on the window size
import { useEffect, useState } from "react";
import Trashousel from "./Trashousel";

// Custom hook to track window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

function calculateDimensions(width) {
  let newWidth, newHeight;

  if (width < 600) {
      newWidth = 500;
      newHeight = 250;
  } else if (width < 800) {
      newWidth = 700;
      newHeight = 350;
  } else if (width < 1024) {
      newWidth = 800;
      newHeight = 400;
  } else {
      newWidth = 1200;
      newHeight = 500;
  }

  return { width: newWidth, height: newHeight };
}

// Parent component
const TrashouselWrapper = () => {
  const windowSize = useWindowSize();
  const originalWidth = windowSize.width;
  const { width, height } = calculateDimensions(originalWidth);

  const IMAGE_URLS = [
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame1.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame2.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame3.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame4.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame5.jpg",
    "/resto.png",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame6.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame7.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame8.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame9.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame10.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame11.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame12.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/207435/carousel-frame13.jpg",
  ];

  return (
    <Trashousel
      imageUrls={IMAGE_URLS}
      width={width}
      height={height}
    />
  );
};

export default TrashouselWrapper;
