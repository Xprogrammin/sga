import React, { useState, useEffect, useCallback } from 'react';
import type { Service } from '../types.ts';
import { ServiceCard } from './ServiceCard.tsx';

interface ServicesCarouselProps {
  services: Service[];
}

export const ServicesCarousel: React.FC<ServicesCarouselProps> = ({ services }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === services.length - 1 ? 0 : prevIndex + 1));
  }, [services.length]);

  useEffect(() => {
    const slideInterval = setInterval(goToNext, 5000); // Auto-scroll every 5 seconds
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
          {services.map((service, index) => (
            <div key={index} className="w-full flex-shrink-0 px-2">
              <ServiceCard service={service} isAnimated={index === currentIndex} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {services.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            aria-label={`Go to slide ${slideIndex + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              currentIndex === slideIndex ? 'bg-primary-blue' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};
