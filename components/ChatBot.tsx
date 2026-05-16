"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MessageSquare, X, Send, Bot, User, Loader2, RotateCcw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = { 
  role: 'assistant', 
  content: 'नमस्ते! मैं ThinkIndia.press डिजिटल डेस्क हूँ। क्या मैं आपको झारखंड या ताज़ा खबरें जानने में मदद कर सकता हूँ?' 
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('think_india_chat');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([INITIAL_MESSAGE]);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('think_india_chat', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const restartChat = () => {
    if (confirm('क्या आप चैट को रीस्टार्ट करना चाहते हैं?')) {
      setMessages([INITIAL_MESSAGE]);
      localStorage.removeItem('think_india_chat');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages as Message[]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'माफ़ करें, अभी कोई तकनीकी समस्या आ रही है। कृपया थोड़ी देर बाद प्रयास करें।' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content: string) => {
    if (content.startsWith('IMAGE_URL:')) {
      const url = content.replace('IMAGE_URL:', '');
      return (
        <div className="flex flex-col gap-2">
          <p className="mb-2">यहाँ आपकी जनरेट की हुई इमेज है:</p>
          <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-gray-200 shadow-inner bg-gray-100">
            <Image 
              src={url} 
              alt="AI Generated News Coverage" 
              fill 
              unoptimized 
              className="object-cover" 
            />
          </div>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] text-brand-red font-bold uppercase mt-1 hover:underline"
          >
            Download High-Res
          </a>
        </div>
      );
    }
    return content;
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-4 w-14 h-14 rounded-full bg-white border border-brand-red shadow-xl hover:scale-105 transition-all z-50 flex items-center justify-center p-2 group ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Open AI Chat"
      >
        <div className="relative w-full h-full">
            <Image 
                src="/logo-think-india.png" 
                alt="ThinkIndia.press Logo" 
                fill 
                className="object-contain grayscale group-hover:grayscale-0 transition-all" 
            />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-red rounded-full border-2 border-white animate-pulse" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-4 w-[calc(100vw-32px)] sm:w-96 h-[500px] max-h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 transition-all origin-bottom-right border border-gray-200 overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-black text-white p-4 flex justify-between items-center border-b-2 border-brand-red">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 bg-white rounded-full p-1 overflow-hidden">
              <Image src="/logo-think-india.png" alt="Logo" fill className="object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-[14px] leading-tight tracking-tight uppercase">ThinkIndia.press <span className="text-brand-red">Support</span></h3>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Bureau Desk Online</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
                onClick={restartChat}
                className="text-gray-400 hover:text-white transition-colors"
                title="Restart Chat"
            >
                <RotateCcw size={18} />
            </button>
            <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
            >
                <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9F9F9]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border ${msg.role === 'user' ? 'bg-gray-100 border-gray-200' : 'bg-white border-brand-red/20'}`}>
                  {msg.role === 'user' ? (
                    <User size={16} className="text-gray-600" />
                  ) : (
                    <div className="relative w-5 h-5">
                      <Image src="/logo-think-india.png" alt="AI" fill className="object-contain" />
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-brand-red text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[85%] flex-row">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-brand-red/20 flex items-center justify-center overflow-hidden">
                    <div className="relative w-5 h-5">
                      <Image src="/logo-think-india.png" alt="AI" fill className="object-contain" />
                    </div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-800 rounded-tl-none flex items-center shadow-sm">
                  <Loader2 size={16} className="animate-spin text-brand-red" />
                  <span className="ml-2 text-[12px] text-gray-500 font-bold uppercase">Processing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask ThinkIndia AI about Jharkhand, US or Global news..."
              disabled={isLoading}
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red text-[13px] font-medium disabled:bg-gray-50"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-brand-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-brand-red transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="text-center mt-3">
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">ThinkIndia Digital Bureau • 2026</span>
          </div>
        </form>
      </div>
    </>
  );
}
