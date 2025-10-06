
import React, { useState, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { ChatWindow } from './components/ChatWindow';
import { InputBar } from './components/InputBar';
import { Header } from './components/Header';
import { StarryBackground } from './components/StarryBackground';
import { createChatSession } from './services/geminiService';
import type { ChatMessage, EducationLevel } from './types';
import { MessageRole } from './types';
import { EducationLevelSelector } from './components/EducationLevelSelector';
import { CosmicTimeline } from './components/CosmicTimeline';
import { CloseIcon, WarningIcon } from './components/Icons';
import { PromptSuggestions } from './components/PromptSuggestions';
import { useTranslations } from './contexts/LanguageContext';
import { audioService } from './services/audioService';

// --- Helper Component for Error Display ---
interface AppError {
  title: string;
  message: string;
}

interface ErrorDisplayProps {
  error: AppError | null;
  onClose: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div
      className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md p-4 animate-fade-in-fast-popup"
      role="alert"
    >
      <div className="bg-red-900/80 backdrop-blur-md border border-red-600 rounded-lg shadow-2xl text-white p-4 flex items-start gap-4">
        <div className="flex-shrink-0 text-red-400 mt-0.5">
          <WarningIcon />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-red-300">{error.title}</h3>
          <p className="text-sm text-red-200">{error.message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-red-300 hover:text-white transition-colors duration-200 rounded-full hover:bg-red-700/50 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Dismiss error"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useTranslations();

    return (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-sm rounded-md transition-colors ${language === 'en' ? 'bg-cyan-500 text-white font-bold' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>EN</button>
            <button onClick={() => setLanguage('id')} className={`px-3 py-1 text-sm rounded-md transition-colors ${language === 'id' ? 'bg-cyan-500 text-white font-bold' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>ID</button>
        </div>
    );
};

const Footer: React.FC = () => {
    return (
        <footer className="w-full text-center py-4 z-10">
            <p className="text-slate-500 text-sm">OPSI 2025 - Astro Synergy</p>
        </footer>
    );
};


const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<AppError | null>(null);
  const [educationLevel, setEducationLevel] = useState<EducationLevel | null>(null);
  const { language, t } = useTranslations();

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  const handleSelectLevel = useCallback((level: EducationLevel) => {
    try {
      audioService.playSelectSound();
      const chatSession = createChatSession(level, language);
      setChat(chatSession);
      setMessages([
        {
          role: MessageRole.MODEL,
          content: t.astroChatGreeting,
        },
      ]);
      setEducationLevel(level);
      setError(null); // Clear previous errors
    } catch (e) {
       if (e instanceof Error) {
            if (e.message.includes("API_KEY")) {
                setError({
                    title: t.errorApiKeyNotFoundTitle,
                    message: t.errorApiKeyNotFoundMessage
                });
            } else {
                setError({
                    title: t.errorInitializationFailedTitle,
                    message: `${t.errorUnexpectedErrorMessage} ${e.message}`
                });
            }
       } else {
          setError({
            title: t.errorUnknownErrorTitle,
            message: t.errorUnknownErrorMessage
          });
       }
    }
  }, [language, t]);
  
  const handleBack = useCallback(() => {
    setEducationLevel(null);
    setChat(null);
    setMessages([]);
    setError(null);
  }, []);

  const handleClearChat = useCallback(() => {
    audioService.playClearSound();
    setMessages([
      {
        role: MessageRole.MODEL,
        content: t.astroChatGreeting,
      },
    ]);
  }, [t.astroChatGreeting]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (isLoading || !text.trim() || !chat) return;
    
    audioService.playSendSound();
    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = { role: MessageRole.USER, content: text };
    setMessages(prev => [...prev, userMessage]);
    
    setMessages(prev => [...prev, { role: MessageRole.MODEL, content: "" }]);

    try {
      const stream = await chat.sendMessageStream({ message: text });
      
      let streamedContent = "";
      for await (const chunk of stream) {
        streamedContent += chunk.text;
        setMessages(prev => {
            const updatedMessages = [...prev];
            if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === MessageRole.MODEL) {
                 updatedMessages[updatedMessages.length - 1] = {
                  ...updatedMessages[updatedMessages.length - 1],
                  content: streamedContent,
                };
            }
            return updatedMessages;
        });
      }
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : t.errorUnexpectedErrorMessage;
        if (errorMessage.toLowerCase().includes('api key not valid')) {
             setError({
                title: t.errorAuthErrorTitle,
                message: t.errorAuthErrorMessage
             });
        } else {
             setError({
                title: t.errorFailedToSendTitle,
                message: `${t.errorCosmicAnomaly} ${errorMessage}`
             });
        }
        setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading, t]);

  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden antialiased bg-slate-900 text-white">
      <StarryBackground />
      <LanguageSwitcher />
      <ErrorDisplay error={error} onClose={handleDismissError} />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 z-10 flex flex-col gap-12 animate-fade-in-up">
        <CosmicTimeline />

        <div className="border-t-2 border-dashed border-slate-700/50" aria-hidden="true"></div>
        
        <div id="astrochat-section" className="min-h-[80vh] flex flex-col bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
          {!educationLevel ? (
            <EducationLevelSelector onSelectLevel={handleSelectLevel} />
          ) : (
            <>
              <Header onBack={handleBack} onClearChat={handleClearChat} />
              <main className="flex-1 flex flex-col p-4 overflow-y-auto">
                <ChatWindow messages={messages} isLoading={isLoading} />
                {messages.length === 1 && !isLoading && (
                  <PromptSuggestions onPromptClick={handleSendMessage} />
                )}
              </main>
              <footer className="p-4 border-t border-slate-700">
                <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
              </footer>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;