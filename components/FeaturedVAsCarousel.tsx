

import React, { useState, useEffect, useCallback } from 'react';
import type { VirtualAssistant } from '../types.ts';
import { VACard } from './VACard.tsx';

interface FeaturedVAsCarouselProps {
  vas: VirtualAssistant[];
  navigate: (page: string, context?: any) => void;
}

export const FeaturedVAsCarousel: React.FC<FeaturedVAsCarouselProps> = ({ vas, navigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === vas.length - 1 ? 0 : prevIndex + 1));
  }, [vas.length]);

  useEffect(() => {
    const slideInterval = setInterval(goToNext, 5000);
    return () => clearInterval(slideInterval);
  }, [goToNext]);
  
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative w-full">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-700 ease-in-out" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {vas.map((va, index) => (
            <div key={index} className="w-full flex-shrink-0 px-2">
              <VACard va={va} isAnimated={index === currentIndex} navigate={navigate} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {vas.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            aria-label={`Go to VA profile ${slideIndex + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              currentIndex === slideIndex ? 'bg-primary-blue' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};