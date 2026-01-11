import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../../lib/hooks/use-llm';
import { AVAILABLE_MODELS } from '../../lib/constants';
import { Send, Bot, Paperclip, Wrench, Sparkles, User, ShieldCheck, ChevronLeft } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  selectedModelId: string;
  onBack: () => void;
}

export function ChatInterface({ messages, onSendMessage, isLoading, selectedModelId, onBack }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeModel = AVAILABLE_MODELS.find(m => m.id === selectedModelId);

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
         <div className="flex items-center text-xs text-indigo-300/70 font-mono mt-1 bg-indigo-950/30 px-2 py-1 rounded border border-indigo-500/20">
           <Wrench className="w-3 h-3 mr-2" />
           <span>Tool Output: {msg.content.substring(0, 50)}{msg.content.length > 50 ? '...' : ''}</span>
         </div>
       );
    }
    
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      return (
        <div className="space-y-3">
           {msg.content && <p className="whitespace-pre-wrap leading-relaxed text-gray-100">{msg.content}</p>}
           <div className="flex flex-col gap-2">
             {msg.tool_calls.map((tc, i) => (
               <div key={i} className="flex items-center text-xs text-cyan-300 bg-cyan-950/30 px-3 py-2 rounded-lg border border-cyan-500/20 shadow-sm">
                 <Wrench className="w-3 h-3 mr-2" />
                 <span>Using tool: <span className="font-mono opacity-80">{tc.function.name}</span></span>
               </div>
             ))}
           </div>
        </div>
      );
    }

    return <p className="whitespace-pre-wrap text-[15px] leading-7 text-gray-100">{msg.content}</p>;
  };

  return (
    <div className="flex flex-col h-screen text-white relative z-0">
      
      {/* Header - Glassmorphism */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 mr-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Back to Model Selection"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {activeModel?.name || 'WebGemma'}
            </h1>
            <div className="flex items-center text-[10px] font-medium text-emerald-400/90 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-[pulse_3s_infinite]"></span>
              {activeModel?.quantType || 'GPU'} Active
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Privacy Verified</span>
            </div>
            <span className="text-xs text-white/30 font-light border border-white/10 px-3 py-1 rounded-full bg-white/5">Local Inference</span>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-30 group-hover:opacity-50 blur transition duration-500"></div>
                <div className="relative p-6 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 ring-1 ring-white/5">
                    <Sparkles className="w-10 h-10 text-indigo-400" />
                </div>
            </div>
            <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-semibold text-white">How can I help you today?</h2>
                <p className="text-gray-400 text-sm">I'm running entirely on your browser. Your data never leaves this device.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-8">
                {['Explain quantum computing', 'Write a python script', 'Analyze this text', 'Tell me a joke'].map((suggestion) => (
                    <button 
                        key={suggestion}
                        onClick={() => onSendMessage(suggestion)}
                        className="text-left px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl text-sm text-gray-300 transition-all duration-200"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
          </div>
        )}

        {messages.filter(m => m.role !== 'system').map((msg, idx) => {
          const isUser = msg.role === 'user';
          const isTool = msg.role === 'tool';
          
          if (isTool) {
             return (
               <div key={idx} className="flex justify-center my-4 opacity-70">
                 <div className="text-xs text-indigo-300 flex items-center bg-indigo-950/40 border border-indigo-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                   <Wrench className="w-3 h-3 mr-2" />
                   Executed {msg.name}
                 </div>
               </div>
             );
          }

          return (
            <div 
              key={idx} 
              className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
            >
              <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
                
                {/* Avatar / Name (Optional for cleanliness, but adds to the feel) */}
                <div className="flex items-center gap-2 mb-1 px-1">
                    {isUser ? null : <Bot className="w-3 h-3 text-indigo-400" />}
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                        {isUser ? 'You' : 'WebGemma'}
                    </span>
                    {isUser ? <User className="w-3 h-3 text-gray-500" /> : null}
                </div>

                <div className={`
                  relative px-5 py-4 rounded-2xl shadow-sm backdrop-blur-md
                  ${isUser 
                    ? 'bg-indigo-600/90 text-white rounded-tr-none border border-indigo-500/50 shadow-indigo-900/20' 
                    : 'bg-zinc-900/80 text-gray-100 rounded-tl-none border border-white/10 shadow-black/20'}
                `}>
                  {renderMessageContent(msg)}
                </div>
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1 px-1">
                    <Bot className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">WebGemma</span>
                </div>
                <div className="bg-zinc-900/80 rounded-2xl rounded-tl-none px-5 py-4 flex items-center space-x-1.5 border border-white/10 backdrop-blur-md">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm">
        <form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative flex items-end gap-2 bg-zinc-900/90 border border-white/10 p-2 rounded-[24px] shadow-xl shadow-black/50 ring-1 ring-white/5 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all duration-300"
        >
          <button
            type="button"
            onClick={handleFileClick}
            disabled={isLoading}
            className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            title="Upload text file"
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
            placeholder="Type a message..."
            className="w-full bg-transparent border-0 text-white placeholder-gray-500 text-sm focus:ring-0 focus:outline-none py-3 px-2 max-h-32"
            disabled={isLoading}
            autoComplete="off"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:text-gray-500 rounded-full text-white transition-all duration-200 shadow-lg shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-center mt-3">
            <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">
                {activeModel?.name || 'WebGemma'} • Running Locally on your {activeModel?.quantType || 'GPU'}
            </p>
        </div>
      </div>
    </div>
  );
}