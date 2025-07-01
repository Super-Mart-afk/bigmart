import React from 'react';
import { SignIn } from '@clerk/clerk-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-recoleta text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Sign in to your SuperMarket account
          </p>
        </div>

        <div className="flex justify-center">
          <SignIn 
            afterSignInUrl="/"
            signUpUrl="/signup"
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
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;