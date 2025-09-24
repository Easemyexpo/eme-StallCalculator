import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Users, 
  Target, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  AlertCircle,
  Star
} from 'lucide-react';

interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ExhibitionProfile {
  companyName: string;
  industry: string;
  companySize: string;
  exhibitionExperience: string;
  primaryGoals: string[];
  targetAudience: string;
  budget: string;
  preferredCities: string[];
  eventTypes: string[];
  timeframe: string;
  marketingFocus: string[];
  boothPreferences: string;
  teamSize: number;
  specificRequirements: string;
}

interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionable: boolean;
}

const wizardSteps: WizardStep[] = [
  {
    id: 1,
    title: "Company Profile",
    description: "Tell us about your company and exhibition experience",
    icon: <Building2 className="w-5 h-5" />
  },
  {
    id: 2,
    title: "Exhibition Goals",
    description: "What do you want to achieve at exhibitions?",
    icon: <Target className="w-5 h-5" />
  },
  {
    id: 3,
    title: "Event Preferences",
    description: "Your preferred exhibition types and locations",
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: 4,
    title: "Budget & Timeline",
    description: "Your budget range and preferred timing",
    icon: <Calendar className="w-5 h-5" />
  },
  {
    id: 5,
    title: "Personalized Plan",
    description: "Your customized exhibition strategy",
    icon: <TrendingUp className="w-5 h-5" />
  }
];

