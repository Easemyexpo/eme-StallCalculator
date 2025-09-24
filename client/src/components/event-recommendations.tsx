import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, MapPin, Calendar, Users, TrendingUp, Award, ExternalLink, Sparkles } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EventRecommendationRequest, EventRecommendation, AIRecommendationResponse } from '@shared/schema';

interface EventRecommendationsProps {
  className?: string;
}

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Manufacturing', 'Automotive', 'Food & Beverages',
  'Textiles', 'Engineering', 'Oil & Gas', 'Pharmaceuticals', 'Electronics',
  'Agriculture', 'Construction', 'Packaging', 'Security', 'Energy',
  'Aerospace', 'Defense', 'Chemicals', 'Mining', 'Logistics',
  'Tourism', 'Education', 'Finance', 'Real Estate', 'Retail'
];

const COMPANY_SIZES = [
  { value: 'startup', label: 'Startup (1-10 employees)' },
  { value: 'sme', label: 'Small/Medium (11-250 employees)' },
  { value: 'enterprise', label: 'Enterprise (250+ employees)' }
];

const EXPERIENCE_LEVELS = [
  { value: 'first-time', label: 'First-time Exhibitor' },
  { value: 'occasional', label: 'Occasional Exhibitor' },
  { value: 'experienced', label: 'Experienced Exhibitor' }
];

const GOALS = [
  'Lead Generation', 'Brand Awareness', 'Product Launch', 'Market Research',
  'Networking', 'Partnership Development', 'Customer Acquisition', 'Industry Recognition'
];

