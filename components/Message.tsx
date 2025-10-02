import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import type { ChatMessage } from '../types';
import { MessageRole } from '../types';
import { UserIcon, AstroIcon, VisualizeIcon } from './Icons';

interface MessageProps {
  message: ChatMessage;
  onVisualize: (content: string) => void;
  index: number;
}

export const Message: React.FC<MessageProps> = ({ message, onVisualize, index }) => {
  const [isHovered, setIsHovered] = useState(false);
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
      className={`relative flex items-start gap-3 w-full animate-fade-in ${containerClasses}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        {/* Show visualize button only on model messages, on hover, when there's content, and it's not the very first greeting message (index > 0) */}
        {isModel && isHovered && message.content && index > 0 && (
            <button
                onClick={() => onVisualize(message.content)}
                className="absolute bottom-2 right-2 p-1.5 bg-slate-900/60 text-cyan-300 rounded-full backdrop-blur-sm hover:bg-cyan-500 hover:text-white transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-500 z-10"
                aria-label="Visualize content"
                title="Visualize"
            >
                <VisualizeIcon />
            </button>
        )}
      </div>
      {!isModel && (
         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center shadow-lg">
             <UserIcon />
         </div>
      )}
    </div>
  );
};
