import React from 'react';
import { Campaign } from '../types';
import StepCard from './StepCard';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';

interface ProfileStepProps {
  campaigns: Campaign[];
  onStartNew: () => void;
}

const ProfileStep: React.FC<ProfileStepProps> = ({ campaigns, onStartNew }) => {

  const calculateSuccessRate = (result: Campaign['result']) => {
    const total = result.success + result.failed;
    if (total === 0) return '0.0';
    return ((result.success / total) * 100).toFixed(1);
  };

  return (
    <StepCard
      stepNumber={0}
      title="Campaign History"
      description="Review your past email campaigns and their performance."
    >
      <div className="space-y-6">
        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <ChartBarIcon className="mx-auto h-16 w-16 text-slate-400" />
            <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-slate-100">No campaigns yet</h3>
            <p className="mt-1 text-sm text-slate-500">Once you send a campaign, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{campaign.subject}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Sent on {campaign.sentAt.toLocaleString()}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                     <p className="font-bold text-xl text-blue-500">{calculateSuccessRate(campaign.result)}%</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Success Rate</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                   <div className="flex items-center space-x-2">
                      <UserGroupIcon className="h-5 w-5 text-slate-400" />
                      <div>
                          <p className="font-medium">{campaign.recipientsCount}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Recipients</p>
                      </div>
                   </div>
                   <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <div>
                          <p className="font-medium">{campaign.result.success}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Sent</p>
                      </div>
                   </div>
                   <div className="flex items-center space-x-2">
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                      <div>
                          <p className="font-medium">{campaign.result.failed}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Failed</p>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={onStartNew}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <PaperAirplaneIcon className="h-5 w-5" />
                <span>Start a New Campaign</span>
            </button>
        </div>
      </div>
    </StepCard>
  );
};

export default ProfileStep;
