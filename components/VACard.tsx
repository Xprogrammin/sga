

import React from 'react';
import type { VirtualAssistant } from '../types.ts';
import { detailedVAs } from '../constants.tsx';

interface VACardProps {
  va: VirtualAssistant;
  isAnimated?: boolean;
  navigate: (page: string, context?: any) => void;
}

export const VACard: React.FC<VACardProps> = ({ va, isAnimated = false, navigate }) => {
  const vaDetails = detailedVAs.find(dva => dva.id === va.id);

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 text-center h-full flex flex-col ${isAnimated ? 'animate-subtle-pump' : 'hover:shadow-xl hover:-translate-y-2'}`}>
      <div className="flex-grow">
        {va.icon ? (
          <div className="w-24 h-24 rounded-full mx-auto shadow-md border-4 border-white flex items-center justify-center bg-accent-light-blue">
            {va.icon}
          </div>
        ) : (
          <img src={va.imageUrl} alt={va.name} className="w-24 h-24 rounded-full mx-auto object-cover shadow-md border-4 border-white" />
        )}
        <h3 className="mt-4 text-xl font-bold text-gray-900">{va.name}</h3>
        <p className="text-primary-blue font-medium">{va.role}</p>
      </div>
      <button
        onClick={() => {
            if (vaDetails) {
                navigate('va-detail', { vaId: vaDetails.id, vaType: vaDetails.type });
            }
        }}
        className="mt-6 inline-block w-full bg-primary-blue text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-accent-light-blue hover:text-primary-blue transition-colors duration-300"
      >
        Hire Now
      </button>
    </div>
  );
};