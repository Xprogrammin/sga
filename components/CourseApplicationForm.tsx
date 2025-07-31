
import React, { useState, useMemo, FormEvent, useEffect } from 'react';
import { LoadingSpinnerIcon } from './icons.tsx';
import { courses } from '../constants.tsx';

interface CourseApplicationFormProps {
  onClose: () => void;
  courseTitle?: string;
}

const MIN_WORDS = 50;
const MAX_WORDS = 150;

export const CourseApplicationForm: React.FC<CourseApplicationFormProps> = ({ onClose, courseTitle }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    applyingFor: courseTitle || '',
    interest: '',
  });

  useEffect(() => {
    if (courseTitle) {
      setFormData(prev => ({ ...prev, applyingFor: courseTitle }));
    }
  }, [courseTitle]);

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    applyingFor: '',
    interest: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const wordCount = useMemo(() => {
    return formData.interest.trim().split(/\s+/).filter(Boolean).length;
  }, [formData.interest]);

  const validate = () => {
    const newErrors = { fullName: '', email: '', applyingFor: '', interest: '' };
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!formData.applyingFor) {
      newErrors.applyingFor = 'Please select a course.';
      isValid = false;
    }

    if (wordCount < MIN_WORDS) {
      newErrors.interest = `Please enter at least ${MIN_WORDS} words.`;
      isValid = false;
    } else if (wordCount > MAX_WORDS) {
      newErrors.interest = `Please enter no more than ${MAX_WORDS} words.`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const encode = (data: { [key: string]: string }) => {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encode({ "form-name": "course-application", ...formData })
      })
      .then(() => {
          setIsSubmitted(true);
          setTimeout(() => {
              onClose();
          }, 3000);
      })
      .catch(error => {
          alert("Error submitting application: " + error);
      })
      .finally(() => {
          setIsSubmitting(false);
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8 animate-fade-in-up">
        <h3 className="text-2xl font-bold text-primary-blue">Thank You!</h3>
        <p className="mt-4 text-gray-600">Your application has been received. Our team will review it and get in touch with you shortly. This window will close automatically.</p>
      </div>
    );
  }

  const isFormInvalid = !formData.fullName || !formData.email || !formData.applyingFor || wordCount < MIN_WORDS || wordCount > MAX_WORDS;

  return (
    <form name="course-application" data-netlify="true" onSubmit={handleSubmit} noValidate className="animate-fade-in-up">
      <input type="hidden" name="form-name" value="course-application" />
      <div className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className={`w-full px-4 py-2 bg-light-gray border rounded-lg focus:outline-none focus:ring-2 ${errors.fullName ? 'border-red-500 ring-red-500/50' : 'border-gray-200 focus:ring-primary-blue/50'}`} />
          {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={`w-full px-4 py-2 bg-light-gray border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 ring-red-500/50' : 'border-gray-200 focus:ring-primary-blue/50'}`} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 bg-light-gray border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50" />
        </div>
        <div>
          <label htmlFor="applyingFor" className="block text-sm font-medium text-gray-700 mb-1">Applying for Course</label>
          <select id="applyingFor" name="applyingFor" value={formData.applyingFor} onChange={handleChange} required className={`w-full px-4 py-2 bg-light-gray border rounded-lg focus:outline-none focus:ring-2 ${errors.applyingFor ? 'border-red-500 ring-red-500/50' : 'border-gray-200 focus:ring-primary-blue/50'}`}>
            <option value="" disabled>Select a course...</option>
            {courses.map(course => (
              <option key={course.title} value={course.title}>{course.title}</option>
            ))}
          </select>
          {errors.applyingFor && <p className="mt-1 text-xs text-red-600">{errors.applyingFor}</p>}
        </div>
        <div>
          <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">Tell us why you are interested?</label>
          <textarea id="interest" name="interest" rows={5} value={formData.interest} onChange={handleChange} required className={`w-full px-4 py-2 bg-light-gray border rounded-lg focus:outline-none focus:ring-2 ${errors.interest ? 'border-red-500 ring-red-500/50' : 'border-gray-200 focus:ring-primary-blue/50'}`}></textarea>
          <div className="flex justify-between mt-1 text-xs">
            {errors.interest ? <p className="text-red-600">{errors.interest}</p> : <span />}
            <p className={`ml-auto ${wordCount > MAX_WORDS ? 'text-red-600' : 'text-gray-500'}`}>
              {wordCount}/{MAX_WORDS} words
            </p>
          </div>
        </div>
        <div>
          <button type="submit" disabled={isSubmitting || isFormInvalid} className="w-full bg-primary-blue text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
            {isSubmitting ? (
              <>
                <LoadingSpinnerIcon className="w-5 h-5 mr-2" />
                Submitting...
              </>
            ) : 'Submit Application'}
          </button>
        </div>
      </div>
    </form>
  );
};
