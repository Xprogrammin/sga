
import React, { useState, useEffect } from 'react';
import { FaqItem } from './FaqItem.tsx';
import { TrustedPartners } from './TrustedPartners.tsx';
import { ServicesCarousel } from './ServicesCarousel.tsx';
import { ServiceCard } from './ServiceCard.tsx';
import { whyChooseUsItems, howItWorksSteps, services, faqs, detailedVAs } from '../constants.tsx';
import { WhyVettedTalentIcon, ChatBubbleIcon, DollarSignIcon, WhyGlobalReachIcon } from './icons.tsx';
import { VACard } from './VACard.tsx';
import { FeaturedVAsCarousel } from './FeaturedVAsCarousel.tsx';
import type { VirtualAssistant } from '../types.ts';

const roles = [
    "Social Media Manager",
    "Executive Assistant",
    "Graphic Designer",
    "Customer Support Specialist",
    "Content Writer & Editor",
    "Lead Generation Assistant",
    "Podcast Assistant",
    "Academic Research Assistant",
    "E-commerce Assistant",
    "Medical Transcriptionist",
    "Market Research Analyst",
    "Online Tutor Support Assistant",
    "Software QA Tester",
    "Event Coordination Assistant",
    "Remote Surveillance Officer"
];
const vaProfiles: { [key: string]: string } = {
    "Social Media Manager": '/assets/profile/angel.jpeg',
    "Executive Assistant": '/assets/profile/adewumi.jpeg',
    "Graphic Designer": '/assets/profile/sunday.jpeg',
    "Customer Support Specialist": '/assets/profile/monica.jpeg',
    "Content Writer & Editor": '/assets/profile/adewumi.jpeg',
    "Lead Generation Assistant": '/assets/profile/francis.jpeg',
    "Podcast Assistant": '/assets/profile/joanne.jpeg',
    "Academic Research Assistant": '/assets/profile/izza.jpeg',
    "E-commerce Assistant": '/assets/profile/ferlita.jpeg',
    "Medical Transcriptionist": '/assets/profile/adeola.jpeg',
    "Market Research Analyst": '/assets/profile/syd.jpeg',
    "Online Tutor Support Assistant": '/assets/profile/joanne.jpeg',
    "Software QA Tester": '/assets/profile/aaron.jpeg',
    "Event Coordination Assistant": '/assets/profile/cess.jpeg',
    "Remote Surveillance Officer": '/assets/profile/dennis.jpeg',
};

interface HeroGraphicProps {
    containerClassName?: string;
}

