import React from 'react';
import { ChatMessage } from '../types/chat';
import { Bot, User, Calculator } from 'lucide-react';

interface MessageProps {
  message: ChatMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const hasToolCalls = message.toolCalls && message.toolCalls.length > 0;

  return (
    <div className={`flex gap-3 p-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        
        {hasToolCalls && (
          <div className="mt-2 space-y-2">
            {message.toolCalls!.map((toolCall) => (
              <div
                key={toolCall.id}
                className="bg-blue-50 border border-blue-200 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 text-sm text-blue-700 mb-1">
                  <Calculator className="w-4 h-4" />
                  <span className="font-medium">{toolCall.name}</span>
                </div>
                <div className="text-xs text-blue-600 mb-1">
                  <strong>Args:</strong> {JSON.stringify(toolCall.args)}
                </div>
                {toolCall.result && (
                  <div className="text-xs text-blue-600">
                    <strong>Result:</strong> {toolCall.result}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}; 