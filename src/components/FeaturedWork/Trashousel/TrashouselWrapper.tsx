// I have this wrapped so I can dymanically import the Trashousel component
// with height and width props based on the window size
import { useEffect, useState } from "react";
import Trashousel from "./Trashousel";
import { type Image } from "./types";

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

  const IMAGES: Image[] = [
    {
      url: "/top-carousel/splist-home.png",
      alt: "Splist Homepage",
    },
    {
      url: "/top-carousel/langbot.png",
      alt: "Langbot Homepage",
    },
    {
      url: "/top-carousel/splist-app.png",
      alt: "Splist App",
    },
    {
      url: "/top-carousel/cozy.png",
      alt: "Cozy Coders Homepage",
    },

    {
      url: "/top-carousel/resto.png",
      alt: "Resto homepage",
    },
    {
      url: "/top-carousel/music.png",
      alt: "Music Homepage",
    },
    {
      url: "/top-carousel/chessheat.png",
      alt: "Chess Heat Homepage",
    },
    {
      url: "/top-carousel/typehero.png",
      alt: "TypeHero homepage",
    },
    {
      url: "/top-carousel/maxdemaio-home.jpeg",
      alt: "Max DeMaio Homepage",
    },
  ];

  return <Trashousel images={IMAGES} width={width} height={height} />;
};

export default TrashouselWrapper;
