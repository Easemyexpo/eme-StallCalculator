import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Building2, 
  Plane, 
  Users, 
  Megaphone,
  Settings,
  Lightbulb,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface BudgetCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  minPercentage: number;
  maxPercentage: number;
  recommendedPercentage: number;
  currentPercentage: number;
  amount: number;
  priority: 'high' | 'medium' | 'low';
}

interface BudgetGoal {
  id: string;
  name: string;
  description: string;
  allocations: Record<string, number>;
}

interface BudgetWizardProps {
  totalBudget?: number;
  industry?: string;
  primaryGoals?: string[];
  onAllocationUpdate?: (allocations: Record<string, number>) => void;
}

const BUDGET_GOALS: BudgetGoal[] = [
  {
    id: 'lead_generation',
    name: 'Lead Generation Focus',
    description: 'Maximize visitor engagement and lead capture',
    allocations: {
      booth_construction: 35,
      marketing_materials: 25,
      staff_operations: 20,
      travel_accommodation: 15,
      technology_av: 5
    }
  },
  {
    id: 'brand_awareness',
    name: 'Brand Awareness',
    description: 'Build brand recognition and market presence',
    allocations: {
      booth_construction: 45,
      marketing_materials: 30,
      staff_operations: 15,
      travel_accommodation: 8,
      technology_av: 2
    }
  },
  {
    id: 'product_launch',
    name: 'Product Launch',
    description: 'Showcase new products with maximum impact',
    allocations: {
      booth_construction: 40,
      marketing_materials: 20,
      staff_operations: 15,
      travel_accommodation: 15,
      technology_av: 10
    }
  },
  {
    id: 'cost_effective',
    name: 'Cost-Effective Participation',
    description: 'Maximize ROI with minimal investment',
    allocations: {
      booth_construction: 30,
      marketing_materials: 15,
      staff_operations: 25,
      travel_accommodation: 25,
      technology_av: 5
    }
  },
  {
    id: 'premium_presence',
    name: 'Premium Market Presence',
    description: 'High-end booth with premium experience',
    allocations: {
      booth_construction: 50,
      marketing_materials: 20,
      staff_operations: 15,
      travel_accommodation: 10,
      technology_av: 5
    }
  }
];

const INDUSTRY_MULTIPLIERS = {
  'Technology': { booth_construction: 1.1, technology_av: 1.5, marketing_materials: 1.2 },
  'Healthcare': { booth_construction: 1.2, staff_operations: 1.3, marketing_materials: 1.1 },
  'Automotive': { booth_construction: 1.4, marketing_materials: 1.3, technology_av: 1.2 },
  'Fashion': { booth_construction: 1.3, marketing_materials: 1.4, staff_operations: 1.1 },
  'Manufacturing': { booth_construction: 1.1, staff_operations: 1.2, travel_accommodation: 1.1 }
};

