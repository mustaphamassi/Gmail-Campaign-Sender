import React from 'react';

interface StepCardProps {
  title: string;
  description: string;
  stepNumber: number;
  children: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({ title, description, stepNumber, children }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-4">
          {stepNumber > 0 && (
            <div className="flex-shrink-0 bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold text-lg">
              {stepNumber}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default StepCard;
