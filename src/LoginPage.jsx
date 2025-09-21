// src/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './app.jsx'; // We will export useAuth from App.jsx
import { useNavigation } from './app.jsx'; // We will export useNavigation from App.jsx
import { GoogleLogin } from '@react-oauth/google';

// Re-create Button and Card components locally or import them if you move them to separate files
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
    const baseClasses = 'px-6 py-3 font-semibold rounded-md transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950';
    const variants = {
        primary: 'bg-teal-600 text-white hover:bg-teal-500 focus-visible:ring-teal-500 shadow-lg shadow-teal-900/20 hover:shadow-teal-800/40',
        secondary: 'bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 hover:border-gray-600 focus-visible:ring-gray-500',
    };
    return <button type={type} onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]} ${className}`}>{children}</button>;
};
const Card = ({ children, className = '' }) => <div className={`bg-gray-900 rounded-lg border border-gray-800 overflow-hidden ${className}`}>{children}</div>;
const InputField = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input id={props.name} {...props} className="appearance-none block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 sm:text-sm" />
    </div>
);


export const LoginPage = () => {
    const { login, googleLogin, error, setError } = useAuth();
    const { setPage } = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    useEffect(() => {
        // Clear any previous errors when the login page loads
        setError(null);
    }, []); 

   // In src/LoginPage.jsx

// In src/LoginPage.jsx

// File: src/LoginPage.jsx

const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors before a new attempt

    const success = await login({ email, password });

    if (success) {
        setPage('dashboard');
    }
    // If login fails, the `error` state from useAuth will automatically be
    // updated and displayed on the page, so no 'else' block is needed here.
};

    const handleGoogleSuccess = async (credentialResponse) => {
        const success = await googleLogin(credentialResponse);
        if (success) {
            setPage('dashboard');
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center bg-gray-950 py-12 px-4">
            <Card className="max-w-md w-full space-y-8 p-8">
                <div>
                    <h2 className="text-center text-3xl font-bold text-teal-400">Sign in to your account</h2>
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
                    <InputField label="Email Address" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
                    <InputField label="Password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    
                    <div>
                        <Button type="submit" className="w-full">Sign in</Button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <a onClick={() => setPage('signup')} className="font-medium text-teal-500 hover:underline cursor-pointer">
                        Sign up
                    </a>
                </p>
            </Card>
        </div>
    );
};