export function BudgetAllocationWizard({ 
  totalBudget = 500000, 
  industry = 'Technology',
  primaryGoals = ['lead_generation'],
  onAllocationUpdate 
}: BudgetWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<string>('lead_generation');
  const [customBudget, setCustomBudget] = useState(totalBudget);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const initializeCategories = () => {
    const baseCategories: BudgetCategory[] = [
      {
        id: 'booth_construction',
        name: 'Booth Construction',
        icon: Building2,
        description: 'Stall design, materials, fabrication',
        minPercentage: 25,
        maxPercentage: 60,
        recommendedPercentage: 40,
        currentPercentage: 40,
        amount: 0,
        priority: 'high'
      },
      {
        id: 'marketing_materials',
        name: 'Marketing & Branding',
        icon: Megaphone,
        description: 'Brochures, giveaways, promotional materials',
        minPercentage: 10,
        maxPercentage: 35,
        recommendedPercentage: 20,
        currentPercentage: 20,
        amount: 0,
        priority: 'medium'
      },
      {
        id: 'staff_operations',
        name: 'Staff & Operations',
        icon: Users,
        description: 'Personnel costs, training, operations',
        minPercentage: 15,
        maxPercentage: 30,
        recommendedPercentage: 20,
        currentPercentage: 20,
        amount: 0,
        priority: 'high'
      },
      {
        id: 'travel_accommodation',
        name: 'Travel & Stay',
        icon: Plane,
        description: 'Flights, hotels, local transportation',
        minPercentage: 10,
        maxPercentage: 30,
        recommendedPercentage: 15,
        currentPercentage: 15,
        amount: 0,
        priority: 'medium'
      },
      {
        id: 'technology_av',
        name: 'Technology & AV',
        icon: Settings,
        description: 'Audio-visual equipment, digital displays',
        minPercentage: 2,
        maxPercentage: 15,
        recommendedPercentage: 5,
        currentPercentage: 5,
        amount: 0,
        priority: 'low'
      }
    ];

    // Apply goal-based allocations
    const goalConfig = BUDGET_GOALS.find(goal => goal.id === selectedGoal);
    if (goalConfig) {
      baseCategories.forEach(category => {
        const goalPercentage = goalConfig.allocations[category.id] || category.recommendedPercentage;
        category.currentPercentage = goalPercentage;
      });
    }

    // Apply industry multipliers
    const multipliers = INDUSTRY_MULTIPLIERS[industry as keyof typeof INDUSTRY_MULTIPLIERS];
    if (multipliers) {
      baseCategories.forEach(category => {
        const multiplier = multipliers[category.id as keyof typeof multipliers] || 1;
        category.currentPercentage = Math.min(
          category.maxPercentage,
          Math.max(category.minPercentage, category.currentPercentage * multiplier)
        );
      });
    }

    // Normalize percentages to 100%
    const totalPercentage = baseCategories.reduce((sum, cat) => sum + cat.currentPercentage, 0);
    baseCategories.forEach(category => {
      category.currentPercentage = Math.round((category.currentPercentage / totalPercentage) * 100);
      category.amount = Math.round((category.currentPercentage / 100) * customBudget);
    });

    setCategories(baseCategories);
  };

  useEffect(() => {
    initializeCategories();
  }, [selectedGoal, industry, customBudget]);

  useEffect(() => {
    if (onAllocationUpdate) {
      const allocations = categories.reduce((acc, category) => {
        acc[category.id] = category.amount;
        return acc;
      }, {} as Record<string, number>);
      onAllocationUpdate(allocations);
    }
  }, [categories, onAllocationUpdate]);

  const updateCategoryPercentage = (categoryId: string, percentage: number) => {
    setCategories(prev => {
      const updated = prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, currentPercentage: percentage, amount: Math.round((percentage / 100) * customBudget) }
          : cat
      );
      
      // Ensure total is 100%
      const totalOthers = updated.filter(cat => cat.id !== categoryId).reduce((sum, cat) => sum + cat.currentPercentage, 0);
      const remaining = 100 - percentage;
      
      if (totalOthers > 0 && remaining > 0) {
        updated.forEach(cat => {
          if (cat.id !== categoryId) {
            const adjustedPercentage = Math.round((cat.currentPercentage / totalOthers) * remaining);
            cat.currentPercentage = adjustedPercentage;
            cat.amount = Math.round((adjustedPercentage / 100) * customBudget);
          }
        });
      }
      
      return updated;
    });
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const budgetVariance = totalAllocated - customBudget;

  return (
    <div className="space-y-6">
      {/* Header - Mobile Responsive */}
      <div className="text-center mb-6 sm:mb-8">
        <PieChart className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Budget Allocation Wizard</h2>
        <p className="text-sm sm:text-base text-gray-600 px-4">
          Optimize your exhibition budget with AI-powered recommendations
        </p>
      </div>

      <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))}>
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="0" className="text-xs sm:text-sm py-2 sm:py-3">
            <span className="hidden sm:inline">Budget & Goals</span>
            <span className="sm:hidden">Setup</span>
          </TabsTrigger>
          <TabsTrigger value="1" className="text-xs sm:text-sm py-2 sm:py-3">
            <span className="hidden sm:inline">Smart Allocation</span>
            <span className="sm:hidden">Allocate</span>
          </TabsTrigger>
          <TabsTrigger value="2" className="text-xs sm:text-sm py-2 sm:py-3">
            <span className="hidden sm:inline">Fine-tune & Review</span>
            <span className="sm:hidden">Review</span>
          </TabsTrigger>
        </TabsList>

        {/* Step 1: Budget & Goals */}
        <TabsContent value="0" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Budget & Objectives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="budget">Total Exhibition Budget</Label>
                <div className="relative">
                  <Input
                    id="budget"
                    type="number"
                    value={customBudget}
                    onChange={(e) => setCustomBudget(parseInt(e.target.value) || 0)}
                    className="pl-8"
                    placeholder="e.g., 500000"
                  />
                  <DollarSign className="w-4 h-4 absolute left-2.5 top-3 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Enter your total available budget in INR
                </p>
              </div>

              <div>
                <Label>Primary Exhibition Goal</Label>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {BUDGET_GOALS.map((goal) => (
                    <div
                      key={goal.id}
                      className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedGoal === goal.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedGoal(goal.id)}
                    >
                      <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{goal.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{goal.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setCurrentStep(1)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Generate Smart Allocation
                  <TrendingUp className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Smart Allocation */}
        <TabsContent value="1" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  AI-Recommended Allocation
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  {industry} Industry
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div key={category.id} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-start sm:items-center justify-between mb-3">
                        <div className="flex items-start sm:items-center min-w-0 flex-1 mr-3">
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 sm:mr-3 mt-0.5 sm:mt-0 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{category.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{category.description}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-base sm:text-lg font-bold text-gray-900">
                            {category.currentPercentage}%
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            {formatCurrency(category.amount)}
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={category.currentPercentage} 
                        className="h-1.5 sm:h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Min: {category.minPercentage}%</span>
                        <span>Max: {category.maxPercentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-gray-900">Total Allocated</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(totalAllocated)}
                  </span>
                </div>
                {budgetVariance !== 0 && (
                  <div className="flex items-center mt-2">
                    <AlertCircle className="w-4 h-4 text-orange-500 mr-2" />
                    <span className="text-sm text-orange-700">
                      {budgetVariance > 0 ? 'Over' : 'Under'} budget by {formatCurrency(Math.abs(budgetVariance))}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(0)}
                  className="w-full sm:w-auto text-sm"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm"
                >
                  <span className="hidden sm:inline">Fine-tune Allocation</span>
                  <span className="sm:hidden">Next Step</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Fine-tune & Review */}
        <TabsContent value="2" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Fine-tune Your Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div key={category.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <IconComponent className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold">{category.currentPercentage}%</span>
                          <div className="text-sm text-gray-600">
                            {formatCurrency(category.amount)}
                          </div>
                        </div>
                      </div>
                      <Slider
                        value={[category.currentPercentage]}
                        onValueChange={(value) => updateCategoryPercentage(category.id, value[0])}
                        min={category.minPercentage}
                        max={category.maxPercentage}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Min: {category.minPercentage}%</span>
                        <span>Recommended: {category.recommendedPercentage}%</span>
                        <span>Max: {category.maxPercentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                <h3 className="font-bold text-lg mb-4">Budget Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Total Budget</div>
                    <div className="text-xl font-bold">{formatCurrency(customBudget)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Allocated</div>
                    <div className="text-xl font-bold">{formatCurrency(totalAllocated)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Remaining</div>
                    <div className={`text-xl font-bold ${budgetVariance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(customBudget - totalAllocated)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    // Save allocation and apply to stall design pricing
                    const allocations = categories.reduce((acc, category) => {
                      acc[category.id] = category.amount;
                      return acc;
                    }, {} as Record<string, number>);
                    
                    if (onAllocationUpdate) {
                      onAllocationUpdate(allocations);
                    }
                    
                    // Save to localStorage for stall calculator to use
                    localStorage.setItem('budgetAllocation', JSON.stringify(allocations));
                    localStorage.setItem('totalBudget', totalBudget.toString());
                    
                    // Dispatch event to update stall design pricing
                    window.dispatchEvent(new CustomEvent('budgetAllocationUpdated', {
                      detail: { allocations, totalBudget }
                    }));
                    
                    // Close the wizard
                    window.dispatchEvent(new CustomEvent('closeBudgetWizard'));
                    
                    console.log('Budget allocation applied to stall design:', allocations);
                  }}
                >
                  Save Allocation
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}