export function EventRecommendations({ className }: EventRecommendationsProps) {
  const [formData, setFormData] = useState<EventRecommendationRequest>({
    industry: '',
    location: '',
    budget: undefined,
    teamSize: undefined,
    goals: [],
    eventTypes: ['trade'],
    companySize: undefined,
    experience: undefined,
    timeline: ''
  });

  const [showRecommendations, setShowRecommendations] = useState(false);
  const queryClient = useQueryClient();

  const recommendationMutation = useMutation({
    mutationFn: async (request: EventRecommendationRequest): Promise<AIRecommendationResponse> => {
      const response = await fetch('/api/recommendations/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to get recommendations');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setShowRecommendations(true);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.industry) return;
    
    recommendationMutation.mutate(formData);
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals?.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...(prev.goals || []), goal]
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoiColor = (roi: string) => {
    switch (roi) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-8 w-8 text-primary-green" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-green to-secondary-green bg-clip-text text-transparent">
            AI-Powered Event Recommendations
          </h2>
        </div>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Let our AI analyze your business needs and recommend the perfect exhibitions and trade shows for maximum ROI
        </p>
      </div>

      {/* Recommendation Form */}
      {!showRecommendations && (
        <Card className="bg-surface-green border-primary-green/20">
          <CardHeader>
            <CardTitle className="text-primary-green">Tell Us About Your Business</CardTitle>
            <CardDescription>
              Provide some details about your company and goals to get personalized event recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Industry Selection */}
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-text-dark font-medium">
                  Industry <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger data-testid="select-industry">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map(industry => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Preference */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-text-dark font-medium">Preferred Location</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Mumbai, Delhi, Bangalore, or Any"
                  data-testid="input-location"
                />
              </div>

              {/* Budget and Team Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-text-dark font-medium">Budget Range (₹)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value ? parseInt(e.target.value) : undefined }))}
                    placeholder="e.g., 500000"
                    data-testid="input-budget"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSize" className="text-text-dark font-medium">Team Size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    value={formData.teamSize || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value ? parseInt(e.target.value) : undefined }))}
                    placeholder="e.g., 5"
                    data-testid="input-team-size"
                  />
                </div>
              </div>

              {/* Company Size and Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-text-dark font-medium">Company Size</Label>
                  <Select value={formData.companySize || ''} onValueChange={(value: any) => setFormData(prev => ({ ...prev, companySize: value }))}>
                    <SelectTrigger data-testid="select-company-size">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_SIZES.map(size => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-text-dark font-medium">Exhibition Experience</Label>
                  <Select value={formData.experience || ''} onValueChange={(value: any) => setFormData(prev => ({ ...prev, experience: value }))}>
                    <SelectTrigger data-testid="select-experience">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-2">
                <Label className="text-text-dark font-medium">Exhibition Goals</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {GOALS.map(goal => (
                    <div key={goal} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={goal}
                        checked={formData.goals?.includes(goal) || false}
                        onChange={() => handleGoalToggle(goal)}
                        className="rounded border-primary-green text-primary-green"
                        data-testid={`checkbox-goal-${goal.toLowerCase().replace(/ /g, '-')}`}
                      />
                      <Label htmlFor={goal} className="text-sm cursor-pointer">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <Label htmlFor="timeline" className="text-text-dark font-medium">Timeline</Label>
                <Input
                  id="timeline"
                  value={formData.timeline || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                  placeholder="e.g., Next 6 months, Q1 2025, After product launch"
                  data-testid="input-timeline"
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={!formData.industry || recommendationMutation.isPending}
                className="w-full bg-gradient-to-r from-primary-green to-secondary-green hover:from-dark-green hover:to-primary-green"
                data-testid="button-get-recommendations"
              >
                {recommendationMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting AI Recommendations...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get AI Recommendations
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Recommendations Results */}
      {showRecommendations && recommendationMutation.data && (
        <div className="space-y-6">
          {/* Summary */}
          <Card className="bg-gradient-to-r from-primary-green/10 to-secondary-green/10 border-primary-green/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-primary-green">AI Analysis Complete</CardTitle>
                  <CardDescription>
                    Found {recommendationMutation.data.totalCount} perfect matches for your business
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-green">
                    {recommendationMutation.data.confidence}%
                  </div>
                  <div className="text-sm text-text-secondary">Confidence</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={recommendationMutation.data.confidence} className="h-2" />
                <p className="text-text-secondary">
                  {recommendationMutation.data.reasoning}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendationMutation.data.recommendations.map((event: EventRecommendation, index: number) => (
              <Card key={event.id} className="bg-surface-green border-primary-green/20 hover:border-primary-green/40 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-primary-green">{event.name}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-text-secondary">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-text-secondary">
                        <Calendar className="h-4 w-4" />
                        <span>{event.dates}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-green">
                        {event.relevanceScore}%
                      </div>
                      <div className="text-xs text-text-secondary">Match</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-text-secondary">
                    {event.description}
                  </p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-background-green rounded-lg">
                      <Users className="h-4 w-4 mx-auto mb-1 text-primary-green" />
                      <div className="text-sm font-medium">{event.expectedVisitors.toLocaleString()}</div>
                      <div className="text-xs text-text-secondary">Expected Visitors</div>
                    </div>
                    <div className="text-center p-2 bg-background-green rounded-lg">
                      <TrendingUp className="h-4 w-4 mx-auto mb-1 text-primary-green" />
                      <div className="text-sm font-medium">₹{event.averageBoothCost.toLocaleString()}</div>
                      <div className="text-xs text-text-secondary">Est. Booth Cost</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getDifficultyColor(event.difficulty)}>
                      {event.difficulty}
                    </Badge>
                    <Badge className={getRoiColor(event.roiPotential)}>
                      {event.roiPotential} ROI
                    </Badge>
                    <Badge variant="outline">
                      {event.competitorPresence} Competition
                    </Badge>
                  </div>

                  {/* Why Recommended */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-text-dark">Why This Event:</h4>
                    <ul className="text-sm text-text-secondary space-y-1">
                      {event.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <Award className="h-3 w-3 mt-0.5 text-primary-green flex-shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-text-dark">Key Benefits:</h4>
                    <ul className="text-sm text-text-secondary space-y-1">
                      {event.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <TrendingUp className="h-3 w-3 mt-0.5 text-secondary-green flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        // Calculate costs for this event
                        setFormData(prev => ({
                          ...prev,
                          destinationCity: event.location.split(',')[0],
                          boothSize: 18, // Default booth size
                          eventType: 'trade'
                        }));
                        setShowRecommendations(false);
                      }}
                      data-testid={`button-calculate-costs-${index}`}
                    >
                      Calculate Costs
                    </Button>
                    {event.website && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(event.website, '_blank')}
                        data-testid={`button-visit-website-${index}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* New Recommendation Button */}
          <div className="text-center">
            <Button 
              variant="outline"
              onClick={() => setShowRecommendations(false)}
              className="border-primary-green text-primary-green hover:bg-primary-green hover:text-white"
              data-testid="button-new-recommendations"
            >
              Get New Recommendations
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {recommendationMutation.isError && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-red-800 font-medium">
                Failed to get recommendations
              </p>
              <p className="text-red-600 text-sm">
                {recommendationMutation.error?.message || 'Please try again later'}
              </p>
              <Button 
                variant="outline" 
                onClick={() => recommendationMutation.reset()}
                className="border-red-300 text-red-800 hover:bg-red-100"
                data-testid="button-retry-recommendations"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}