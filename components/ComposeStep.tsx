
import React, { useState, useCallback, useRef } from 'react';
import { Recipient } from '../types';
import StepCard from './StepCard';
import { improveEmailContent } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { UploadIcon } from './icons/UploadIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';

interface ComposeStepProps {
  userEmail: string;
  subject: string;
  setSubject: (subject: string) => void;
  body: string;
  setBody: (body: string) => void;
  recipients: Recipient[];
  setRecipients: (recipients: Recipient[]) => void;
  onSubmit: () => void;
}

const ComposeStep: React.FC<ComposeStepProps> = ({
  userEmail,
  subject,
  setSubject,
  body,
  setBody,
  recipients,
  setRecipients,
  onSubmit,
}) => {
  const [csvError, setCsvError] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        const header = lines.shift()?.toLowerCase().split(',') || [];
        const emailIndex = header.indexOf('email');
        const nameIndex = header.indexOf('name');

        if (emailIndex === -1) {
          throw new Error("CSV must contain an 'email' column.");
        }

        const parsedRecipients: Recipient[] = lines.map(line => {
          const values = line.split(',');
          return {
            email: values[emailIndex]?.trim(),
            name: nameIndex > -1 ? values[nameIndex]?.trim() : '',
          };
        }).filter(r => r.email);

        if(parsedRecipients.length === 0) {
            throw new Error("No valid recipients found in the CSV file.");
        }

        setRecipients(parsedRecipients);
      } catch (error) {
        setCsvError(error instanceof Error ? error.message : 'Failed to parse CSV file.');
        setRecipients([]);
      }
    };
    reader.readAsText(file);
  };

  const handleGenerateContent = async () => {
    if (!aiPrompt || isGenerating) return;
    setIsGenerating(true);
    setBody(''); // Clear previous content
    try {
      const stream = improveEmailContent(aiPrompt, body);
      for await (const chunk of stream) {
        setBody(prev => prev + chunk);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = subject.trim() !== '' && body.trim() !== '' && recipients.length > 0;

  return (
    <StepCard
      stepNumber={2}
      title="Compose & Add Recipients"
      description={`You are sending from ${userEmail}.`}
    >
      <div className="space-y-6">
        {/* Recipient Loader */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Recipients
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {recipients.length > 0 ? (
                <>
                  <UserGroupIcon className="mx-auto h-12 w-12 text-green-500" />
                  <p className="font-semibold text-green-600 dark:text-green-400">{recipients.length} recipients loaded.</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Upload another CSV to replace.</p>
                </>
              ) : (
                <>
                  <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="flex text-sm text-slate-600 dark:text-slate-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a CSV</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} ref={fileInputRef} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500">Must contain 'name' and 'email' columns.</p>
                </>
              )}
            </div>
          </div>
          {csvError && <p className="mt-2 text-sm text-red-600">{csvError}</p>}
        </div>

        {/* AI Content Generator */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <label htmlFor="ai-prompt" className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <SparklesIcon className="h-5 w-5 text-blue-500"/>
            <span>AI Email Assistant</span>
          </label>
          <div className="flex space-x-2">
            <input
              id="ai-prompt"
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., 'A welcome email for new subscribers'"
              className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
              onClick={handleGenerateContent}
              disabled={!aiPrompt || isGenerating}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Email Form */}
        <div className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Your email subject"
            />
          </div>
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Compose your email... You can use {name} as a placeholder."
            />
            <p className="mt-2 text-xs text-slate-500">Tip: Use `{'{name}'}` to personalize the email for each recipient.</p>
          </div>
        </div>
        
        <div className="flex justify-end">
            <button
              onClick={onSubmit}
              disabled={!isFormValid}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                <span>Proceed to Send</span>
                <PaperAirplaneIcon className="h-5 w-5" />
            </button>
        </div>
      </div>
    </StepCard>
  );
};

export default ComposeStep;
