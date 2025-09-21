import React, { useState } from 'react';
import { useAuth } from './app.jsx'; // Adjust path if needed
import { useNavigation } from './app.jsx'; // Adjust path if needed

// --- Re-created UI Components for consistency ---
const Button = ({ children, onClick, className = '', disabled = false, type = 'button' }) => {
    const baseClasses = 'w-full px-6 py-3 font-semibold rounded-md transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950';
    const variantClasses = 'bg-teal-600 text-white hover:bg-teal-500 focus-visible:ring-teal-500 shadow-lg shadow-teal-900/20 hover:shadow-teal-800/40';
    return <button type={type} onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses} ${className}`}>{children}</button>;
};

const Card = ({ children, className = '' }) => (
    <div className={`bg-gray-900 rounded-lg border border-gray-800 overflow-hidden ${className}`}>
        {children}
    </div>
);

const InputField = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input 
            id={props.name} 
            {...props} 
            className="appearance-none block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 sm:text-sm" 
        />
    </div>
);

// --- OTP Page Component ---
export const OtpPage = () => {
    const [otp, setOtp] = useState('');
    const { verifyOtp, error } = useAuth();
    const { setPage, emailForVerification } = useNavigation();

    // This function handles the API call when the user clicks "Verify"
    const handleVerify = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            // You might want to show a more specific error here
            alert('Please enter a valid 6-digit OTP.');
            return;
        }

        const success = await verifyOtp({ email: emailForVerification, otp });

        if (success) {
            setPage('dashboard'); // On success, navigate to the dashboard
        }
        // If it fails, the `error` state from useAuth() will be updated and displayed
    };

    return (
        <div className="flex-grow flex items-center justify-center bg-gray-950 py-12 px-4">
            <Card className="max-w-md w-full space-y-8 p-8">
                <div>
                    <h2 className="text-center text-3xl font-bold text-teal-400">Verify Your Account</h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        An OTP has been sent to <span className="font-medium text-teal-500">{emailForVerification}</span>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleVerify}>
                    <InputField 
                        label="Verification Code" 
                        name="otp" 
                        type="tel" // Use "tel" for better mobile numeric keyboard
                        value={otp} 
                        onChange={e => setOtp(e.target.value)} 
                        required 
                        placeholder="Enter 6-digit OTP" // Corrected placeholder text
                        maxLength="6"
                        autoComplete="one-time-code"
                    />

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <Button type="submit" className="w-full">Verify</Button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-500">
                    Didn't receive the code?{' '}
                    <a href="#" className="font-medium text-teal-500 hover:underline cursor-pointer">
                        Resend
                    </a>
                </p>
            </Card>
        </div>
    );
};