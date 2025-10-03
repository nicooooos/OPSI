
import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { Message } from './Message';
import { LoadingIndicator } from './LoadingIndicator';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto space-y-6 pr-2">
      {messages.map((msg, index) => (
        <Message key={index} message={msg} index={index} />
      ))}
      {isLoading && messages[messages.length - 1]?.role !== 'user' && (
        <div className="flex justify-start">
            <LoadingIndicator />
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};