export function PlanningWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<ExhibitionProfile>({
    companyName: '',
    industry: '',
    companySize: '',
    exhibitionExperience: '',
    primaryGoals: [],
    targetAudience: '',
    budget: '',
    preferredCities: [],
    eventTypes: [],
    timeframe: '',
    marketingFocus: [],
    boothPreferences: '',
    teamSize: 1,
    specificRequirements: ''
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const progress = (currentStep / wizardSteps.length) * 100;

  const industries = [
    'Technology', 'Healthcare', 'Manufacturing', 'Food & Beverage', 
    'Automotive', 'Fashion & Textiles', 'Finance', 'Education',
    'Construction', 'Pharmaceuticals', 'Energy', 'Telecommunications'
  ];

  const companySizes = [
    'Startup (1-10 employees)',
    'Small (11-50 employees)', 
    'Medium (51-200 employees)',
    'Large (201-1000 employees)',
    'Enterprise (1000+ employees)'
  ];

  const experienceLevels = [
    'First-time exhibitor',
    'Beginner (1-2 exhibitions)',
    'Intermediate (3-10 exhibitions)',
    'Experienced (10+ exhibitions)',
    'Expert (regular exhibitor)'
  ];

  const exhibitionGoals = [
    'Generate leads',
    'Brand awareness',
    'Product launch',
    'Network with industry peers',
    'Market research',
    'Customer feedback',
    'Competitor analysis',
    'Sales conversion',
    'Partnership opportunities',
    'Investor meetings'
  ];

  const indianCities = [
    'Mumbai', 'New Delhi', 'Bangalore', 'Chennai', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Kochi'
  ];

  const eventTypeOptions = [
    'Trade shows',
    'Consumer exhibitions',
    'Technology conferences',
    'Industry-specific events',
    'B2B exhibitions',
    'Product showcases',
    'Innovation summits',
    'Startup events'
  ];

  const marketingFocusOptions = [
    'Digital marketing',
    'Print materials',
    'Product demonstrations',
    'Interactive displays',
    'Video presentations',
    'Social media campaigns',
    'Influencer partnerships',
    'PR & media coverage'
  ];

  const handleGoalToggle = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goal)
        ? prev.primaryGoals.filter(g => g !== goal)
        : [...prev.primaryGoals, goal]
    }));
  };

  const handleCityToggle = (city: string) => {
    setProfile(prev => ({
      ...prev,
      preferredCities: prev.preferredCities.includes(city)
        ? prev.preferredCities.filter(c => c !== city)
        : [...prev.preferredCities, city]
    }));
  };

  const handleEventTypeToggle = (eventType: string) => {
    setProfile(prev => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(eventType)
        ? prev.eventTypes.filter(t => t !== eventType)
        : [...prev.eventTypes, eventType]
    }));
  };

  const handleMarketingToggle = (focus: string) => {
    setProfile(prev => ({
      ...prev,
      marketingFocus: prev.marketingFocus.includes(focus)
        ? prev.marketingFocus.filter(f => f !== focus)
        : [...prev.marketingFocus, focus]
    }));
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    
    // Simulate AI analysis based on profile
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newRecommendations: Recommendation[] = [];

    // Industry-specific recommendations
    if (profile.industry === 'Technology') {
      newRecommendations.push({
        title: 'Focus on Tech Trade Shows',
        description: 'Target NASSCOM events, TechSummit, and IT exhibitions in Bangalore and Pune for maximum industry relevance.',
        priority: 'high',
        category: 'Event Selection',
        actionable: true
      });
    }

    // Experience-based recommendations
    if (profile.exhibitionExperience === 'First-time exhibitor') {
      newRecommendations.push({
        title: 'Start with Regional Events',
        description: 'Begin with smaller regional exhibitions to gain experience before investing in large national trade shows.',
        priority: 'high',
        category: 'Strategy',
        actionable: true
      });
      
      newRecommendations.push({
        title: 'Pre-Exhibition Training',
        description: 'Invest in staff training for booth management, lead capture, and visitor engagement techniques.',
        priority: 'medium',
        category: 'Preparation',
        actionable: true
      });
    }

    // Budget-based recommendations
    if (profile.budget === 'Under ₹5 lakhs') {
      newRecommendations.push({
        title: 'Optimize Booth Size',
        description: 'Consider a 9-12 sqm booth with smart design to maximize impact within budget constraints.',
        priority: 'high',
        category: 'Budget Optimization',
        actionable: true
      });
    }

    // Goal-based recommendations
    if (profile.primaryGoals.includes('Generate leads')) {
      newRecommendations.push({
        title: 'Lead Capture Strategy',
        description: 'Implement digital lead capture with QR codes and follow-up automation for better conversion rates.',
        priority: 'high',
        category: 'Lead Generation',
        actionable: true
      });
    }

    if (profile.primaryGoals.includes('Brand awareness')) {
      newRecommendations.push({
        title: 'Visual Impact Focus',
        description: 'Invest in eye-catching booth design with interactive displays and social media integration.',
        priority: 'medium',
        category: 'Branding',
        actionable: true
      });
    }

    // City-specific recommendations
    if (profile.preferredCities.includes('Mumbai')) {
      newRecommendations.push({
        title: 'Mumbai Exhibition Strategy',
        description: 'Book accommodation in Powai or BKC area for easy access to MMRDA and NESCO exhibition centers.',
        priority: 'medium',
        category: 'Logistics',
        actionable: true
      });
    }

    // Team size recommendations
    if (profile.teamSize >= 4) {
      newRecommendations.push({
        title: 'Team Management',
        description: 'Implement shift schedules and assign specific roles (demo specialist, lead capture, relationship manager).',
        priority: 'medium',
        category: 'Team Strategy',
        actionable: true
      });
    }

    setRecommendations(newRecommendations);
    setIsGenerating(false);
  };

  useEffect(() => {
    if (currentStep === 5) {
      generateRecommendations();
    }
  }, [currentStep]);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return profile.companyName && profile.industry && profile.companySize && profile.exhibitionExperience;
      case 2:
        return profile.primaryGoals.length > 0 && profile.targetAudience;
      case 3:
        return profile.preferredCities.length > 0 && profile.eventTypes.length > 0;
      case 4:
        return profile.budget && profile.timeframe;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < wizardSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={profile.companyName}
                onChange={(e) => setProfile(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Enter your company name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select onValueChange={(value) => setProfile(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="companySize">Company Size</Label>
              <Select onValueChange={(value) => setProfile(prev => ({ ...prev, companySize: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experience">Exhibition Experience</Label>
              <Select onValueChange={(value) => setProfile(prev => ({ ...prev, exhibitionExperience: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Primary Exhibition Goals (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {exhibitionGoals.map(goal => (
                  <div
                    key={goal}
                    onClick={() => handleGoalToggle(goal)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      profile.primaryGoals.includes(goal)
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded border ${
                        profile.primaryGoals.includes(goal) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                      }`}>
                        {profile.primaryGoals.includes(goal) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm">{goal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                value={profile.targetAudience}
                onChange={(e) => setProfile(prev => ({ ...prev, targetAudience: e.target.value }))}
                placeholder="Describe your ideal exhibition visitors (e.g., decision makers in manufacturing, tech startups, retail buyers)"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Preferred Exhibition Cities</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {indianCities.map(city => (
                  <div
                    key={city}
                    onClick={() => handleCityToggle(city)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      profile.preferredCities.includes(city)
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded border ${
                        profile.preferredCities.includes(city) ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}>
                        {profile.preferredCities.includes(city) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm">{city}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Preferred Event Types</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {eventTypeOptions.map(eventType => (
                  <div
                    key={eventType}
                    onClick={() => handleEventTypeToggle(eventType)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      profile.eventTypes.includes(eventType)
                        ? 'bg-purple-50 border-purple-500 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded border ${
                        profile.eventTypes.includes(eventType) ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                      }`}>
                        {profile.eventTypes.includes(eventType) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm">{eventType}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="budget">Exhibition Budget Range</Label>
              <Select onValueChange={(value) => setProfile(prev => ({ ...prev, budget: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under ₹5 lakhs">Under ₹5 lakhs</SelectItem>
                  <SelectItem value="₹5-15 lakhs">₹5-15 lakhs</SelectItem>
                  <SelectItem value="₹15-30 lakhs">₹15-30 lakhs</SelectItem>
                  <SelectItem value="₹30-50 lakhs">₹30-50 lakhs</SelectItem>
                  <SelectItem value="Above ₹50 lakhs">Above ₹50 lakhs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeframe">Preferred Exhibition Timeframe</Label>
              <Select onValueChange={(value) => setProfile(prev => ({ ...prev, timeframe: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="When do you plan to exhibit?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Next 3 months">Next 3 months</SelectItem>
                  <SelectItem value="3-6 months">3-6 months</SelectItem>
                  <SelectItem value="6-12 months">6-12 months</SelectItem>
                  <SelectItem value="Planning for next year">Planning for next year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Marketing Focus Areas</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {marketingFocusOptions.map(focus => (
                  <div
                    key={focus}
                    onClick={() => handleMarketingToggle(focus)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      profile.marketingFocus.includes(focus)
                        ? 'bg-orange-50 border-orange-500 text-orange-700'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded border ${
                        profile.marketingFocus.includes(focus) ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                      }`}>
                        {profile.marketingFocus.includes(focus) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm">{focus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="teamSize">Exhibition Team Size</Label>
              <Input
                id="teamSize"
                type="number"
                min="1"
                max="20"
                value={profile.teamSize}
                onChange={(e) => setProfile(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 1 }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="requirements">Specific Requirements (Optional)</Label>
              <Textarea
                id="requirements"
                value={profile.specificRequirements}
                onChange={(e) => setProfile(prev => ({ ...prev, specificRequirements: e.target.value }))}
                placeholder="Any specific requirements, accessibility needs, or special considerations"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Personalized Exhibition Plan</h3>
              <p className="text-gray-600">Based on your profile, here are our AI-powered recommendations</p>
            </div>

            {isGenerating ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing your profile and generating personalized recommendations...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <Card key={index} className={`${
                    rec.priority === 'high' ? 'border-red-200 bg-red-50' :
                    rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                            {rec.priority}
                          </Badge>
                          <Badge variant="outline">{rec.category}</Badge>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">{rec.description}</p>
                      {rec.actionable && (
                        <div className="flex items-center text-blue-600 text-xs">
                          <Lightbulb className="w-3 h-3 mr-1" />
                          Actionable recommendation
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Star className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Next Steps</h4>
                    </div>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li>• Use our exhibition calculator to get detailed cost estimates</li>
                      <li>• Contact our experts at hello@easemyexpo.in for personalized consultation</li>
                      <li>• Download this plan as PDF for your team and stakeholders</li>
                      <li>• Book a free strategy session to refine your exhibition approach</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exhibition Planning Wizard</h1>
        <p className="text-gray-600">Get personalized recommendations for your exhibition strategy</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Step {currentStep} of {wizardSteps.length}</span>
          <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="flex justify-between items-center mb-8 overflow-x-auto">
        {wizardSteps.map((step, index) => (
          <div
            key={step.id}
            className={`flex flex-col items-center min-w-0 flex-1 ${
              index < wizardSteps.length - 1 ? 'border-r border-gray-200 pr-4 mr-4' : ''
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              step.id < currentStep ? 'bg-green-500 text-white' :
              step.id === currentStep ? 'bg-blue-500 text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {step.id < currentStep ? <CheckCircle className="w-5 h-5" /> : step.icon}
            </div>
            <h3 className={`text-xs font-medium text-center ${
              step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step.title}
            </h3>
            <p className="text-xs text-gray-400 text-center mt-1">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {wizardSteps[currentStep - 1].icon}
            <span>{wizardSteps[currentStep - 1].title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        {currentStep < wizardSteps.length ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              // Handle completion - navigate to calculator by closing wizard
              console.log('Wizard completed with profile:', profile);
              // Close the wizard modal
              const closeEvent = new CustomEvent('closeWizard');
              window.dispatchEvent(closeEvent);
            }}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            data-testid="button-complete-wizard"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Complete & Use Calculator</span>
          </Button>
        )}
      </div>
    </div>
  );
}