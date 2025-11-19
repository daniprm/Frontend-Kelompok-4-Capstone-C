'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  X,
  Minimize2,
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatbotPopup({ isOpen, onClose }: ChatbotPopupProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Halo! 👋 Saya asisten wisata virtual Surabaya. Saya siap membantu Anda menemukan tempat wisata menarik, kuliner khas, dan informasi lainnya tentang Surabaya. Ada yang bisa saya bantu?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content:
          'Maaf, terjadi kesalahan. Silakan coba lagi dalam beberapa saat. 😔',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Minimized State */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="group w-16 h-16 bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-2xl transition-all duration-200 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
          <MessageCircle className="w-8 h-8 relative z-10" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      ) : (
        /* Full Chatbot */
        <div className="relative w-[400px] max-w-[calc(100vw-3rem)]">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-[#F59E0B]/20 blur-xl"></div>

          <div className="relative bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[600px] max-h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="h-1 bg-[#F59E0B]"></div>
            <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Asisten Wisata Surabaya</h3>
                  <p className="text-xs text-white/80">Online 24/7</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-white/20 transition-colors duration-200"
                  title="Minimize"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 transition-colors duration-200"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center ${
                      message.role === 'user' ? 'bg-gray-800' : 'bg-[#F59E0B]'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`flex-1 max-w-[80%] ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block px-3 py-2 shadow-md text-left text-sm ${
                        message.role === 'user'
                          ? 'bg-gray-800 text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="markdown-content">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => (
                                <p className="mb-2 last:mb-0 text-gray-800">
                                  {children}
                                </p>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc list-inside mb-2 text-gray-800 space-y-1">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal list-inside mb-2 text-gray-800 space-y-1">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="text-gray-800">{children}</li>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-bold text-gray-900">
                                  {children}
                                </strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic text-gray-800">
                                  {children}
                                </em>
                              ),
                              h1: ({ children }) => (
                                <h1 className="text-lg font-bold mb-2 text-gray-900">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-base font-bold mb-2 text-gray-900">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-sm font-bold mb-2 text-gray-900">
                                  {children}
                                </h3>
                              ),
                              code: ({ children, className }) => {
                                const isInline = !className;
                                return isInline ? (
                                  <code className="bg-amber-100 text-amber-800 px-1 py-0.5 text-xs font-mono">
                                    {children}
                                  </code>
                                ) : (
                                  <code className="block bg-gray-100 text-gray-800 p-2 overflow-x-auto text-xs font-mono mb-2">
                                    {children}
                                  </code>
                                );
                              },
                              a: ({ children, href }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#F59E0B] hover:text-[#D97706] underline"
                                >
                                  {children}
                                </a>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-[#F59E0B] pl-4 italic text-gray-700 mb-2">
                                  {children}
                                </blockquote>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-1">
                      {message.timestamp.toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#F59E0B] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="inline-block px-3 py-2 bg-white border border-gray-200 shadow-md">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#F59E0B]" />
                      <span className="text-sm text-gray-600">
                        Sedang mengetik...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white p-3">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tanya tentang wisata Surabaya..."
                    disabled={isLoading}
                    rows={1}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 text-sm text-gray-900 placeholder:text-gray-400"
                    style={{
                      minHeight: '40px',
                      maxHeight: '100px',
                    }}
                  />
                  <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-4 py-2 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
