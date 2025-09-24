import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, Lightbulb, HelpCircle, TrendingUp, MapPin } from "lucide-react";
import type { FormData, CostBreakdown } from "@/lib/calculator";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  formData: FormData;
  costBreakdown: CostBreakdown;
}

export default function AIAssistant({ formData, costBreakdown }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI exhibition planning assistant. I can help you optimize costs, find better vendors, suggest venues, and answer any questions about your exhibition planning. What would you like to know?',
      timestamp: new Date(),
      suggestions: [
        'How can I reduce booth costs?',
        'Suggest venues in my city',
        'Best time for exhibitions?',
        'Compare vendor options'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      return await apiRequest("/api/ai/chat", "POST", {
        message,
        formData,
        costBreakdown,
        context: messages.slice(-5) // Last 5 messages for context
      });
    },
    onSuccess: (response: any) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: response.message,
        timestamp: new Date(),
        suggestions: response.suggestions
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    },
    onError: () => {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try asking your question again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  });

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    chatMutation.mutate(message);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const quickActions = [
    { icon: TrendingUp, text: 'Optimize my costs', color: 'text-green-400' },
    { icon: MapPin, text: 'Find venues nearby', color: 'text-blue-400' },
    { icon: Lightbulb, text: 'Cost saving tips', color: 'text-yellow-400' },
    { icon: HelpCircle, text: 'Exhibition best practices', color: 'text-purple-400' }
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Bot className="w-5 h-5 text-blue-400" />
          <CardTitle className="text-white">AI Exhibition Assistant</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Get personalized planning tips and cost optimization advice
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSendMessage(action.text)}
              className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700 justify-start"
              data-testid={`button-quick-action-${index}`}
            >
              <action.icon className={`w-4 h-4 ${action.color}`} />
              {action.text}
            </Button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-900/30 rounded-lg border border-gray-700">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'assistant' && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {message.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.suggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors text-xs border-blue-600 text-blue-400"
                        onClick={() => handleSuggestionClick(suggestion)}
                        data-testid={`suggestion-${index}`}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 order-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-700 text-gray-100 p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask about venues, costs, vendors, or planning tips..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            disabled={chatMutation.isPending}
            data-testid="input-ai-chat"
          />
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={chatMutation.isPending || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700"
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Context Info */}
        <div className="text-xs text-gray-500 p-2 bg-gray-700/20 rounded">
          💡 I have access to your current exhibition details: {formData.destinationCity}, booth size {formData.boothSize}sqm, 
          team of {formData.teamSize}, estimated cost ₹{costBreakdown.total.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}