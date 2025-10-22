import React, { useState, useEffect } from 'react';
import { Recipient, Campaign, SendResult, Template } from './types';

import Header from './components/Header';
import LandingStep from './components/LandingStep';
import ComposeStep from './components/ComposeStep';
import SendStep from './components/SendStep';
import CompleteStep from './components/CompleteStep';
import ProfileStep from './components/ProfileStep';
import TemplatesStep from './components/TemplatesStep';


type AppStep = 'landing' | 'profile' | 'compose' | 'send' | 'complete' | 'templates';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Campaign state
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendResult, setSendResult] = useState<SendResult>({ success: 0, failed: 0 });

  // History
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    // Simulate checking for a logged-in user
    const loggedInUser = sessionStorage.getItem('userEmail');
    if (loggedInUser) {
      setUserEmail(loggedInUser);
      setCurrentStep('profile');
    } else {
      setCurrentStep('landing');
    }
     // Load campaigns from local storage
    const savedCampaigns = localStorage.getItem('campaigns');
    if (savedCampaigns) {
      // Dates need to be re-hydrated
      setCampaigns(JSON.parse(savedCampaigns).map((c: any) => ({...c, sentAt: new Date(c.sentAt)})));
    }
  }, []);

  const handleConnect = () => {
    // Simulate login
    const email = 'demo@example.com';
    setUserEmail(email);
    sessionStorage.setItem('userEmail', email);
    setCurrentStep('compose');
  };
  
  const handleLogout = () => {
    setUserEmail(null);
    sessionStorage.removeItem('userEmail');
    setCurrentStep('landing');
    resetCampaign();
  };
  
  const resetCampaign = () => {
    setRecipients([]);
    setSubject('');
    setBody('');
    setSendResult({ success: 0, failed: 0 });
    setCurrentStep('compose');
  };

  const handleSendComplete = (result: SendResult) => {
    setSendResult(result);
    const newCampaign: Campaign = {
      id: new Date().toISOString(),
      subject,
      body,
      recipientsCount: recipients.length,
      result,
      sentAt: new Date(),
    };
    const updatedCampaigns = [...campaigns, newCampaign];
    setCampaigns(updatedCampaigns);
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    setCurrentStep('complete');
  };

  const handleUseTemplate = (template: Template) => {
    setSubject(template.subject);
    setBody(template.body);
    setCurrentStep('compose');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'profile':
        return <ProfileStep campaigns={campaigns} onStartNew={resetCampaign} />;
      case 'templates':
        return <TemplatesStep onUseTemplate={handleUseTemplate} onBack={() => setCurrentStep('compose')} />;
      case 'compose':
        return (
          <ComposeStep
            recipients={recipients}
            setRecipients={setRecipients}
            subject={subject}
            setSubject={setSubject}
            body={body}
            setBody={setBody}
            onNext={() => setCurrentStep('send')}
            onNavigateTemplates={() => setCurrentStep('templates')}
          />
        );
      case 'send':
        return (
          <SendStep
            recipients={recipients}
            subject={subject}
            body={body}
            onComplete={handleSendComplete}
          />
        );
      case 'complete':
        return (
          <CompleteStep 
            result={sendResult} 
            onReset={resetCampaign} 
            onViewCampaigns={() => setCurrentStep('profile')}
          />
        );
      case 'landing':
        // Landing step is handled outside this function for layout purposes
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen font-sans">
      <Header 
        userEmail={userEmail} 
        onLogout={handleLogout} 
        onNavigateProfile={() => setCurrentStep('profile')}
      />
      {currentStep === 'landing' ? (
        <LandingStep onConnect={handleConnect} />
      ) : (
        <main className="container mx-auto px-4 md:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {renderStep()}
          </div>
        </main>
      )}
    </div>
  );
};

export default App;