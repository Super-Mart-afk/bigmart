import React from 'react';
import { SignUp } from '@clerk/clerk-react';

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-recoleta text-gray-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Join SuperMarket and start shopping today
          </p>
        </div>

        <div className="flex justify-center">
          <SignUp 
            afterSignUpUrl="/"
            signInUrl="/login"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-lg",
              }
            }}
          />
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2 text-sm sm:text-base">What you get:</h4>
          <div className="text-xs sm:text-sm text-green-800 space-y-1">
            <p>• Access to thousands of products</p>
            <p>• Secure shopping cart and checkout</p>
            <p>• Order tracking and history</p>
            <p>• Exclusive deals and discounts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;