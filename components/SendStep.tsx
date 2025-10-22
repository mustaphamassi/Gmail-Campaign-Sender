
import React, { useState, useEffect } from 'react';
import { Recipient, SendResult } from '../types';
import StepCard from './StepCard';

interface SendStepProps {
  subject: string;
  body: string;
  recipients: Recipient[];
  onComplete: (result: SendResult) => void;
}

const SendStep: React.FC<SendStepProps> = ({ subject, body, recipients, onComplete }) => {
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  useEffect(() => {
    if (!isSending) return;

    const totalRecipients = recipients.length;
    if (totalRecipients === 0) {
        onComplete({ success: 0, failed: 0 });
        return;
    }
    
    // Simulate sending emails
    const interval = setInterval(() => {
      setSentCount(prevCount => {
        const newCount = prevCount + 1;
        if (newCount >= totalRecipients) {
          clearInterval(interval);
          // Simulate some failures
          const failedCount = Math.floor(Math.random() * (Math.min(5, totalRecipients)));
          onComplete({ success: totalRecipients - failedCount, failed: failedCount });
        }
        return newCount;
      });
    }, 100); // Adjust speed of simulation

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSending, recipients.length]);

  const progressPercentage = recipients.length > 0 ? (sentCount / recipients.length) * 100 : 0;

  const getPersonalizedBody = (recipient: Recipient) => {
    return body.replace(/{name}/g, recipient.name || 'there');
  };

  return (
    <StepCard
      stepNumber={3}
      title="Review & Send Campaign"
      description="Review the details below and send your campaign."
    >
      {!isSending ? (
        <div className="space-y-6">
          <div className="p-4 border rounded-md dark:border-slate-700 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Recipients:</h3>
              <p className="text-slate-600 dark:text-slate-400">{recipients.length} contacts</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Subject:</h3>
              <p className="text-slate-600 dark:text-slate-400">{subject}</p>
            </div>
             <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Body Preview (for {recipients[0]?.name || 'first recipient'}):</h3>
              <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {getPersonalizedBody(recipients[0])}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setIsSending(true)}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
            >
              Send Now
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <h3 className="text-lg font-semibold">Sending Campaign...</h3>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-100"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Sent {sentCount} of {recipients.length} emails
            </p>
        </div>
      )}
    </StepCard>
  );
};

export default SendStep;

