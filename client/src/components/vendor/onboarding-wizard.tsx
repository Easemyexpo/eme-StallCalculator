import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, ArrowLeft, Zap, Star, Trophy, Target, Users, Building } from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: OnboardingStep[] = [
  {
    title: "Welcome",
    description: "Let's get your vendor profile set up",
    icon: Star
  },
  {
    title: "Basic Info",
    description: "Tell us about your business",
    icon: Building
  },
  {
    title: "Services",
    description: "What services do you offer?",
    icon: Target
  },
  {
    title: "Expertise",
    description: "Your specialties and experience",
    icon: Trophy
  },
  {
    title: "Contact",
    description: "How clients can reach you",
    icon: Users
  }
];

interface VendorOnboardingWizardProps {
  onComplete: (vendorData: any) => void;
  onCancel: () => void;
}

export function VendorOnboardingWizard({ onComplete, onCancel }: VendorOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    city: "",
    state: "",
    description: "",
    specialties: "",
    services: "",
    experience: "",
    email: "",
    phone: "",
    website: "",
    priceRange: "Standard"
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      const vendorData = {
        name: formData.name,
        category: formData.category,
        city: formData.city,
        state: formData.state,
        location: `${formData.city}, ${formData.state}`, // Create location from city and state
        description: formData.description,
        specialties: formData.specialties.split(",").map(s => s.trim()).filter(s => s),
        services: formData.services.split(",").map(s => s.trim()).filter(s => s),
        experience: formData.experience,
        priceRange: formData.priceRange,
        keywords: [
          formData.name.toLowerCase(),
          formData.city.toLowerCase(),
          formData.category.toLowerCase(),
          ...formData.specialties.toLowerCase().split(",").map(s => s.trim())
        ].filter(k => k),
        contact: {
          email: formData.email,
          phone: formData.phone,
          website: formData.website
        },
        rating: null, // Default rating
        isActive: true
      };
      onComplete(vendorData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Welcome step
      case 1: return formData.name && formData.category && formData.city && formData.state;
      case 2: return formData.services;
      case 3: return formData.specialties && formData.experience;
      case 4: return formData.email || formData.phone;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Welcome to EaseMyExpo!</h3>
              <p className="text-gray-300 text-lg">
                Let's create your vendor profile and connect you with exhibition organizers across India.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-green-900/50 rounded-lg p-4">
                <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-green-300 font-semibold">Smart Matching</p>
                <p className="text-gray-400">Get matched with relevant clients</p>
              </div>
              <div className="bg-blue-900/50 rounded-lg p-4">
                <Trophy className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-blue-300 font-semibold">Performance Tracking</p>
                <p className="text-gray-400">Build your reputation</p>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>
            <div>
              <Label className="text-white">Business Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Your business name"
              />
            </div>
            <div>
              <Label className="text-white">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Exhibition Services">Exhibition Services</SelectItem>
                  <SelectItem value="Booth Construction">Booth Construction</SelectItem>
                  <SelectItem value="Logistics & Freight">Logistics & Freight</SelectItem>
                  <SelectItem value="Travel & Accommodation">Travel & Accommodation</SelectItem>
                  <SelectItem value="Audio Visual">Audio Visual</SelectItem>
                  <SelectItem value="Marketing & Branding">Marketing & Branding</SelectItem>
                  <SelectItem value="Full Service">Full Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">City *</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Your city"
                />
              </div>
              <div>
                <Label className="text-white">State *</Label>
                <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                    <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="West Bengal">West Bengal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-white">Business Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Briefly describe your business and what makes you unique"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Services Offered</h3>
            <div>
              <Label className="text-white">Services *</Label>
              <Textarea
                value={formData.services}
                onChange={(e) => setFormData({...formData, services: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="List your services (comma separated)
e.g., Booth Design, Installation, Project Management"
                rows={4}
              />
              <p className="text-sm text-gray-400 mt-1">
                These services will help match you with relevant client requests
              </p>
            </div>
            <div>
              <Label className="text-white">Price Range</Label>
              <Select value={formData.priceRange} onValueChange={(value) => setFormData({...formData, priceRange: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Budget">Budget (₹)</SelectItem>
                  <SelectItem value="Standard">Standard (₹₹)</SelectItem>
                  <SelectItem value="Premium">Premium (₹₹₹)</SelectItem>
                  <SelectItem value="Luxury">Luxury (₹₹₹₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Expertise & Experience</h3>
            <div>
              <Label className="text-white">Specialties *</Label>
              <Textarea
                value={formData.specialties}
                onChange={(e) => setFormData({...formData, specialties: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Your key specialties (comma separated)
e.g., Custom Booth Design, AV Equipment, Luxury Events"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-white">Experience *</Label>
              <Input
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., 10+ years, 5-8 years"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
            <div>
              <Label className="text-white">Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <Label className="text-white">Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="+91-XXXXXXXXXX"
              />
            </div>
            <div>
              <Label className="text-white">Website</Label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div className="bg-green-900/50 rounded-lg p-4 mt-6">
              <h4 className="text-green-300 font-semibold mb-2">🎉 Almost Done!</h4>
              <p className="text-gray-300 text-sm">
                Once you complete setup, your profile will be active and you'll start receiving relevant client matches.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gray-800 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Vendor Onboarding</CardTitle>
              <CardDescription className="text-gray-400">
                Step {currentStep + 1} of {steps.length}
              </CardDescription>
            </div>
            <Badge className="bg-green-600 text-white">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2 bg-gray-700" />
          </div>
          
          {/* Step Indicators */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <div
                  key={index}
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isCompleted ? 'bg-green-600 text-white' :
                    isCurrent ? 'bg-blue-600 text-white' :
                    'bg-gray-600 text-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>
              );
            })}
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-96">
          {renderStepContent()}
        </CardContent>
        
        <div className="p-6 pt-4 border-t border-gray-700 flex justify-between">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              Cancel
            </Button>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-green-600 hover:bg-green-700"
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}