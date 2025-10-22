import React from 'react';
import { GoogleIcon } from './icons/GoogleIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';

interface LandingStepProps {
  onConnect: () => void;
}

const LandingStep: React.FC<LandingStepProps> = ({ onConnect }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 md:px-8 text-center py-20 lg:py-32">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
            Create & Send Email Campaigns, <span className="text-blue-600">Supercharged by AI</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            Upload your recipient list, draft compelling emails with the help of Gemini, and send personalized campaigns directly from a familiar interface.
          </p>
          <div className="mt-8">
            <button
              onClick={onConnect}
              className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <GoogleIcon className="h-6 w-6" />
              <span>Get Started with Gmail</span>
            </button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">How It Works in 3 Simple Steps</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">From idea to inbox, streamlined for you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
              <div className="flex items-center justify-center h-16 w-16 bg-blue-100 dark:bg-blue-900/50 rounded-full mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">1. Connect & Upload</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Securely connect your Gmail account and upload a simple CSV file with your contacts' names and emails.
              </p>
            </div>
            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
              <div className="flex items-center justify-center h-16 w-16 bg-purple-100 dark:bg-purple-900/50 rounded-full mx-auto mb-4">
                <SparklesIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">2. Compose with AI</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Write your email or provide a simple prompt. Let our AI assistant generate engaging content for you in seconds.
              </p>
            </div>
            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
              <div className="flex items-center justify-center h-16 w-16 bg-green-100 dark:bg-green-900/50 rounded-full mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">3. Send & Track</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Review your personalized campaign, send it to your list, and track its performance in your campaign history.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingStep;
