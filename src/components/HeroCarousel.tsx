import React, { useState } from 'react';

const HeroCarousel = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <div className="carousel">
      {currentIndex > 0 && (
        <button className="arrow arrow-back" onClick={handlePrev}>
          &lt;
        </button>
      )}

      <div className="carousel-images">
        {React.Children.map(children, (child, index) => (
          React.cloneElement(child, {
            className: index === currentIndex ? 'active' : '',
          })
        ))}
      </div>

      {currentIndex < React.Children.count(children) - 1 && (
        <button className="arrow arrow-next" onClick={handleNext}>
          &gt;
        </button>
      )}
    </div>
  );
};

export default HeroCarousel;
