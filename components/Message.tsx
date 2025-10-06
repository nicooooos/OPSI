
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import type { ChatMessage } from '../types';
import { MessageRole } from '../types';
import { UserIcon, AstroIcon } from './Icons';

interface MessageProps {
  message: ChatMessage;
  index: number;
}

export const Message: React.FC<MessageProps> = ({ message, index }) => {
  const isModel = message.role === MessageRole.MODEL;

  const containerClasses = isModel ? 'justify-start' : 'justify-end';
  const bubbleClasses = isModel
    ? 'bg-slate-800 border-t-purple-500 border-l-cyan-500'
    : 'bg-indigo-600 text-white';
  
  const markdownStyles = {
    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal list-inside ml-4 mb-2" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc list-inside ml-4 mb-2" {...props} />,
    li: ({node, ...props}) => <li className="mb-1" {...props} />,
    strong: ({node, ...props}) => <strong className="font-bold text-cyan-300" {...props} />,
    code: ({node, ...props}) => <code className="bg-slate-700 rounded px-1 text-sm font-mono" {...props} />,
  };

  return (
    <div
      className={`relative flex items-start gap-3 w-full animate-fade-in-up ${containerClasses}`}
    >
      {isModel && (
         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center shadow-lg">
             <AstroIcon />
         </div>
      )}
      <div className={`relative max-w-xl lg:max-w-3xl p-4 rounded-xl shadow-lg border-2 border-transparent ${bubbleClasses}`}>
        <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]} 
            components={markdownStyles}
        >
            {message.content}
        </ReactMarkdown>
      </div>
      {!isModel && (
         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center shadow-lg">
             <UserIcon />
         </div>
      )}
    </div>
  );
};