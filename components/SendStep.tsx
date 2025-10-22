
import React, { useState, useEffect } from 'react';
import { Recipient, SendResult } from '../types';
import StepCard from './StepCard';

interface SendStepProps {
  subject: string;
  body: string;
  recipients: Recipient[];
  onComplete: (result: SendResult) => void;
  userEmail: string;
  accessToken: string;
}

const SendStep: React.FC<SendStepProps> = ({ subject, body, recipients, onComplete, userEmail, accessToken }) => {
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [currentRecipient, setCurrentRecipient] = useState('');

  useEffect(() => {
    if (!isSending) return;

    const sendAllEmails = async () => {
      for (const recipient of recipients) {
        setCurrentRecipient(recipient.email);
        const personalizedBody = getPersonalizedBody(recipient);
        try {
          const response = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: recipient.email,
              from: userEmail,
              subject,
              body: personalizedBody,
              accessToken,
            }),
          });
          
          if (!response.ok) {
            throw new Error(`Failed to send email to ${recipient.email}`);
          }
          setSentCount(prev => prev + 1);

        } catch (error) {
          console.error(error);
          setFailedCount(prev => prev + 1);
        }
      }
      onComplete({ success: sentCount, failed: failedCount });
    };

    sendAllEmails();
    // We only want this to run once when isSending becomes true.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSending]);

  const progressPercentage = recipients.length > 0 ? ((sentCount + failedCount) / recipients.length) * 100 : 0;

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
              disabled={recipients.length === 0}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              Send Now
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <h3 className="text-lg font-semibold">Sending Campaign...</h3>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-600 h-4 rounded-full transition-width duration-100"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Sent {sentCount} | Failed {failedCount} | Total {recipients.length}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs h-4">
                {currentRecipient && `Processing: ${currentRecipient}`}
            </p>
        </div>
      )}
    </StepCard>
  );
};

export default SendStep;