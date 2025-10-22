import React from 'react';
import { SendResult } from '../types';
import StepCard from './StepCard';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface CompleteStepProps {
  result: SendResult;
  onReset: () => void;
  onViewCampaigns: () => void;
}

const CompleteStep: React.FC<CompleteStepProps> = ({ result, onReset, onViewCampaigns }) => {
  return (
    <StepCard
      stepNumber={4}
      title="Campaign Sent!"
      description="Here are the results of your campaign."
    >
      <div className="text-center py-8 space-y-6">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
        <h3 className="text-2xl font-bold">All Done!</h3>
        <div className="flex justify-center space-x-8 text-lg">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
            <span className="font-medium">{result.success}</span>
            <span className="text-slate-500 dark:text-slate-400">Sent</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircleIcon className="h-6 w-6 text-red-500" />
            <span className="font-medium">{result.failed}</span>
            <span className="text-slate-500 dark:text-slate-400">Failed</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
          <button
            onClick={onViewCampaigns}
            className="w-full sm:w-auto px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition-colors duration-300"
          >
            View Campaigns
          </button>
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
          >
            Start Another Campaign
          </button>
        </div>
      </div>
    </StepCard>
  );
};

export default CompleteStep;
