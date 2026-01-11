import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../../lib/hooks/use-llm';
import { Send, Bot, Cpu, Paperclip, Wrench } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export function ChatInterface({ messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput("");
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simple text file reading
    const text = await file.text();
    const prompt = `I have uploaded a file named "${file.name}".\n\nContent:\n${text}\n\nPlease analyze this file.`;
    
    onSendMessage(prompt);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.role === 'tool') {
       return (
         <div className="flex items-center text-xs text-gray-500 font-mono mt-1">
           <Wrench className="w-3 h-3 mr-1" />
           <span>Tool Output: {msg.content.substring(0, 50)}{msg.content.length > 50 ? '...' : ''}</span>
         </div>
       );
    }
    
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      return (
        <div className="space-y-2">
           {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
           <div className="flex flex-col gap-1">
             {msg.tool_calls.map((tc, i) => (
               <div key={i} className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                 <Wrench className="w-3 h-3 mr-1" />
                 <span>Using tool: {tc.function.name}</span>
               </div>
             ))}
           </div>
        </div>
      );
    }

    return <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>;
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="p-2 bg-blue-100 rounded-lg mr-3">
          <Bot className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="font-semibold text-gray-900">WebGemma Agent</h1>
          <div className="flex items-center text-xs text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
            Running locally (GPU)
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
            <Cpu className="w-16 h-16 mb-4" />
            <p>Ready to process. All data stays on this device.</p>
          </div>
        )}

        {messages.filter(m => m.role !== 'system').map((msg, idx) => {
          const isUser = msg.role === 'user';
          const isTool = msg.role === 'tool';
          
          if (isTool) {
             return (
               <div key={idx} className="flex justify-center my-2">
                 <div className="text-xs text-gray-400 flex items-center bg-gray-50 px-3 py-1 rounded-full">
                   <Wrench className="w-3 h-3 mr-2" />
                   Executed {msg.name}
                 </div>
               </div>
             );
          }

          return (
            <div 
              key={idx} 
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                flex max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3
                ${isUser 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'}
              `}>
                {renderMessageContent(msg)}
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleFileClick}
            disabled={isLoading}
            className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            title="Upload text file for analysis"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input 
             type="file"
             ref={fileInputRef}
             onChange={handleFileChange}
             className="hidden"
             accept=".txt,.md,.json,.csv,.js,.ts,.tsx,.py" 
          />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask WebGemma anything..."
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block pl-5 pr-12 py-3.5 shadow-sm transition-all"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-full text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400">
                AI can make mistakes. Check important info.
            </p>
        </div>
      </div>
    </div>
  );
}
