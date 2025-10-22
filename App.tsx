import React, { useState, useEffect } from 'react';
import { Recipient, Campaign, SendResult, Template, GoogleProfile } from './types';
import { GoogleOAuthProvider, useGoogleLogin, googleLogout } from '@react-oauth/google';

import Header from './components/Header';
import LandingStep from './components/LandingStep';
import ComposeStep from './components/ComposeStep';
import SendStep from './components/SendStep';
import CompleteStep from './components/CompleteStep';
import ProfileStep from './components/ProfileStep';
import TemplatesStep from './components/TemplatesStep';

type AppStep = 'landing' | 'profile' | 'compose' | 'send' | 'complete' | 'templates';

const AppContent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [userProfile, setUserProfile] = useState<GoogleProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Campaign state
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendResult, setSendResult] = useState<SendResult>({ success: 0, failed: 0 });

  // History
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    // Check for logged-in user in session storage
    const storedProfile = sessionStorage.getItem('userProfile');
    const storedToken = sessionStorage.getItem('accessToken');
    if (storedProfile && storedToken) {
      setUserProfile(JSON.parse(storedProfile));
      setAccessToken(storedToken);
      setCurrentStep('profile');
    }

    // Load campaigns from local storage
    const savedCampaigns = localStorage.getItem('campaigns');
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns).map((c: any) => ({ ...c, sentAt: new Date(c.sentAt) })));
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      sessionStorage.setItem('accessToken', tokenResponse.access_token);
      
      // Fetch user profile
      try {
        const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { 'Authorization': `Bearer ${tokenResponse.access_token}` },
        });
        if (!profileResponse.ok) throw new Error('Failed to fetch profile');
        const profile: GoogleProfile = await profileResponse.json();
        setUserProfile(profile);
        sessionStorage.setItem('userProfile', JSON.stringify(profile));
        setCurrentStep('compose');
      } catch (error) {
        console.error('Profile fetch error:', error);
        // Handle error - maybe logout
      }
    },
    onError: errorResponse => console.error('Login Error:', errorResponse),
    scope: 'https://www.googleapis.com/auth/gmail.send',
  });

  const handleLogout = () => {
    googleLogout();
    setUserProfile(null);
    setAccessToken(null);
    sessionStorage.removeItem('userProfile');
    sessionStorage.removeItem('accessToken');
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
        if (!userProfile || !accessToken) return null; // Should not happen
        return (
          <SendStep
            recipients={recipients}
            subject={subject}
            body={body}
            onComplete={handleSendComplete}
            userEmail={userProfile.email}
            accessToken={accessToken}
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
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen font-sans">
      <Header 
        userProfile={userProfile} 
        onLogout={handleLogout} 
        onNavigateProfile={() => setCurrentStep('profile')}
      />
      {currentStep === 'landing' ? (
        <LandingStep onConnect={() => login()} />
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

const App: React.FC = () => {
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-config');
        if (!response.ok) {
          let errorMessage = `Could not load configuration. Server responded with status ${response.status}.`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.error) {
              errorMessage = errorData.error;
            }
          } catch (e) {
            // Ignore if the response body is not valid JSON
          }
          throw new Error(errorMessage);
        }
        const config = await response.json();
        if (config.clientId) {
          setGoogleClientId(config.clientId);
        } else {
          throw new Error('Client ID missing in configuration response.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        console.error(err);
      }
    };
    fetchConfig();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-800">
        <div className="text-center p-8 max-w-lg">
          <h1 className="text-2xl font-bold mb-2">Configuration Error</h1>
          <p className="mb-4">{error}</p>
          <p className="text-sm text-red-700">Please ensure the `REACT_APP_GOOGLE_CLIENT_ID` environment variable is correctly set in your Netlify project's deployment settings and that the deployment has been successfully rebuilt.</p>
        </div>
      </div>
    );
  }

  if (!googleClientId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AppContent />
    </GoogleOAuthProvider>
  );
};


export default App;