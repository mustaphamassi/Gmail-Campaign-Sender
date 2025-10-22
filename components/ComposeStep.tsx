
import React, { useState, useRef } from 'react';
import { Recipient } from '../types';
import StepCard from './StepCard';
import { UploadIcon } from './icons/UploadIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { TemplateIcon } from './icons/TemplateIcon';
import { improveEmailContent } from '../services/geminiService';

interface ComposeStepProps {
  recipients: Recipient[];
  setRecipients: (recipients: Recipient[]) => void;
  subject: string;
  setSubject: (subject: string) => void;
  body: string;
  // FIX: Use React.Dispatch<React.SetStateAction<string>> for setBody to allow functional updates.
  setBody: React.Dispatch<React.SetStateAction<string>>;
  onNext: () => void;
  onNavigateTemplates: () => void;
}

const ComposeStep: React.FC<ComposeStepProps> = ({
  recipients,
  setRecipients,
  subject,
  setSubject,
  body,
  setBody,
  onNext,
  onNavigateTemplates,
}) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        // Simple CSV parsing: assumes 'email,name' header
        const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
        const header = lines.shift()?.toLowerCase().split(',');
        if (!header || header[0].trim() !== 'email') {
          throw new Error("Invalid CSV format. Header must start with 'email'.");
        }
        
        const nameIndex = header.findIndex(h => h.trim() === 'name');

        const parsedRecipients = lines.map(line => {
          const values = line.split(',');
          const email = values[0]?.trim();
          if (!email) return null;
          return {
            email,
            name: nameIndex > -1 ? values[nameIndex]?.trim() : undefined,
          };
        // FIX: Replaced problematic type predicate with a simpler filter.
        // The resulting type is compatible with Recipient[].
        }).filter(r => r !== null);
        
        setRecipients(parsedRecipients);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse CSV file.');
        setRecipients([]);
      }
    };
    reader.readAsText(file);
  };

  const handleImproveContent = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter an instruction for the AI.');
      return;
    }
    setIsImproving(true);
    setBody('');
    try {
      const contentStream = improveEmailContent(aiPrompt, body);
      for await (const chunk of contentStream) {
        setBody(prev => prev + chunk);
      }
    } catch (err) {
      console.error(err);
      setBody('Sorry, an error occurred while generating content.');
    } finally {
      setIsImproving(false);
    }
  };
  
  const canProceed = recipients.length > 0 && subject.trim() !== '' && body.trim() !== '';

  return (
    <StepCard
      stepNumber={2}
      title="Compose Your Email"
      description="Add recipients, write your subject and body, and use AI to improve it."
    >
      <div className="space-y-8">
        {/* Recipients */}
        <div className="space-y-2">
          <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
            <UserGroupIcon className="h-6 w-6" />
            <span>Recipients</span>
          </label>
          <div className="p-4 border-2 border-dashed rounded-lg dark:border-slate-600 text-center">
            <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center space-x-2 w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors"
            >
              <UploadIcon className="h-5 w-5" />
              <span>{recipients.length > 0 ? `${recipients.length} recipients loaded` : 'Upload CSV (email,name)'}</span>
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>

        {/* Compose Area */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Email Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 text-lg"
          />
          {/* AI Improvement */}
          <div className="flex items-stretch space-x-2">
            <input
              type="text"
              placeholder="Tell AI how to improve or write your email..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-grow p-3 border rounded-l-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
              onKeyDown={(e) => e.key === 'Enter' && handleImproveContent()}
            />
            <button
              onClick={handleImproveContent}
              disabled={isImproving}
              className="px-4 py-3 bg-purple-600 text-white font-semibold rounded-r-md shadow-sm hover:bg-purple-700 transition-colors duration-300 disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <SparklesIcon className="h-5 w-5" />
            </button>
          </div>
          <textarea
            placeholder="Your email body will appear here. Use {name} for personalization."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            className="w-full p-3 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
            readOnly={isImproving}
          />
          {isImproving && <p className="text-sm text-slate-500">AI is writing...</p>}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
           <button
            onClick={onNavigateTemplates}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg shadow-sm hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-300"
          >
            <TemplateIcon className="h-5 w-5" />
            <span>Templates</span>
          </button>
          <button
            onClick={onNext}
            disabled={!canProceed}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            <span>Review & Send</span>
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </StepCard>
  );
};

export default ComposeStep;
