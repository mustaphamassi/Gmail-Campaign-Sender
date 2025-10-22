import React, { useState, useCallback } from 'react';
import { AppStep, Recipient, SendResult, Campaign } from './types';
import AuthStep from './components/AuthStep';
import ComposeStep from './components/ComposeStep';
import SendStep from './components/SendStep';
import Header from './components/Header';
import CompleteStep from './components/CompleteStep';
import ProfileStep from './components/ProfileStep';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.AUTHENTICATE);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [sendResult, setSendResult] = useState<SendResult | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const handleConnect = useCallback(() => {
    // In a real application, this would trigger an OAuth flow.
    // Here we simulate a successful connection.
    setUserEmail('your.email@gmail.com');
    setCurrentStep(AppStep.COMPOSE);
  }, []);

  const handleLogout = useCallback(() => {
    setUserEmail(null);
    setCurrentStep(AppStep.AUTHENTICATE);
    setSubject('');
    setBody('');
    setRecipients([]);
    setSendResult(null);
    // We don't clear campaigns to simulate them being stored on a server
  }, []);

  const navigateToProfile = useCallback(() => {
    setCurrentStep(AppStep.PROFILE);
  }, []);

  const handleComposeSubmit = useCallback(() => {
    setCurrentStep(AppStep.SEND);
  }, []);

  const handleSendComplete = useCallback((result: SendResult) => {
    const newCampaign: Campaign = {
      id: new Date().toISOString(),
      subject,
      recipientsCount: recipients.length,
      sentAt: new Date(),
      result,
    };
    setCampaigns(prev => [newCampaign, ...prev]); // Prepend to show newest first
    setSendResult(result);
    setCurrentStep(AppStep.COMPLETE);
  }, [subject, recipients.length]);
  
  const handleReset = useCallback(() => {
    setSubject('');
    setBody('');
    setRecipients([]);
    setSendResult(null);
    setCurrentStep(AppStep.COMPOSE);
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case AppStep.AUTHENTICATE:
        return <AuthStep onConnect={handleConnect} />;
      case AppStep.COMPOSE:
        return (
          <ComposeStep
            userEmail={userEmail!}
            subject={subject}
            setSubject={setSubject}
            body={body}
            setBody={setBody}
            recipients={recipients}
            setRecipients={setRecipients}
            onSubmit={handleComposeSubmit}
          />
        );
      case AppStep.SEND:
        return (
            <SendStep
              subject={subject}
              body={body}
              recipients={recipients}
              onComplete={handleSendComplete}
            />
        );
      case AppStep.COMPLETE:
          return <CompleteStep result={sendResult!} onReset={handleReset} onViewCampaigns={navigateToProfile}/>;
      case AppStep.PROFILE:
          return <ProfileStep campaigns={campaigns} onStartNew={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Header
        userEmail={userEmail}
        onLogout={handleLogout}
        onNavigateProfile={navigateToProfile}
      />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {renderStep()}
        </div>
      </main>
    </div>
  );
};

export default App;
