import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, DollarSign, Target, Users, Building, TrendingUp, PieChart, Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EnhancedBudgetWizardProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  costs: any;
  onBudgetAllocated: (allocation: any) => void;
}

interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  color: string;
}

export function EnhancedBudgetWizard({ isOpen, onClose, formData, costs, onBudgetAllocated }: EnhancedBudgetWizardProps) {
  const [step, setStep] = useState(1);
  const [budgetForm, setBudgetForm] = useState({
    company: '',
    projectName: '',
    totalBudget: costs?.total || 0,
    budgetPeriod: '',
    priority: '',
    expectedROI: '',
    riskTolerance: '',
    targetAudience: '',
    goals: '',
    contingency: 10
  });

  const [allocations, setAllocations] = useState<BudgetCategory[]>([
    { id: 'booth', name: 'Booth & Construction', percentage: 40, amount: 0, color: 'bg-blue-500' },
    { id: 'travel', name: 'Travel & Accommodation', percentage: 25, amount: 0, color: 'bg-green-500' },
    { id: 'marketing', name: 'Marketing & Promotion', percentage: 20, amount: 0, color: 'bg-purple-500' },
    { id: 'staff', name: 'Staff & Operations', percentage: 10, amount: 0, color: 'bg-orange-500' },
    { id: 'contingency', name: 'Contingency Fund', percentage: 5, amount: 0, color: 'bg-gray-500' }
  ]);

  const updateAllocation = (id: string, percentage: number) => {
    const newAllocations = [...allocations];
    const targetIndex = newAllocations.findIndex(a => a.id === id);
    
    if (targetIndex !== -1) {
      const oldPercentage = newAllocations[targetIndex].percentage;
      const difference = percentage - oldPercentage;
      
      // Update target category
      newAllocations[targetIndex].percentage = percentage;
      
      // Redistribute difference among other categories proportionally
      const otherCategories = newAllocations.filter((_, index) => index !== targetIndex);
      const totalOther = otherCategories.reduce((sum, cat) => sum + cat.percentage, 0);
      
      if (totalOther > 0) {
        otherCategories.forEach(cat => {
          const adjustmentRatio = cat.percentage / totalOther;
          cat.percentage = Math.max(0, cat.percentage - (difference * adjustmentRatio));
        });
      }
      
      // Ensure total is 100%
      const total = newAllocations.reduce((sum, cat) => sum + cat.percentage, 0);
      if (total !== 100) {
        const adjustment = (100 - total) / newAllocations.length;
        newAllocations.forEach(cat => {
          cat.percentage = Math.max(0, cat.percentage + adjustment);
        });
      }
      
      // Calculate amounts
      newAllocations.forEach(cat => {
        cat.amount = (budgetForm.totalBudget * cat.percentage) / 100;
      });
      
      setAllocations(newAllocations);
    }
  };

  const handleFormChange = (field: string, value: string | number) => {
    setBudgetForm(prev => ({ ...prev, [field]: value }));
    
    if (field === 'totalBudget') {
      const newAllocations = allocations.map(cat => ({
        ...cat,
        amount: (Number(value) * cat.percentage) / 100
      }));
      setAllocations(newAllocations);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    const allocationData = {
      form: budgetForm,
      allocations,
      timestamp: new Date().toISOString()
    };
    
    // Generate and download the budget plan
    generateBudgetPDF(allocationData);
    
    // Apply the budget allocation
    onBudgetAllocated(allocationData);
    onClose();
  };

  const generateBudgetPDF = (data: any) => {
    const content = `
Budget Allocation Plan

Company: ${data.form.company}
Project: ${data.form.projectName}
Total Budget: ${formatCurrency(data.form.totalBudget)}
Expected ROI: ${data.form.expectedROI}%

Budget Breakdown:
${data.allocations.map((cat: any) => 
  `${cat.name}: ${formatCurrency(cat.amount)} (${cat.percentage.toFixed(1)}%)`
).join('\n')}

Goals: ${data.form.goals}

Generated on: ${new Date().toLocaleDateString('en-IN')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.form.company}-${data.form.projectName}-budget-plan.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: formData.currency || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Smart Budget Allocation Wizard</h2>
              <p className="text-gray-600">Step {step} of 4: Optimize your exhibition budget</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={(step / 4) * 100} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span className={step >= 1 ? 'text-emerald-600 font-medium' : ''}>Company Info</span>
              <span className={step >= 2 ? 'text-emerald-600 font-medium' : ''}>Budget Planning</span>
              <span className={step >= 3 ? 'text-emerald-600 font-medium' : ''}>Fund Allocation</span>
              <span className={step >= 4 ? 'text-emerald-600 font-medium' : ''}>Review & Download</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Company Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Building className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">Company & Project Details</h3>
                <p className="text-gray-600">Tell us about your company and exhibition project</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    value={budgetForm.company}
                    onChange={(e) => handleFormChange('company', e.target.value)}
                    placeholder="Enter your company name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="projectName">Project/Exhibition Name *</Label>
                  <Input
                    id="projectName"
                    value={budgetForm.projectName}
                    onChange={(e) => handleFormChange('projectName', e.target.value)}
                    placeholder="Enter project name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Select onValueChange={(value) => handleFormChange('targetAudience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="b2b">B2B Professionals</SelectItem>
                      <SelectItem value="b2c">End Consumers</SelectItem>
                      <SelectItem value="both">Both B2B & B2C</SelectItem>
                      <SelectItem value="investors">Investors & Partners</SelectItem>
                      <SelectItem value="media">Media & Press</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="budgetPeriod">Budget Period</Label>
                  <Select onValueChange={(value) => handleFormChange('budgetPeriod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Event</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="multi">Multi-Event Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="goals">Exhibition Goals & Objectives</Label>
                <Textarea
                  id="goals"
                  value={budgetForm.goals}
                  onChange={(e) => handleFormChange('goals', e.target.value)}
                  placeholder="Describe your exhibition goals, expected outcomes, and success metrics..."
                  className="mt-1 h-24"
                />
              </div>
            </div>
          )}

          {/* Step 2: Budget Planning */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <DollarSign className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">Budget Parameters</h3>
                <p className="text-gray-600">Set your budget limits and risk preferences</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="totalBudget">Total Budget Available</Label>
                  <Input
                    id="totalBudget"
                    type="number"
                    value={budgetForm.totalBudget}
                    onChange={(e) => handleFormChange('totalBudget', Number(e.target.value))}
                    placeholder="Enter total budget"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">Current estimate: {formatCurrency(costs?.total || 0)}</p>
                </div>
                
                <div>
                  <Label htmlFor="expectedROI">Expected ROI (%)</Label>
                  <Select onValueChange={(value) => handleFormChange('expectedROI', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select expected ROI" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100-200">100% - 200%</SelectItem>
                      <SelectItem value="200-300">200% - 300%</SelectItem>
                      <SelectItem value="300-500">300% - 500%</SelectItem>
                      <SelectItem value="500+">500%+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="priority">Budget Priority</Label>
                  <Select onValueChange={(value) => handleFormChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cost-effective">Cost Effective</SelectItem>
                      <SelectItem value="balanced">Balanced Approach</SelectItem>
                      <SelectItem value="premium">Premium Quality</SelectItem>
                      <SelectItem value="maximum-impact">Maximum Impact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                  <Select onValueChange={(value) => handleFormChange('riskTolerance', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk tolerance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Contingency Fund: {budgetForm.contingency}%</Label>
                <Slider
                  value={[budgetForm.contingency]}
                  onValueChange={(value) => handleFormChange('contingency', value[0])}
                  max={20}
                  min={5}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>5% (Minimal)</span>
                  <span>20% (Maximum)</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Fund Allocation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <PieChart className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">Allocate Your Budget</h3>
                <p className="text-gray-600">Distribute funds across different categories</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{formatCurrency(budgetForm.totalBudget)}</div>
                  <div className="text-gray-600">Total Budget Available</div>
                </div>
              </div>
              
              <div className="space-y-4">
                {allocations.map((category) => (
                  <Card key={category.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-600">{formatCurrency(category.amount)}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{category.percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    
                    <Slider
                      value={[category.percentage]}
                      onValueChange={(value) => updateAllocation(category.id, value[0])}
                      max={60}
                      min={0}
                      step={1}
                      className="mt-2"
                    />
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>60%</span>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Allocation Summary</h4>
                <div className="space-y-1 text-sm">
                  {allocations.map((cat) => (
                    <div key={cat.id} className="flex justify-between">
                      <span className="text-blue-700">{cat.name}:</span>
                      <span className="font-medium text-blue-900">{formatCurrency(cat.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Download */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">Budget Plan Complete</h3>
                <p className="text-gray-600">Review your allocation and download the detailed plan</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Project Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company:</span>
                      <span className="font-medium">{budgetForm.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Project:</span>
                      <span className="font-medium">{budgetForm.projectName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Budget:</span>
                      <span className="font-medium">{formatCurrency(budgetForm.totalBudget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected ROI:</span>
                      <span className="font-medium">{budgetForm.expectedROI}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="p-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Budget Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {allocations.map((cat) => (
                      <div key={cat.id} className="flex justify-between">
                        <span className="text-gray-600">{cat.name}:</span>
                        <span className="font-medium">{formatCurrency(cat.amount)} ({cat.percentage.toFixed(1)}%)</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">ROI Optimization Tips</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Focus 40-50% budget on booth design for maximum visual impact</li>
                  <li>• Allocate 20-25% for marketing to drive pre-event awareness</li>
                  <li>• Keep 10-15% contingency for unexpected opportunities</li>
                  <li>• Track all expenses and measure ROI post-event</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-6">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
            
            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={step === 1 && (!budgetForm.company || !budgetForm.projectName)}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <Download className="w-4 h-4" />
                <span>Download Plan</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}