
import React from 'react';
import StepCard from './StepCard';
import { GoogleIcon } from './icons/GoogleIcon';

interface AuthStepProps {
  onConnect: () => void;
}

const AuthStep: React.FC<AuthStepProps> = ({ onConnect }) => {
  return (
    <StepCard
      stepNumber={1}
      title="Connect Your Account"
      description="To get started, please connect your Gmail account."
    >
      <div className="flex flex-col items-center justify-center space-y-6 py-8">
        <p className="text-center text-slate-600 dark:text-slate-300 max-w-md">
          This will grant temporary permission to send emails on your behalf. We will not store your credentials. (This is a simulation).
        </p>
        <button
          onClick={onConnect}
          className="flex items-center justify-center space-x-3 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <GoogleIcon className="h-6 w-6" />
          <span>Connect with Gmail</span>
        </button>
      </div>
    </StepCard>
  );
};

export default AuthStep;
