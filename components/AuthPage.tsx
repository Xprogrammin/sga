import React, { useState, useEffect } from 'react';
import { GoogleIcon, AppleIcon, XIcon, EyeIcon, EyeOffIcon } from './icons.tsx';

interface AuthPageProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
  onLoginSuccess: (role: 'admin' | 'client' | 'va' | 'volunteer' | 'coursetaker') => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ isOpen, onClose, mode, setMode, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };
    if (isOpen) {
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);
    }
    return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Reset form when mode changes for a clean slate
  useEffect(() => {
    if (isOpen) {
        setFormData({ fullName: '', email: '', password: '' });
        setError('');
        setIsPasswordVisible(false);
    }
  }, [mode, isOpen]);

  if (!isOpen) return null;

  const isLogin = mode === 'login';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if(error) setError('');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin && formData.email === 'CatazetAdmin@gmail.com' && formData.password === 'CatazetPassword') {
        onLoginSuccess('admin');
    } else if (isLogin && formData.email === 'amina.d@catazet.va' && formData.password === 'password123') {
        onLoginSuccess('va');
    } else if (isLogin && formData.email === 'client@example.com' && formData.password === 'password123') {
        onLoginSuccess('client');
    } else if (isLogin && formData.email === 'volunteer@example.com' && formData.password === 'password123') {
        onLoginSuccess('volunteer');
    } else if (isLogin && formData.email === 'coursetaker@example.com' && formData.password === 'password123') {
        onLoginSuccess('coursetaker');
    } else if (isLogin) {
        setError('Invalid credentials. Please try again.');
    } else {
        // Mock signup: log in as a client
        console.log(`Submitting for ${mode}`, formData);
        onLoginSuccess('client');
    }
  };

  const handleToggleMode = () => {
    setMode(isLogin ? 'signup' : 'login');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in-up"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="relative bg-white rounded-2xl shadow-xl w-[calc(100%-2rem)] max-w-md m-4 flex flex-col max-h-[95vh] animate-fade-in-up"
        style={{ animationDuration: '0.4s' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <XIcon />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto">
          <div className="flex justify-center items-center gap-2 mb-4">
              <img src="/assets/logo/Catazetlogomain.png" alt="Catazet Logo" className="h-10 w-auto" />
              <span className="text-3xl font-poppins font-extrabold text-primary-blue">Catazet</span>
          </div>

          <h2 id="auth-modal-title" className="text-2xl sm:text-3xl font-poppins font-bold text-dark-text text-center">
            {isLogin ? 'Welcome Back!' : 'Create Your Account'}
          </h2>
          <p className="text-gray-600 mt-2 text-center">
            {isLogin ? "Let's get you signed in." : 'Join us to find your perfect VA.'}
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <button
              aria-label="Continue with Google"
              className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <GoogleIcon className="w-6 h-6" />
            </button>
            <button
              aria-label="Continue with Apple"
              className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <AppleIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="my-6 flex items-center">
            <hr className="flex-grow border-gray-200" />
            <span className="mx-4 text-sm font-medium text-gray-400">OR</span>
            <hr className="flex-grow border-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="auth-fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="auth-fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-light-gray border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50"
                  placeholder="name or company"
                />
              </div>
            )}
            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="auth-email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-light-gray border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="password"
                  id="auth-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-light-gray border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50"
                  placeholder="••••••••"
                />
                <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                >
                    {isPasswordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-primary-blue text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-opacity"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={handleToggleMode} className="font-semibold text-primary-blue hover:underline ml-1">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};