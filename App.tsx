
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
import { AIVisualization } from './components/AIVisualization';

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


const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<AppError | null>(null);
  const [educationLevel, setEducationLevel] = useState<EducationLevel | null>(null);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  const handleSelectLevel = useCallback((level: EducationLevel) => {
    try {
      const chatSession = createChatSession(level);
      setChat(chatSession);
      setMessages([
        {
          role: MessageRole.MODEL,
          content: "Greetings! I am AstroChat AI. Ask me anything about the vast, wondrous universe. What cosmic mystery is on your mind today?",
        },
      ]);
      setEducationLevel(level);
      setError(null); // Clear previous errors
    } catch (e) {
       if (e instanceof Error) {
            // Fix: Updated error check to look for "API_KEY" and updated the user-facing message.
            if (e.message.includes("API_KEY")) {
                setError({
                    title: 'API Key Not Found',
                    message: 'The Gemini API key is missing. Please ensure it is configured as API_KEY in your environment (e.g., in Vercel settings).'
                });
            } else {
                setError({
                    title: 'Initialization Failed',
                    message: `An unexpected error occurred: ${e.message}`
                });
            }
       } else {
          setError({
            title: 'Unknown Error',
            message: 'An unknown error occurred during initialization.'
          });
       }
    }
  }, []);
  
  const handleBack = useCallback(() => {
    setEducationLevel(null);
    setChat(null);
    setMessages([]);
    setError(null);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (isLoading || !text.trim() || !chat) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = { role: MessageRole.USER, content: text };
    setMessages(prev => [...prev, userMessage]);
    
    // Add empty placeholder for streaming
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
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
        if (errorMessage.toLowerCase().includes('api key not valid')) {
             setError({
                title: 'Authentication Error',
                message: 'Your Gemini API key appears to be invalid or has expired. Please check your credentials.'
             });
        } else {
             setError({
                title: 'Message Failed to Send',
                message: `A cosmic anomaly occurred: ${errorMessage}`
             });
        }
        // Remove the optimistic empty model message
        setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading]);

  return (
    <div className="relative flex flex-col min-h-screen w-screen overflow-x-hidden antialiased bg-slate-900 text-white">
      <StarryBackground />
      <ErrorDisplay error={error} onClose={handleDismissError} />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 z-10 flex flex-col gap-12">
        <AIVisualization />
        <CosmicTimeline />

        <div className="border-t-2 border-dashed border-slate-700/50" aria-hidden="true"></div>
        
        {/* AstroChat AI Section Wrapper */}
        <div className="min-h-[80vh] flex flex-col bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
          {!educationLevel ? (
            <EducationLevelSelector onSelectLevel={handleSelectLevel} />
          ) : (
            <>
              <Header onBack={handleBack} />
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
    </div>
  );
};

export default App;
