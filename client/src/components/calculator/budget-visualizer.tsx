import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { BarChart3, PieChart, TrendingUp, AlertTriangle, Target, DollarSign } from "lucide-react";
import type { CostBreakdown } from "@/lib/calculator";

interface BudgetVisualizerProps {
  costBreakdown: CostBreakdown;
  onBudgetChange: (newBudget: number) => void;
}

export default function BudgetVisualizer({ costBreakdown, onBudgetChange }: BudgetVisualizerProps) {
  const [targetBudget, setTargetBudget] = useState(costBreakdown.total);
  const [selectedView, setSelectedView] = useState<'breakdown' | 'comparison' | 'timeline'>('breakdown');

  const budgetCategories = [
    { name: 'Booth & Construction', value: costBreakdown.boothCost + costBreakdown.constructionCost, color: 'bg-blue-500', icon: '🏗️' },
    { name: 'Travel & Accommodation', value: costBreakdown.travelCost + costBreakdown.staffCost, color: 'bg-green-500', icon: '✈️' },
    { name: 'Marketing & Services', value: costBreakdown.marketingCost + costBreakdown.servicesCost, color: 'bg-purple-500', icon: '📢' },
  ];

  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.value, 0);
  const budgetVariance = ((targetBudget - totalBudget) / totalBudget) * 100;
  const isOverBudget = targetBudget < totalBudget;

  const getOptimizationSuggestions = () => {
    if (!isOverBudget) return [];
    
    const deficit = totalBudget - targetBudget;
    const suggestions = [];

    if (costBreakdown.boothCost > targetBudget * 0.4) {
      suggestions.push({
        category: 'Booth & Construction',
        suggestion: 'Consider smaller booth size or modular design',
        savings: costBreakdown.boothCost * 0.2
      });
    }

    if (costBreakdown.travelCost > targetBudget * 0.25) {
      suggestions.push({
        category: 'Travel',
        suggestion: 'Book flights in advance or consider alternative accommodation',
        savings: costBreakdown.travelCost * 0.15
      });
    }

    if (costBreakdown.servicesCost > targetBudget * 0.15) {
      suggestions.push({
        category: 'Services',
        suggestion: 'Optimize service packages or bundle deals',
        savings: costBreakdown.servicesCost * 0.3
      });
    }

    return suggestions;
  };

  const suggestions = getOptimizationSuggestions();

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-white">Budget Visualizer</CardTitle>
          </div>
          <div className="flex gap-2">
            {['breakdown', 'comparison', 'timeline'].map((view) => (
              <Button
                key={view}
                variant={selectedView === view ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView(view as any)}
                className={selectedView === view ? 
                  "bg-blue-600 hover:bg-blue-700" : 
                  "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
                data-testid={`button-view-${view}`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        <CardDescription className="text-gray-400">
          Interactive budget analysis and optimization recommendations
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Budget Target Slider */}
        <div className="p-4 bg-gray-700/30 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white font-medium">Target Budget</span>
            <span className="text-2xl font-bold text-white">{formatCurrency(targetBudget)}</span>
          </div>
          <Slider
            value={[targetBudget]}
            onValueChange={(value) => {
              setTargetBudget(value[0]);
              onBudgetChange(value[0]);
            }}
            max={totalBudget * 1.5}
            min={totalBudget * 0.5}
            step={10000}
            className="w-full"
            data-testid="slider-budget-target"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>{formatCurrency(totalBudget * 0.5)}</span>
            <span>{formatCurrency(totalBudget * 1.5)}</span>
          </div>
        </div>

        {/* Budget Status */}
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          isOverBudget ? 'bg-red-900/30 border border-red-700/50' : 'bg-green-900/30 border border-green-700/50'
        }`}>
          {isOverBudget ? 
            <AlertTriangle className="w-5 h-5 text-red-400" /> : 
            <Target className="w-5 h-5 text-green-400" />
          }
          <div>
            <div className="text-white font-medium">
              {isOverBudget ? 'Over Budget' : 'Within Budget'}
            </div>
            <div className={`text-sm ${isOverBudget ? 'text-red-300' : 'text-green-300'}`}>
              {budgetVariance > 0 ? '+' : ''}{budgetVariance.toFixed(1)}% from current estimate
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className={`font-bold ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
              {formatCurrency(Math.abs(targetBudget - totalBudget))}
            </div>
            <div className="text-sm text-gray-400">
              {isOverBudget ? 'over' : 'under'}
            </div>
          </div>
        </div>

        {/* Visualization Views */}
        {selectedView === 'breakdown' && (
          <div className="space-y-4">
            <h4 className="text-white font-medium flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Cost Breakdown
            </h4>
            {budgetCategories.map((category, index) => {
              const percentage = (category.value / totalBudget) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-white">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{formatCurrency(category.value)}</div>
                      <div className="text-sm text-gray-400">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${category.color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedView === 'comparison' && (
          <div className="space-y-4">
            <h4 className="text-white font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Budget Scenarios
            </h4>
            <div className="grid gap-3">
              {[
                { name: 'Conservative', multiplier: 0.8, color: 'bg-green-500' },
                { name: 'Current Estimate', multiplier: 1.0, color: 'bg-blue-500' },
                { name: 'Optimistic', multiplier: 1.2, color: 'bg-orange-500' },
                { name: 'Premium', multiplier: 1.5, color: 'bg-red-500' }
              ].map((scenario, index) => {
                const cost = totalBudget * scenario.multiplier;
                const isSelected = Math.abs(cost - targetBudget) < totalBudget * 0.1;
                return (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setTargetBudget(cost)}
                    data-testid={`scenario-${scenario.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${scenario.color}`}></div>
                        <span className="text-white font-medium">{scenario.name}</span>
                      </div>
                      <span className="text-white">{formatCurrency(cost)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedView === 'timeline' && (
          <div className="space-y-4">
            <h4 className="text-white font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Payment Timeline
            </h4>
            <div className="space-y-3">
              {[
                { phase: 'Booking & Deposits', percentage: 30, timing: 'Immediately' },
                { phase: 'Booth Construction', percentage: 35, timing: '30 days before' },
                { phase: 'Travel & Logistics', percentage: 20, timing: '15 days before' },
                { phase: 'Final Services', percentage: 15, timing: 'During event' }
              ].map((phase, index) => {
                const amount = (totalBudget * phase.percentage) / 100;
                return (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{phase.phase}</div>
                      <div className="text-gray-400 text-sm">{phase.timing}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{formatCurrency(amount)}</div>
                      <div className="text-gray-400 text-sm">{phase.percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Optimization Suggestions */}
        {suggestions.length > 0 && (
          <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
            <h4 className="text-yellow-300 font-medium mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Budget Optimization Suggestions
            </h4>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-yellow-200 font-medium">{suggestion.category}</div>
                    <div className="text-yellow-100 text-sm">{suggestion.suggestion}</div>
                  </div>
                  <Badge variant="secondary" className="bg-green-900/50 text-green-300 ml-3">
                    Save {formatCurrency(suggestion.savings)}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-yellow-700/30">
              <div className="text-yellow-200 font-medium">
                Total Potential Savings: {formatCurrency(suggestions.reduce((sum, s) => sum + s.savings, 0))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}