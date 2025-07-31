import React, { useState } from 'react';
import { courses } from '../constants.tsx';
import type { Course } from '../types.ts';
import { Modal } from './Modal.tsx';
import { AgreementConfirmation } from './AgreementConfirmation.tsx';
import { CourseApplicationForm } from './CourseApplicationForm.tsx';

const CourseCard: React.FC<{ course: Course, index: number, onApply: (title: string) => void }> = ({ course, index, onApply }) => (
    <div 
        className="bg-light-gray rounded-2xl p-8 flex flex-col opacity-0 animate-fade-in-up shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        style={{ animationDelay: `${index * 100}ms` }}
    >
        <h3 className="text-2xl font-bold text-dark-text mb-4">{course.title}</h3>
        <p className="text-gray-600 flex-grow mb-6">{course.description}</p>
        <button
            onClick={() => onApply(course.title)}
            className="block w-full text-center mt-auto bg-primary-blue text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
        >
            Apply Now
        </button>
    </div>
);

export const CoursesPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalView, setModalView] = useState<'agreement' | 'form'>('agreement');
    const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined);

    const handleApplyClick = (courseTitle: string) => {
        setSelectedCourse(courseTitle);
        setModalView('agreement');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setModalView('agreement');
            setSelectedCourse(undefined);
        }, 300);
    };

    const handleAgree = () => {
        setModalView('form');
    };

    const AgreementText = () => (
        <>
            <p>By applying for a Catazet Certification Course, you agree to commit to the learning schedule and complete all required assignments. These courses are offered free of charge to foster skill development.</p>
            <p>You acknowledge that enrollment is limited and subject to an application review. We expect all participants to maintain a respectful and collaborative learning environment. Catazet reserves the right to manage enrollment at its discretion.</p>
        </>
    );

    return (
        <div className="pt-20 bg-white">
            {/* Hero Section */}
            <section className="py-16 lg:py-24 text-center">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-6xl font-poppins font-bold text-gray-900 leading-tight opacity-0 animate-fade-in-up">
                        Free <span className="text-primary-blue">Certification Courses</span>
                    </h1>
                    <p 
                        className="mt-6 text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        Enhance your skills and boost your career with our free, industry-relevant certification bootcamps. Apply now to get started!
                    </p>
                </div>
            </section>

            {/* Courses Section */}
            <section className="pb-16 lg:pb-24">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center text-dark-text mb-12">
                        Our Free Courses
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {courses.map((course, index) => (
                            <CourseCard key={course.title} course={course} index={index} onApply={handleApplyClick} />
                        ))}
                    </div>
                </div>
            </section>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={modalView === 'agreement' ? 'Course Application Agreement' : `Apply for ${selectedCourse}`}>
                <div className="flex justify-center items-center gap-2 mb-4">
                    <img src="/assets/logo/Catazetlogomain.png" alt="Catazet Logo" className="h-8 w-auto" />
                    <span className="text-2xl font-poppins font-extrabold text-primary-blue">Catazet</span>
                </div>
                {modalView === 'agreement' ? (
                    <AgreementConfirmation
                        title="Course Program Agreement"
                        onAgree={handleAgree}
                        onCancel={handleCloseModal}
                    >
                        <AgreementText />
                    </AgreementConfirmation>
                ) : (
                    <CourseApplicationForm onClose={handleCloseModal} courseTitle={selectedCourse} />
                )}
            </Modal>
        </div>
    );
};