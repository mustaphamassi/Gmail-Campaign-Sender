
import React, { useState, useEffect } from 'react';
import { Template } from '../types';
import StepCard from './StepCard';
import { SaveIcon } from './icons/SaveIcon';
import { TrashIcon } from './icons/TrashIcon';
import { TemplateIcon } from './icons/TemplateIcon';

interface TemplatesStepProps {
  onUseTemplate: (template: Template) => void;
  onBack: () => void;
}

const TemplatesStep: React.FC<TemplatesStepProps> = ({ onUseTemplate, onBack }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateSubject, setNewTemplateSubject] = useState('');
  const [newTemplateBody, setNewTemplateBody] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const savedTemplates = localStorage.getItem('emailTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  const saveTemplatesToStorage = (updatedTemplates: Template[]) => {
    localStorage.setItem('emailTemplates', JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim() || !newTemplateSubject.trim() || !newTemplateBody.trim()) {
      alert('Please fill in all fields for the new template.');
      return;
    }
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: newTemplateName.trim(),
      subject: newTemplateSubject.trim(),
      body: newTemplateBody.trim(),
    };
    const updatedTemplates = [...templates, newTemplate];
    saveTemplatesToStorage(updatedTemplates);
    setNewTemplateName('');
    setNewTemplateSubject('');
    setNewTemplateBody('');
    setIsCreating(false);
  };

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      const updatedTemplates = templates.filter(t => t.id !== id);
      saveTemplatesToStorage(updatedTemplates);
    }
  };

  const handleUseTemplate = (template: Template) => {
    onUseTemplate(template);
    onBack();
  };

  return (
    <StepCard stepNumber={0} title="Email Templates" description="Manage your saved email templates.">
      <div className="space-y-6">
        {isCreating ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">New Template</h3>
            <input
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="Template Name"
              className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
            />
            <input
              type="text"
              value={newTemplateSubject}
              onChange={(e) => setNewTemplateSubject(e.target.value)}
              placeholder="Email Subject"
              className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
            />
            <textarea
              value={newTemplateBody}
              onChange={(e) => setNewTemplateBody(e.target.value)}
              placeholder="Email Body (use {name} for personalization)"
              rows={6}
              className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsCreating(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-md">Cancel</button>
              <button onClick={handleSaveTemplate} className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2"><SaveIcon className="h-5 w-5" /><span>Save</span></button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Create New Template</button>
            </div>
            {templates.length === 0 ? (
              <p className="text-center text-slate-500 py-8">You have no saved templates.</p>
            ) : (
              <ul className="space-y-3">
                {templates.map(template => (
                  <li key={template.id} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{template.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{template.subject}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleUseTemplate(template)} className="px-3 py-1 text-sm bg-green-500 text-white rounded-md">Use</button>
                      <button onClick={() => handleDeleteTemplate(template.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                        <TrashIcon className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
         <div className="flex justify-start pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition-colors duration-300"
            >
                Back to Campaign
            </button>
        </div>
      </div>
    </StepCard>
  );
};

export default TemplatesStep;
