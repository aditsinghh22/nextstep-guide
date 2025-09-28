// src/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './app.jsx';      // Ensure useAuth is exported from App.jsx
import { useNavigation } from './app.jsx';// Ensure useNavigation is exported from App.jsx
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

// Reusable Button (responsive padding/gap)
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const baseClasses = [
    'font-semibold',
    'rounded-md',
    'transition-all',
    'duration-300',
    'flex',
    'items-center',
    'justify-center',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-gray-950',
    'disabled:cursor-not-allowed',
    'disabled:transform-none',
    'disabled:bg-gray-700',
    'disabled:text-gray-500',
    'px-4',    // Mobile padding
    'py-2',
    'gap-1',
    'sm:px-6',// Tablet+ padding
    'sm:py-3',
    'sm:gap-2'
  ].join(' ');

  const variants = {
    primary: [
      'bg-teal-600',
      'text-white',
      'hover:bg-teal-500',
      'focus-visible:ring-teal-500',
      'shadow-lg',
      'shadow-teal-900/20',
      'hover:shadow-teal-800/40'
    ].join(' '),
    secondary: [
      'bg-gray-800',
      'text-gray-200',
      'border',
      'border-gray-700',
      'hover:bg-gray-700',
      'hover:border-gray-600',
      'focus-visible:ring-gray-500'
    ].join(' ')
  };

  return (
    <motion.button
      type={type}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

// Reusable Card (responsive padding)
const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-900 rounded-lg border border-gray-800 overflow-hidden w-full p-4 sm:p-8 ${className}`}>
    {children}
  </div>
);

// Input field with full-width & focus styles
const InputField = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <input
      id={props.name}
      {...props}
      className="
        block
        w-full
        px-3
        py-3
        border
        border-gray-700
        bg-gray-900
        placeholder-gray-500
        text-white
        rounded-md
        focus:outline-none
        focus:ring-2
        focus:ring-teal-500/50
        focus:border-teal-500
        sm:text-sm
      "
    />
  </div>
);

export const LoginPage = () => {
  const { login, googleLogin, error, setError } = useAuth();
  const { setPage } = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setError(null);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const success = await login({ email, password });
    if (success) setPage('dashboard');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const success = await googleLogin(credentialResponse);
    if (success) setPage('dashboard');
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-teal-400">
            Sign in to your account
          </h2>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Google Login Failed')}
            theme="outline"
            size="large"
          />
        </div>

        <div className="flex items-center justify-center">
          <div className="h-px bg-gray-700 flex-grow"></div>
          <span className="px-4 text-gray-500">OR</span>
          <div className="h-px bg-gray-700 flex-grow"></div>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a
            onClick={() => setPage('signup')}
            className="font-medium text-teal-500 hover:underline cursor-pointer"
          >
            Sign up
          </a>
        </p>
      </Card>
    </div>
  );
};
