import React from 'react';

const partners = [
    { name: 'Workspace', logoUrl: '/assets/Toolsvg/googleworkspace.svg' },
    { name: 'Saleforce', logoUrl: '/assets/Toolsvg/salesforce.svg' },
    { name: 'Facebook', logoUrl: '/assets/Toolsvg/facebook.svg' },
    { name: 'Drive', logoUrl: '/assets/Toolsvg/drive.svg' },
    { name: 'Monday', logoUrl: '/assets/Toolsvg/monday.svg' },
    { name: 'Zoom', logoUrl: '/assets/Toolsvg/zoom.svg' },
    { name: 'Googlemeet', logoUrl: '/assets/Toolsvg/googlemeet.svg' },
    { name: 'Slack', logoUrl: '/assets/Toolsvg/slack.svg' },
    { name: 'Asana', logoUrl: '/assets/Toolsvg/asana.svg' },
    { name: 'Linkedinforce', logoUrl: '/assets/Toolsvg/linkedin.svg' },
    { name: 'Canva', logoUrl: '/assets/Toolsvg/canva.svg' },
    { name: 'Buffer', logoUrl: '/assets/Toolsvg/buffer.svg' },
    { name: 'Make', logoUrl: '/assets/Toolsvg/make.svg' },
    { name: 'Chatgpt', logoUrl: '/assets/Toolsvg/chatgpt.svg' },
    { name: 'Shopify', logoUrl: '/assets/Toolsvg/shopify.svg' },
    { name: 'Gmail', logoUrl: '/assets/Toolsvg/gmail.svg' },
    
    
];



export const TrustedPartners: React.FC = () => {
  const logos = [...partners, ...partners]; // Duplicate for smooth scrolling

  return (
    <div className="py-8 w-full">
      <h3 className="text-sm font-semibold tracking-wider text-center text-gray-500 uppercase">
        Tools our VAs use
      </h3>
      <div className="mt-8 relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-infinite-scroll">
          {logos.map((partner, index) => (
            <div key={index} className="flex-shrink-0 w-40 sm:w-48 flex justify-center items-center">
              <img 
                src={partner.logoUrl} 
                alt={partner.name} 
                className="h-8 sm:h-10 object-contain transition-all duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};