const HeroGraphic: React.FC<HeroGraphicProps> = ({ containerClassName }) => {
    const [roleIndex, setRoleIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 2000;

    useEffect(() => {
        let timeout: number;
        const currentRole = roles[roleIndex];

        // Typing logic
        if (!isDeleting && displayedText.length < currentRole.length) {
            timeout = window.setTimeout(() => {
                setDisplayedText(currentRole.substring(0, displayedText.length + 1));
            }, typingSpeed);
        }
        // Pausing logic (after typing is complete)
        else if (!isDeleting && displayedText.length === currentRole.length) {
            timeout = window.setTimeout(() => {
                setIsDeleting(true);
            }, pauseDuration);
        }
        // Deleting logic
        else if (isDeleting && displayedText.length > 0) {
            timeout = window.setTimeout(() => {
                setDisplayedText(prev => prev.slice(0, -1));
            }, deletingSpeed);
        }
        // Change role logic (after deleting is complete)
        else if (isDeleting && displayedText.length === 0) {
            setIsDeleting(false);
            setRoleIndex(prev => (prev + 1) % roles.length);
        }

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, roleIndex]);
    
    const currentRole = roles[roleIndex];

    return (
         <div className={containerClassName || "rounded-2xl shadow-xl w-full h-[200px] sm:h-[350px] lg:h-full lg:max-w-2xl bg-primary-blue overflow-hidden lg:animate-subtle-pump"}>
            <div className="flex flex-col items-center justify-center h-full p-8 text-white relative">
                <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/5 rounded-full"></div>
                <div className="absolute -bottom-20 -right-12 w-56 h-56 bg-white/5 rounded-full"></div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="hidden sm:block w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/50 object-cover shadow-lg flex-shrink-0 bg-cover bg-center" style={{backgroundImage: `url(${vaProfiles[currentRole]})`}}></div>
                    <div>
                        <p className="text-xl lg:text-2xl text-accent-light-blue">Find a...</p>
                        <h2 className="text-3xl lg:text-4xl font-bold font-poppins min-h-[48px] lg:min-h-[56px] break-words">
                            {displayedText}
                            <span className="inline-block w-1 h-8 lg:h-10 bg-white ml-1 animate-blink align-bottom"></span>
                        </h2>
                    </div>
                </div>

                <div className="relative z-10 w-1/2 my-8 border-t border-white/20 hidden sm:block"></div>
                
                <div className="relative z-10 hidden sm:block w-full max-w-sm">
                    <div
                        className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center opacity-0 animate-fade-in-up shadow-sm"
                        style={{ animationDelay: `200ms` }}
                    >
                        <p className="text-xl font-medium text-white italic">"Catalyze your productivity."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface HomePageProps {
    navigate: (page: string, context?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [randomFeaturedVAs, setRandomFeaturedVAs] = useState<VirtualAssistant[]>([]);

  useEffect(() => {
    // Shuffle the detailedVAs array to get a random order
    const shuffled = [...detailedVAs].sort(() => 0.5 - Math.random());
    
    // Select the first 6 VAs and map them to the simpler VirtualAssistant type
    const selectedVAs = shuffled.slice(0, 6).map(va => ({
        id: va.id,
        name: va.name,
        role: va.tagline, // Use tagline for the role on the card
        imageUrl: va.imageUrl,
    }));
    
    setRandomFeaturedVAs(selectedVAs);
  }, []); // Empty dependency array ensures this runs only once on mount


  const getWhyChooseUsIcon = (title: string) => {
    switch (title) {
      case 'Vetted Talent': return <WhyVettedTalentIcon />;
      case 'Dedicated Support': return <ChatBubbleIcon className="w-6 h-6" />;
      case 'Cost-Effective': return <DollarSignIcon className="w-6 h-6" />;
      case 'Global Reach': return <WhyGlobalReachIcon />;
      default: return <WhyVettedTalentIcon />;
    }
  };

  return (
    <div className="lg:pt-20">
      {/* Hero Section */}
      <section className="bg-white">
        {/* Mobile View */}
        <div className="lg:hidden">
            <div className="flex flex-col bg-white">
                {/* Hero Section */}
                <section className="flex flex-col h-screen">
                    {/* Graphic Section */}
                    <div className="h-[45vh] bg-primary-blue flex items-center justify-center p-4">
                        <HeroGraphic containerClassName="w-full h-full overflow-hidden" />
                    </div>
                    {/* Content Section with Curve */}
                    <div className="h-[55vh] bg-white rounded-t-[2rem] -mt-8 pt-8 px-6 pb-6 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)] flex flex-col justify-center">
                        <div className="text-center">
                            <h1 className="text-3xl font-poppins font-bold text-gray-900 leading-tight">
                                Your Global <span className="text-primary-blue">Talent Partner</span>
                            </h1>
                            <p className="mt-2 text-base text-gray-600">
                                Connect with highly skilled virtual assistants from the Philippines, India, and Nigeria.
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => navigate('services')}
                                    className="bg-primary-blue text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:opacity-90 transition-opacity duration-300 text-base"
                                >
                                    Hire a VA
                                </button>
                                <a
                                    href="https://calendly.com/catazethr/30min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white text-primary-blue font-semibold py-3 px-6 rounded-xl shadow-md border border-gray-200 hover:bg-accent-light-blue transition-colors duration-300 text-base text-center"
                                >
                                    Book A Call
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Trusted Partners Section */}
                <div className="bg-white px-6 pt-12 pb-12">
                    <TrustedPartners />
                </div>
            </div>
        </div>


        {/* Desktop View */}
        <div className="hidden lg:block">
            <div className="container mx-auto px-6 min-h-[calc(100vh-5rem)] flex flex-col justify-center py-12 lg:py-0">
                <div className="flex-grow flex items-center">
                    <div className="w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-8xl font-poppins font-bold text-gray-900 leading-tight lg:tracking-tighter">
                                Your Global <span className="text-primary-blue">Talent Partner</span>
                            </h1>
                            <p className="mt-6 text-lg lg:text-2xl text-gray-600 max-w-xl mx-auto lg:mx-0">
                                Connect with highly skilled virtual assistants from the Philippines, India, and Nigeria.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={() => navigate('services')}
                                    className="bg-primary-blue text-white font-semibold py-4 px-10 rounded-2xl shadow-md hover:opacity-90 transition-opacity duration-300 text-lg"
                                >
                                    Hire a VA
                                </button>
                                <a
                                    href="https://calendly.com/catazethr/30min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white text-primary-blue font-semibold py-4 px-10 rounded-2xl shadow-md border border-gray-200 hover:bg-accent-light-blue transition-colors duration-300 text-lg text-center"
                                >
                                    Book A Call
                                </a>
                            </div>
                        </div>
                        <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
                           <HeroGraphic />
                        </div>
                    </div>
                </div>
                <TrustedPartners />
            </div>
        </div>
      </section>
      
      {/* Why Choose Catazet? Section */}
      <section className="py-16 lg:py-24 bg-primary-blue">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center text-white">
            Why Choose Catazet?
          </h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUsItems.map((item) => (
              <div key={item.title} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <div className="bg-accent-light-blue text-primary-blue w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getWhyChooseUsIcon(item.title)}
                  </div>
                </div>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900">How It Works</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8 md:gap-12">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="relative">
                 {step.step < 3 && <div className="hidden md:block absolute top-1/2 left-full transform -translate-y-1/2 w-full border-t-2 border-dashed border-gray-300 ml-6"></div>}
                <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center">
                  <div className="bg-primary-blue text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 lg:py-24 bg-accent-light-blue">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center text-gray-900">Our Services</h2>
          
          {/* Desktop Grid - Clickable and animated on hover */}
          <div className="hidden mt-12 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>

          {/* Mobile Carousel - Autoplays, animated, with navigation */}
          <div className="mt-12 sm:hidden">
            <ServicesCarousel services={services} />
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-blue">
        <div className="container mx-auto px-6 py-16 lg:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-white">Ready to Transform Your Business?</h2>
          <p className="mt-4 text-lg text-accent-light-blue/90 max-w-3xl mx-auto">
            Join hundreds of businesses that have boosted their productivity and efficiency with Catazet's virtual assistants.
          </p>
          <div className="mt-8">
            <button
              onClick={() => navigate('services')}
              className="bg-white text-primary-blue font-semibold py-3 px-8 rounded-xl shadow-md hover:bg-accent-light-blue transition-colors duration-300"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      {/* Featured VAs Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center text-gray-900">Meet Our Featured Virtual Assistants</h2>
          
          {/* Desktop Grid - Animated on hover */}
          <div className="hidden mt-12 sm:grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {randomFeaturedVAs.map((va) => (
              <VACard key={va.id} va={va} navigate={navigate} />
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="mt-12 sm:hidden">
              <FeaturedVAsCarousel vas={randomFeaturedVAs} navigate={navigate} />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-accent-light-blue">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-12 max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <FaqItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
