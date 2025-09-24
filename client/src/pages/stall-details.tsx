import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Building2, Palette, Lightbulb, Wifi, Shield, Package, Monitor, Users, Calendar, MapPin, Phone, Mail, User, CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface StallDetailsForm {
  // Contact Information
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  
  // Stall Specifications
  preferredLocation: string;
  specialRequirements: string;
  accessibility: boolean;
  powerRequirement: string;
  
  // Design Preferences
  designTheme: string;
  colorScheme: string;
  brandingElements: string[];
  logoFile: string;
  
  // Equipment & Services
  audioVisual: string[];
  furniture: string[];
  technology: string[];
  
  // Marketing Materials
  brochures: boolean;
  giveaways: boolean;
  digitalDisplays: boolean;
  productSamples: boolean;
  
  // Timeline
  setupDate: string;
  eventDate: string;
  dismantleDate: string;
  
  // Budget & Approvals
  budgetRange: string;
  approvalStatus: string;
  specialInstructions: string;
}

export default function StallDetails() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<StallDetailsForm>({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    preferredLocation: "",
    specialRequirements: "",
    accessibility: false,
    powerRequirement: "",
    designTheme: "",
    colorScheme: "",
    brandingElements: [],
    logoFile: "",
    audioVisual: [],
    furniture: [],
    technology: [],
    brochures: false,
    giveaways: false,
    digitalDisplays: false,
    productSamples: false,
    setupDate: "",
    eventDate: "",
    dismantleDate: "",
    budgetRange: "",
    approvalStatus: "",
    specialInstructions: ""
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    { id: 1, title: "Contact Details", icon: User },
    { id: 2, title: "Stall Specifications", icon: Building2 },
    { id: 3, title: "Design & Branding", icon: Palette },
    { id: 4, title: "Equipment & Services", icon: Monitor },
    { id: 5, title: "Timeline & Budget", icon: Calendar }
  ];

  const updateFormData = (field: keyof StallDetailsForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: keyof StallDetailsForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...(prev[field] as string[]), value]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.companyName && formData.contactPerson && formData.email && formData.phone);
      case 2:
        return !!(formData.preferredLocation && formData.powerRequirement);
      case 3:
        return !!(formData.designTheme && formData.colorScheme);
      case 4:
        return formData.furniture.length > 0;
      case 5:
        return !!(formData.setupDate && formData.eventDate && formData.budgetRange);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast({
        title: "Please fill required fields",
        description: "Complete all required fields before proceeding",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (validateStep(5)) {
      try {
        // Send email to easemyexpo1@gmail.com with form data
        const emailContent = `
New Stall Details Submission

CONTACT INFORMATION:
Company: ${formData.companyName}
Contact Person: ${formData.contactPerson}
Email: ${formData.email}
Phone: ${formData.phone}
Website: ${formData.website}

STALL SPECIFICATIONS:
Preferred Location: ${formData.preferredLocation}
Power Requirement: ${formData.powerRequirement}
Accessibility Required: ${formData.accessibility ? 'Yes' : 'No'}
Special Requirements: ${formData.specialRequirements}

DESIGN PREFERENCES:
Theme: ${formData.designTheme}
Color Scheme: ${formData.colorScheme}
Branding Elements: ${formData.brandingElements.join(', ')}

EQUIPMENT & SERVICES:
Audio Visual: ${formData.audioVisual.join(', ')}
Furniture: ${formData.furniture.join(', ')}
Technology: ${formData.technology.join(', ')}

MARKETING MATERIALS:
Brochures: ${formData.brochures ? 'Yes' : 'No'}
Giveaways: ${formData.giveaways ? 'Yes' : 'No'}
Digital Displays: ${formData.digitalDisplays ? 'Yes' : 'No'}
Product Samples: ${formData.productSamples ? 'Yes' : 'No'}

TIMELINE:
Setup Date: ${formData.setupDate}
Event Date: ${formData.eventDate}
Dismantle Date: ${formData.dismantleDate}

BUDGET & APPROVAL:
Budget Range: ${formData.budgetRange}
Approval Status: ${formData.approvalStatus}
Special Instructions: ${formData.specialInstructions}

Submitted: ${new Date().toLocaleString()}
        `;

        // In a real implementation, you would send this to your backend
        console.log("Email content:", emailContent);
        
        toast({
          title: "Stall details submitted successfully!",
          description: "Our team will contact you within 24 hours to discuss your requirements.",
        });

        // Redirect back to calculator or confirmation page
        setTimeout(() => {
          setLocation("/");
        }, 2000);

      } catch (error) {
        toast({
          title: "Submission failed",
          description: "Please try again or contact us directly at easemyexpo1@gmail.com",
          variant: "destructive"
        });
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  placeholder="Enter your company name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => updateFormData('contactPerson', e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="your.email@company.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => updateFormData('website', e.target.value)}
                placeholder="https://www.yourcompany.com"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="preferredLocation">Preferred Stall Location *</Label>
              <Select value={formData.preferredLocation} onValueChange={(value) => updateFormData('preferredLocation', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrance">Near Main Entrance</SelectItem>
                  <SelectItem value="corner">Corner Location</SelectItem>
                  <SelectItem value="central">Central Hall</SelectItem>
                  <SelectItem value="food-court">Near Food Court</SelectItem>
                  <SelectItem value="auditorium">Near Auditorium</SelectItem>
                  <SelectItem value="any">Any Available</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="powerRequirement">Power Requirement *</Label>
              <Select value={formData.powerRequirement} onValueChange={(value) => updateFormData('powerRequirement', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select power requirement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5kw">5 KW - Basic lighting and small equipment</SelectItem>
                  <SelectItem value="10kw">10 KW - Standard equipment and displays</SelectItem>
                  <SelectItem value="15kw">15 KW - Heavy equipment and multiple displays</SelectItem>
                  <SelectItem value="20kw">20 KW+ - Industrial equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="accessibility"
                checked={formData.accessibility}
                onCheckedChange={(checked) => updateFormData('accessibility', checked)}
              />
              <Label htmlFor="accessibility">Accessibility features required (wheelchair access, etc.)</Label>
            </div>

            <div>
              <Label htmlFor="specialRequirements">Special Requirements</Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) => updateFormData('specialRequirements', e.target.value)}
                placeholder="Any special requirements for your stall (water connection, drainage, height restrictions, etc.)"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="designTheme">Design Theme *</Label>
              <Select value={formData.designTheme} onValueChange={(value) => updateFormData('designTheme', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select design theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern & Minimalist</SelectItem>
                  <SelectItem value="corporate">Corporate & Professional</SelectItem>
                  <SelectItem value="tech">Technology & Innovation</SelectItem>
                  <SelectItem value="eco">Eco-Friendly & Sustainable</SelectItem>
                  <SelectItem value="luxury">Luxury & Premium</SelectItem>
                  <SelectItem value="industrial">Industrial & Robust</SelectItem>
                  <SelectItem value="creative">Creative & Artistic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="colorScheme">Primary Color Scheme *</Label>
              <Select value={formData.colorScheme} onValueChange={(value) => updateFormData('colorScheme', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue-white">Blue & White</SelectItem>
                  <SelectItem value="red-white">Red & White</SelectItem>
                  <SelectItem value="green-white">Green & White</SelectItem>
                  <SelectItem value="black-white">Black & White</SelectItem>
                  <SelectItem value="orange-white">Orange & White</SelectItem>
                  <SelectItem value="purple-white">Purple & White</SelectItem>
                  <SelectItem value="custom">Custom Colors (specify in requirements)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Branding Elements</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Company Logo', 'Product Images', 'Tagline/Slogan', 'QR Codes', 'Social Media', 'Awards/Certifications'].map((element) => (
                  <div key={element} className="flex items-center space-x-2">
                    <Checkbox
                      id={element}
                      checked={formData.brandingElements.includes(element)}
                      onCheckedChange={() => toggleArrayField('brandingElements', element)}
                    />
                    <Label htmlFor={element} className="text-sm">{element}</Label>
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
              <Label>Audio Visual Equipment</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['LED TV/Screens', 'Projector', 'Sound System', 'Microphones', 'LED Strips', 'Spotlights'].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`av-${item}`}
                      checked={formData.audioVisual.includes(item)}
                      onCheckedChange={() => toggleArrayField('audioVisual', item)}
                    />
                    <Label htmlFor={`av-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Furniture Requirements *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Reception Counter', 'Meeting Table', 'Chairs', 'Display Shelves', 'Storage Cabinets', 'Brochure Stands'].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`furniture-${item}`}
                      checked={formData.furniture.includes(item)}
                      onCheckedChange={() => toggleArrayField('furniture', item)}
                    />
                    <Label htmlFor={`furniture-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Technology & Internet</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['WiFi Connection', 'Ethernet Port', 'Power Outlets', 'USB Charging', 'Video Conferencing', 'Interactive Kiosks'].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tech-${item}`}
                      checked={formData.technology.includes(item)}
                      onCheckedChange={() => toggleArrayField('technology', item)}
                    />
                    <Label htmlFor={`tech-${item}`} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="setupDate">Setup Date *</Label>
                <Input
                  id="setupDate"
                  type="date"
                  value={formData.setupDate}
                  onChange={(e) => updateFormData('setupDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="eventDate">Event Start Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => updateFormData('eventDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dismantleDate">Dismantle Date</Label>
                <Input
                  id="dismantleDate"
                  type="date"
                  value={formData.dismantleDate}
                  onChange={(e) => updateFormData('dismantleDate', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budgetRange">Budget Range *</Label>
                <Select value={formData.budgetRange} onValueChange={(value) => updateFormData('budgetRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-2l">Under ₹2 Lakhs</SelectItem>
                    <SelectItem value="2l-5l">₹2-5 Lakhs</SelectItem>
                    <SelectItem value="5l-10l">₹5-10 Lakhs</SelectItem>
                    <SelectItem value="10l-20l">₹10-20 Lakhs</SelectItem>
                    <SelectItem value="above-20l">Above ₹20 Lakhs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="approvalStatus">Approval Status</Label>
                <Select value={formData.approvalStatus} onValueChange={(value) => updateFormData('approvalStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select approval status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Budget Approved</SelectItem>
                    <SelectItem value="pending">Approval Pending</SelectItem>
                    <SelectItem value="discussion">Under Discussion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Marketing Materials</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="brochures"
                    checked={formData.brochures}
                    onCheckedChange={(checked) => updateFormData('brochures', checked)}
                  />
                  <Label htmlFor="brochures" className="text-sm">Brochures & Flyers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="giveaways"
                    checked={formData.giveaways}
                    onCheckedChange={(checked) => updateFormData('giveaways', checked)}
                  />
                  <Label htmlFor="giveaways" className="text-sm">Giveaways & Samples</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="digitalDisplays"
                    checked={formData.digitalDisplays}
                    onCheckedChange={(checked) => updateFormData('digitalDisplays', checked)}
                  />
                  <Label htmlFor="digitalDisplays" className="text-sm">Digital Displays</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="productSamples"
                    checked={formData.productSamples}
                    onCheckedChange={(checked) => updateFormData('productSamples', checked)}
                  />
                  <Label htmlFor="productSamples" className="text-sm">Product Samples</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                value={formData.specialInstructions}
                onChange={(e) => updateFormData('specialInstructions', e.target.value)}
                placeholder="Any additional requirements or special instructions for your stall"
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Calculator
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detailed Stall Requirements</h1>
              <p className="text-sm text-gray-600">Please provide detailed information for your exhibition stall</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted ? 'bg-green-500 border-green-500 text-white' :
                    isCurrent ? 'bg-primary border-primary text-white' :
                    'bg-gray-200 border-gray-300 text-gray-500'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${isCurrent ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`mx-4 h-1 w-16 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
              <span>{steps[currentStep - 1].title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 5 ? (
                <Button onClick={handleNext} disabled={!validateStep(currentStep)}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!validateStep(5)} className="bg-green-600 hover:bg-green-700">
                  Submit Requirements
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact our experts at{" "}
            <a href="mailto:easemyexpo1@gmail.com" className="text-primary hover:underline">
              easemyexpo1@gmail.com
            </a>
            {" "}or call{" "}
            <a href="tel:+919876543210" className="text-primary hover:underline">
              +91 98765 43210
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}