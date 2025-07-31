import React from 'react';
import type { Service } from '../types.ts';

interface ServiceCardProps {
  service: Service;
  isAnimated?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, isAnimated = false }) => {
  return (
    <a 
      href="#" 
      className={`group block bg-white p-8 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 flex flex-col items-center text-center h-full ${isAnimated ? 'animate-subtle-pump' : ''}`}
    >
      <div className="bg-accent-light-blue text-primary-blue w-16 h-16 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
        {service.icon}
      </div>
      <h3 className="mt-6 text-xl font-bold text-gray-900">{service.title}</h3>
      <p className="mt-2 text-gray-600 flex-grow">{service.description}</p>
    </a>
  );
};
