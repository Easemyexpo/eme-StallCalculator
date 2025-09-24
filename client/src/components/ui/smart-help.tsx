import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles, X, Send, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SmartHelpProps {
  context: {
    currentStep: string;
    formData: any;
    completedSteps: string[];
  };
}

interface HelpMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function SmartHelp({ context }: SmartHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<HelpMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hi! I'm your real-time AI exhibition assistant powered by advanced AI. I can instantly help you with exhibition planning, cost optimization, vendor selection, and industry insights. Currently helping with: ${context.currentStep}. What would you like to know?`,
      timestamp: new Date(),
      suggestions: [
        "What's the optimal booth size for my industry?",
        "How can I reduce costs without compromising quality?",
        "What are the best practices for team planning?"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: HelpMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Call real-time AI API
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        const aiResponse: HelpMessage = {
          id: Date.now().toString(),
          type: 'ai',
          content: data.response,
          timestamp: new Date(),
          suggestions: data.suggestions || []
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI Chat error:', error);
      const errorResponse: HelpMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: "I'm experiencing technical difficulties. Please try your question again in a moment.",
        timestamp: new Date(),
        suggestions: ["How to optimize costs?", "Industry best practices?", "Next steps recommendations?"]
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <>
      {/* Floating Help Button - Mobile Optimized */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-30 w-10 h-10 md:w-12 md:h-12 md:bottom-24 md:left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-4 h-4 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
        
        {/* Notification badge for new suggestions - Hidden on mobile */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="hidden md:block absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
        >
          <Sparkles className="w-3 h-3" />
        </motion.div>
      </motion.button>

      {/* Help Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            className="fixed bottom-4 left-4 right-4 md:right-auto z-40 w-auto md:w-80 h-[400px] md:h-[450px]"
          >
            <Card className="bg-white/90 backdrop-blur-lg border border-gray-200/30 shadow-2xl h-full flex flex-col">
              <CardHeader className="border-b border-gray-100 flex-shrink-0 p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900">Smart Assistant</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Currently helping with: <span className="font-medium text-green-600">{context.currentStep}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-green-500 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        
                        {/* AI Suggestions */}
                        {message.type === 'ai' && message.suggestions && (
                          <div className="mt-3 space-y-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left text-xs p-2 bg-white/20 hover:bg-white/30 rounded border border-gray-200/30 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 p-3 rounded-lg rounded-bl-none">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-100 p-4 flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(inputValue);
                        }
                      }}
                      placeholder="Ask me anything about your exhibition..."
                      className="flex-1 text-sm border-gray-200 focus:border-green-400"
                    />
                    <Button
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim()}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white px-3"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

