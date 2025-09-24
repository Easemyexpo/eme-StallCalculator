import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Sparkles, X, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AITooltipProps {
  context: string;
  fieldName: string;
  currentValue?: any;
  formData?: any;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: React.ReactNode;
}

interface AISuggestion {
  type: 'tip' | 'recommendation' | 'warning' | 'optimization';
  title: string;
  content: string;
  action?: {
    label: string;
    value: any;
  };
}

export function AITooltip({ 
  context, 
  fieldName, 
  currentValue, 
  formData, 
  position = 'top',
  trigger
}: AITooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = async () => {
    if (!isOpen || suggestions.length > 0) return;
    
    setIsLoading(true);
    
    try {
      // Generate contextual suggestions based on field and current state
      const contextualSuggestions = await getContextualSuggestions(
        context, 
        fieldName, 
        currentValue, 
        formData
      );
      setSuggestions(contextualSuggestions);
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error);
      setSuggestions([{
        type: 'tip',
        title: 'Help Available',
        content: 'Consider industry best practices for this field to optimize your exhibition planning.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      generateSuggestions();
    }
  }, [isOpen, context, fieldName, currentValue]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'recommendation': return <TrendingUp className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'optimization': return <Sparkles className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'recommendation': return 'border-blue-200 bg-blue-50/80 text-blue-800';
      case 'warning': return 'border-orange-200 bg-orange-50/80 text-orange-800';
      case 'optimization': return 'border-purple-200 bg-purple-50/80 text-purple-800';
      default: return 'border-green-200 bg-green-50/80 text-green-800';
    }
  };

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 text-gray-400 hover:text-green-600 transition-colors duration-200"
        aria-label={`Get AI help for ${fieldName}`}
      >
        {trigger || <HelpCircle className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`absolute ${positionClasses[position]} z-50 w-80`}
          >
            <Card className="bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">AI Assistant</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {isLoading ? (
                  <div className="flex items-center gap-2 py-4 text-sm text-gray-600">
                    <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                    Generating personalized suggestions...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-lg border ${getColorForType(suggestion.type)}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 mt-0.5">
                            {getIconForType(suggestion.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium mb-1">
                              {suggestion.title}
                            </div>
                            <div className="text-xs opacity-90 leading-relaxed">
                              {suggestion.content}
                            </div>
                            {suggestion.action && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 h-6 text-xs"
                                onClick={() => {
                                  // Handle action - this would trigger form updates
                                  console.log('AI suggestion action:', suggestion.action);
                                  setIsOpen(false);
                                }}
                              >
                                {suggestion.action.label}
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// AI-powered suggestion generation
async function getContextualSuggestions(
  context: string,
  fieldName: string,
  currentValue: any,
  formData: any
): Promise<AISuggestion[]> {
  const suggestions: AISuggestion[] = [];

  // Context-specific suggestions based on field and current form state
  switch (context) {
    case 'booth-design':
      suggestions.push(...getBoothDesignSuggestions(fieldName, currentValue, formData));
      break;
    case 'travel-planning':
      suggestions.push(...getTravelPlanningSuggestions(fieldName, currentValue, formData));
      break;
    case 'budget-planning':
      suggestions.push(...getBudgetPlanningSuggestions(fieldName, currentValue, formData));
      break;
    case 'event-details':
      suggestions.push(...getEventDetailsSuggestions(fieldName, currentValue, formData));
      break;
    default:
      suggestions.push(...getGeneralSuggestions(fieldName, currentValue, formData));
  }

  return suggestions.slice(0, 3); // Limit to 3 suggestions for better UX
}

function getBoothDesignSuggestions(fieldName: string, currentValue: any, formData: any): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  switch (fieldName) {
    case 'area':
      if (currentValue && currentValue < 20) {
        suggestions.push({
          type: 'recommendation',
          title: 'Consider Larger Space',
          content: 'For maximum impact, booths 20-30 sqm allow for better product displays and visitor flow. Industry data shows 25% higher lead generation.',
          action: { label: 'Set to 24 sqm', value: 24 }
        });
      }
      if (currentValue > 50) {
        suggestions.push({
          type: 'optimization',
          title: 'Cost Optimization',
          content: 'Large booths require significant investment. Consider modular design to maximize ROI while maintaining impact.',
        });
      }
      break;

    case 'wallType':
      suggestions.push({
        type: 'tip',
        title: 'Material Selection',
        content: 'MDF panels offer the best balance of cost, durability, and visual appeal for most exhibitions. Premium materials like fabric walls create luxury appeal but increase costs by 30-40%.'
      });
      break;

    case 'flooring':
      if (formData?.industry?.includes('Chemical') || formData?.industry?.includes('Industrial')) {
        suggestions.push({
          type: 'recommendation',
          title: 'Industry-Specific Choice',
          content: 'For chemical/industrial exhibitions, anti-static or anti-slip flooring is recommended for safety and professionalism.',
          action: { label: 'Select Anti-Slip', value: 'anti_slip' }
        });
      }
      break;
  }

  return suggestions;
}

function getTravelPlanningSuggestions(fieldName: string, currentValue: any, formData: any): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  switch (fieldName) {
    case 'teamSize':
      if (currentValue > 8) {
        suggestions.push({
          type: 'optimization',
          title: 'Team Efficiency',
          content: 'Large teams increase costs significantly. Consider sending 4-6 core members initially, with additional staff joining for peak days only.',
        });
      }
      if (currentValue < 3) {
        suggestions.push({
          type: 'warning',
          title: 'Minimum Coverage',
          content: 'Small teams may struggle with booth coverage during breaks and peak hours. Consider at least 3-4 members for optimal visitor engagement.',
        });
      }
      break;

    case 'accommodationLevel':
      if (formData?.eventDuration > 4) {
        suggestions.push({
          type: 'tip',
          title: 'Extended Stay Optimization',
          content: 'For exhibitions longer than 4 days, business-class accommodation improves team performance and reduces fatigue-related errors.'
        });
      }
      break;
  }

  return suggestions;
}

function getBudgetPlanningSuggestions(fieldName: string, currentValue: any, formData: any): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  if (fieldName === 'totalBudget') {
    const boothCost = formData?.boothSize * 15000; // Estimated
    const budgetRatio = boothCost / currentValue;

    if (budgetRatio > 0.6) {
      suggestions.push({
        type: 'warning',
        title: 'Budget Allocation Alert',
        content: 'Booth construction is consuming >60% of budget. Consider reducing size or selecting cost-effective materials to allocate funds for marketing and travel.'
      });
    }

    if (currentValue < 500000) {
      suggestions.push({
        type: 'recommendation',
        title: 'Minimum Investment',
        content: 'For meaningful ROI, exhibitions typically require ₹5-8 lakhs minimum investment including booth, travel, and marketing for effective market presence.'
      });
    }
  }

  return suggestions;
}

function getEventDetailsSuggestions(fieldName: string, currentValue: any, formData: any): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  switch (fieldName) {
    case 'industry':
      suggestions.push({
        type: 'tip',
        title: 'Industry Best Practices',
        content: 'Research your industry\'s typical booth designs and visitor expectations. Some sectors favor minimalist approaches while others require extensive product displays.'
      });
      break;

    case 'eventDuration':
      if (currentValue > 5) {
        suggestions.push({
          type: 'optimization',
          title: 'Extended Event Strategy',
          content: 'Long exhibitions allow for multiple engagement strategies. Plan different activities for each day to maintain visitor interest and team energy.'
        });
      }
      break;
  }

  return suggestions;
}

function getGeneralSuggestions(fieldName: string, currentValue: any, formData: any): AISuggestion[] {
  return [{
    type: 'tip',
    title: 'Industry Insight',
    content: 'Consider how this choice impacts your overall exhibition objectives and visitor experience. Data-driven decisions typically yield 20-30% better ROI.'
  }];
}