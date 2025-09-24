import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { GlobalSettings } from "@/components/calculator/global-settings";
import { EventDetails } from "@/components/calculator/event-details";

import { TeamTravel } from "@/components/calculator/team-travel";
import { CostSummary } from "@/components/calculator/cost-summary";
import { VendorRecommendations } from "@/components/calculator/vendor-recommendations";
import { PersonalizedVendorEngine } from "@/components/recommendations/personalized-vendor-engine";
import { FlightSelection } from "@/components/calculator/flight-selection";
import { ReturnFlightSelection } from "@/components/calculator/return-flight-selection";
import { HotelSelection } from "@/components/calculator/hotel-selection";
import { StallDesign } from "@/components/calculator/stall-design";
import { ExhibitionRecommendations } from "@/components/exhibitions/exhibition-recommendations";
import { QuoteGenerator } from "@/components/calculator/quote-generator";
import { EnhancedFinalStep } from "@/components/calculator/enhanced-final-step";
import { ExhibitionStoryboard } from "@/components/storyboard/exhibition-storyboard";
import { PlanningWizard } from "@/components/wizard/planning-wizard";
import { ExhibitionTips } from "@/components/tips/exhibition-tips";
import { SuccessPredictor } from "@/components/ai/success-predictor-compact";
import { RiskAssessment } from "@/components/risk/risk-assessment-compact";
import { Logo } from "@/components/ui/logo";
import { RotatingTips } from "@/components/ui/rotating-tips";


import { EaseMyExpoLogo } from "@/components/easemyexpo-logo";
// All gamification imports removed
// All smart assistant imports removed

import { calculateCosts } from "@/lib/calculator";
import { calculateStallCosts } from "@/lib/stall-calculator";
import { calculateSimplifiedCost, getStallFabricationRate, calculateStallFabricationRate, formatCurrency } from "@/lib/simplified-calculator";
import { CostBreakdown, CURRENCY_SYMBOLS } from "@shared/schema";
import { Calculator, Plane, Hotel, FileText, ChevronRight, ChevronLeft, CheckCircle, Wand2, ArrowLeft, Shield, Building2, Star, Camera, TrendingUp, DollarSign } from "lucide-react";

interface CalculatorFormData {
  currency: string;
  marketLevel: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  eventStartDate: string;
  eventEndDate: string;
  exhibitionStartDate: string;
  exhibitionEndDate: string;
  arrivalDate: string;
  departureDate: string;
  eventType: string;
  eventDuration: number;
  distance: number;
  venueType: string;
  boothSize: number;
  customSize?: number;
  boothType: string;
  teamSize: number;
  accommodationLevel: string;
  furniture: boolean;
  avEquipment: boolean;
  lighting: boolean;
  internet: boolean;
  storage: boolean;
  security: boolean;
  exhibitionName?: string;
  industry?: string;
}

export default function ExpoCalculator() {
  const [, setLocation] = useLocation();
  const [showWizard, setShowWizard] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showStoryboard, setShowStoryboard] = useState(false);


  // All gamification state completely removed


  const [formData, setFormData] = useState<CalculatorFormData>({
    currency: "INR",
    marketLevel: "medium", 
    originCity: "",
    originState: "",
    destinationCity: "",
    destinationState: "",
    eventStartDate: "",
    eventEndDate: "",
    exhibitionStartDate: "",
    exhibitionEndDate: "",
    arrivalDate: "",
    departureDate: "",
    eventType: "trade",
    eventDuration: 0,
    distance: 0,
    venueType: "convention_center",
    boothSize: 0,
    boothType: "custom",
    teamSize: 0,
    accommodationLevel: "business",
    furniture: false,
    avEquipment: false,
    lighting: false,
    internet: false,
    storage: false,
    security: false,
  });

  const [costs, setCosts] = useState<CostBreakdown | null>(null);
  const [selectedFlights, setSelectedFlights] = useState<any>({});
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedStallVendors, setSelectedStallVendors] = useState<string[]>([]);
  const [stallDesignData, setStallDesignData] = useState({
    area: 0,
    areaUnit: 'sqm' as 'sqm' | 'sqft',
    boothType: 'shell_scheme' as 'shell_scheme' | 'raw_space',
    boothPosition: 'inline' as 'inline' | 'corner' | 'island',
    wallType: 'octonorm' as 'octonorm' | 'mdf' | 'laminated_plywood' | 'modular_aluminum',
    flooring: 'carpeting' as 'carpeting' | 'raised_wooden' | 'vinyl_finish' | 'laminate' | 'marble' | 'ceramic',
    ceiling: 'open' as 'open' | 'truss_lights' | 'branding_fascia',
    additionalRooms: [] as string[],
    printArea: 0,
    brandingElements: [] as string[],
    digitalDisplays: [] as string[],
    furnitureType: 'rental' as 'rental' | 'custom_build',
    furnitureItems: [] as string[],
    lightingType: [] as string[],
    powerRequirement: 0,
    powerType: '1_phase' as '1_phase' | '3_phase',
    installationDays: 3,
    dismantlingDays: 1,
    isOutstation: false,
    extras: [] as string[]
  });

  // Format currency helper
  const formatCurrency = (amount: number, currency: string = "INR") => {
    const symbol = CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] || '$';
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  };

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showReturnFlights, setShowReturnFlights] = useState(false);
  
  const FIRST_STEP = 1 as number;
  const LAST_STEP = 7 as number;

  // Missing state variables
  const [previousCost, setPreviousCost] = useState<number | null>(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(false);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<any>(null);
  const [progressScore, setProgressScore] = useState(0);
  const [showRiskAssessment, setShowRiskAssessment] = useState(false);
  const [showSuccessPredictor, setShowSuccessPredictor] = useState(false);
  const [showBudgetWizard, setShowBudgetWizard] = useState(false);

  // All gamification states removed



  // All gamification completely removed

  // Listen for wizard completion event
  useEffect(() => {
    const handleCloseWizard = () => {
      setShowWizard(false);
    };

    window.addEventListener('closeWizard', handleCloseWizard);
    return () => window.removeEventListener('closeWizard', handleCloseWizard);
  }, []);

  const handleGenerateQuote = async () => {
    try {
      const quoteData = {
        formData,
        selectedFlights,
        selectedHotel,
        selectedVendors,
        costs,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `EaseMyExpo_Quote_${formData.destinationCity}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to generate quote PDF');
        alert('Failed to generate quote. Please try again.');
      }
    } catch (error) {
      console.error('Error generating quote:', error);
      alert('Error generating quote. Please try again.');
    }
  };

  // Calculate costs when meaningful data is provided OR stall design changes
  useEffect(() => {
    // Check for booth size from either boothSize or customSize or stallDesignData.area
    const actualBoothSize = Number(formData.customSize) || Number(formData.boothSize) || stallDesignData.area || 0;

    // Only calculate costs if user has entered basic required information
    const hasMinimumData = (
      formData.destinationCity && 
      formData.originCity && 
      actualBoothSize > 0 && 
      formData.teamSize > 0
    );

    if (hasMinimumData) {
      try {
        // Enhanced form data with stall design elements for better pricing
        const enhancedFormData = {
          ...formData,
          boothSize: actualBoothSize,
          // Add extra costs for premium stall elements
          premiumStallAddons: {
            wallType: stallDesignData.wallType,
            flooring: stallDesignData.flooring,
            brandingElements: (stallDesignData.brandingElements || []).length * 5000, // ₹5k per element
            digitalDisplays: (stallDesignData.digitalDisplays || []).length * 15000, // ₹15k per display
            furnitureItems: (stallDesignData.furnitureItems || []).length * 3000, // ₹3k per item
            lightingType: (stallDesignData.lightingType || []).length * 8000, // ₹8k per lighting type
            powerRequirement: (stallDesignData.powerRequirement || 0) * 1000, // ₹1k per kW
            installationDays: ((stallDesignData.installationDays || 2) - 2) * 10000, // Extra days cost ₹10k each
            extras: (stallDesignData.extras || []).length * 7000 // ₹7k per extra
          }
        };

        // Use simplified calculation system with dynamic pricing based on selections
        const dynamicFabricationRate = calculateStallFabricationRate(stallDesignData);

        const simplifiedParams = {
          area_sqm: actualBoothSize,
          stall_fabrication_rate_per_sqm: dynamicFabricationRate,
          flight_cost: (selectedFlights.outbound?.price || 0) + (selectedFlights.return?.price || 0),
          hotel_cost: selectedHotel ? (selectedHotel.totalPrice || selectedHotel.pricePerNight * formData.eventDuration) : 0,
          marketing_cost: 25000, // Default marketing cost
          logistics_cost: 15000   // Default logistics cost
        };

        const simplifiedCosts = calculateSimplifiedCost(simplifiedParams);

        // Also calculate enhanced costs for comparison
        const baseCosts = calculateCosts(enhancedFormData);
        const stallCosts = calculateStallCosts(stallDesignData);

        // Generate fabrication details for display
        const fabricationDetails = [];
        if (stallDesignData.wallType && stallDesignData.wallType !== 'octonorm') {
          fabricationDetails.push(`${stallDesignData.wallType} walls`);
        }
        if (stallDesignData.flooring && stallDesignData.flooring !== 'carpeting') {
          fabricationDetails.push(`${stallDesignData.flooring} flooring`);
        }
        if ((stallDesignData.lightingType || []).length > 0) {
          fabricationDetails.push(`${(stallDesignData.lightingType || []).join(', ')} lighting`);
        }
        if ((stallDesignData.digitalDisplays || []).length > 0) {
          fabricationDetails.push(`${(stallDesignData.digitalDisplays || []).length} displays`);
        }

        // Use simplified calculation as primary, enhanced as fallback
        const updatedCosts = {
          ...baseCosts,
          constructionCost: simplifiedCosts.stall_fabrication_cost,
          spaceCost: simplifiedCosts.space_cost,
          travelCost: simplifiedCosts.travel_hotel_cost,
          marketingCost: simplifiedCosts.marketing_cost,
          logisticsCost: simplifiedCosts.logistics_cost,
          total: simplifiedCosts.total_cost,
          stallBreakdown: stallCosts,
          simplifiedBreakdown: simplifiedCosts.breakdown,
          fabricationDetails: fabricationDetails.length > 0 ? fabricationDetails.join(', ') : 'Base package',
          fabricationRateUsed: dynamicFabricationRate
        };

        // Track previous cost for gamification
        if (costs?.total && costs.total !== updatedCosts.total) {
          setPreviousCost(costs.total);
        }

        setCosts(updatedCosts);
      } catch (error) {
        console.error('Error calculating costs:', error);
        setCosts(null);
      }
    } else {
      setCosts(null); // Reset costs to null when insufficient data
    }

    // Achievement check removed
  }, [formData, stallDesignData, currentStep, costs?.total]); // Added stallDesignData dependency

  // Check if user is first-time visitor
  useEffect(() => {
    const hasVisited = localStorage.getItem('easemyexpo_visited');
    if (!hasVisited) {
      setIsFirstTimeUser(true);
      setShowWelcomeAlert(true);
      localStorage.setItem('easemyexpo_visited', 'true');
    }
  }, []);

  const updateFormData = (updates: Partial<CalculatorFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Gamification functions
  const checkAchievements = (formData: CalculatorFormData, step: number) => {
    const newAchievements: string[] = [];

    // Step-based achievements
    if (step >= 2 && !achievements.includes('travel_planner')) {
      newAchievements.push('travel_planner');
    }
    if (step >= 3 && !achievements.includes('cost_calculator')) {
      newAchievements.push('cost_calculator');
    }
    if (step >= 4 && !achievements.includes('vendor_explorer')) {
      newAchievements.push('vendor_explorer');
    }
    if (step === 5 && !achievements.includes('quote_master')) {
      newAchievements.push('quote_master');
    }

    // Data quality achievements
    if (formData.exhibitionName && formData.industry && !achievements.includes('detail_oriented')) {
      newAchievements.push('detail_oriented');
    }
    if (formData.customSize && formData.customSize > 50 && !achievements.includes('big_exhibitor')) {
      newAchievements.push('big_exhibitor');
    }
    if (formData.accommodationLevel === 'luxury' && !achievements.includes('premium_planner')) {
      newAchievements.push('premium_planner');
    }
    if (formData.teamSize >= 8 && !achievements.includes('team_leader')) {
      newAchievements.push('team_leader');
    }

    // Show new achievements
    newAchievements.forEach(achievement => {
      if (!achievements.includes(achievement)) {
        setAchievements(prev => [...prev, achievement]);
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), 4000);
      }
    });

    // Update progress score
    const score = (step - 1) * 20 + newAchievements.length * 5;
    setProgressScore(Math.min(100, score));
  };

  const getAchievementInfo = (achievement: string) => {
    const achievements = {
      travel_planner: { title: "Travel Planner", description: "Planned your exhibition travel", icon: "✈️" },
      cost_calculator: { title: "Cost Calculator", description: "Calculated exhibition costs", icon: "💰" },
      vendor_explorer: { title: "Vendor Explorer", description: "Explored exhibition vendors", icon: "🏢" },
      quote_master: { title: "Quote Master", description: "Generated professional quote", icon: "📄" },
      detail_oriented: { title: "Detail Oriented", description: "Filled all exhibition details", icon: "📋" },
      big_exhibitor: { title: "Big Exhibitor", description: "Planning 50+ sqm booth", icon: "🏭" },
      premium_planner: { title: "Premium Planner", description: "Chose luxury accommodation", icon: "⭐" },
      team_leader: { title: "Team Leader", description: "Leading 8+ team members", icon: "👥" }
    };
    return achievements[achievement as keyof typeof achievements];
  };

  const steps = [
    { step: 1, label: "Details", icon: Calculator, description: "Event & booth specifications" },
    { step: 2, label: "Stall Design", icon: Building2, description: "Configure booth design & fabrication" },
    { step: 3, label: "Services", icon: FileText, description: "Select additional services" },
    { step: 4, label: "Vendors", icon: FileText, description: "Select exhibition vendors" },
    { step: 5, label: "Flights", icon: Plane, description: "Select travel options" },
    { step: 6, label: "Hotels", icon: Hotel, description: "Choose accommodation" },
    { step: 7, label: "Quote", icon: FileText, description: "Generate final quote" }
  ];

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      // Scroll to top of page when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top of page when moving to previous step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setFormData({
      currency: "INR",
      marketLevel: "tier1",
      originCity: "",
      originState: "",
      destinationCity: "",
      destinationState: "",
      eventStartDate: "",
      eventEndDate: "",
      exhibitionStartDate: "",
      exhibitionEndDate: "",
      arrivalDate: "",
      departureDate: "",
      eventType: "",
      eventDuration: 3,
      distance: 0,
      venueType: "",
      boothSize: 0,
      customSize: 0,
      boothType: "",
      teamSize: 0,
      accommodationLevel: "",
      furniture: false,
      avEquipment: false,
      lighting: false,
      internet: false,
      storage: false,
      security: false,
      exhibitionName: "",
      industry: ""
    });
    setCosts(null);
    setSelectedFlights({});
    setSelectedHotel(null);
    setSelectedVendors([]);
    setStallDesignData({
      area: 0,
      areaUnit: 'sqm' as 'sqm' | 'sqft',
      boothType: 'shell_scheme' as 'shell_scheme' | 'raw_space',
      boothPosition: 'inline' as 'inline' | 'corner' | 'island',
      wallType: 'octonorm' as 'octonorm' | 'mdf' | 'laminated_plywood' | 'modular_aluminum',
      flooring: 'carpeting' as 'carpeting' | 'raised_wooden' | 'vinyl_finish' | 'laminate' | 'marble' | 'ceramic',
      ceiling: 'open' as 'open' | 'truss_lights' | 'branding_fascia',
      additionalRooms: [] as string[],
      printArea: 0,
      brandingElements: [] as string[],
      digitalDisplays: [] as string[],
      furnitureType: 'rental' as 'rental' | 'custom_build',
      furnitureItems: [] as string[],
      lightingType: [] as string[],
      powerRequirement: 0,
      powerType: '1_phase' as '1_phase' | '3_phase',
      installationDays: 3,
      dismantlingDays: 1,
      isOutstation: false,
      extras: [] as string[]
    });
  };

  const canProceedToStep = (step: number) => {
    switch (step) {
      case 2:
        // Step 2 is now Stall Design
        return formData.destinationCity && formData.originCity;
      case 3:
        // Step 3 is now Services 
        console.log('Step 3 validation:', { stallDesignData });
        return stallDesignData.area > 0 && stallDesignData.wallType;
      case 4:
        // Step 4 is now Vendors
        return true; // Services don't have validation requirements
      case 5:
        // Step 5 is now Flights
        console.log('Step 5 validation:', { selectedVendors });
        return selectedVendors.length > 0;
      case 6:
        // Step 6 is now Hotels
        console.log('Step 6 validation:', { selectedFlights, keys: Object.keys(selectedFlights) });
        return Object.keys(selectedFlights).length > 0;
      case 7:
        // Step 7 is Quote
        console.log('Step 7 validation:', { selectedHotel });
        return selectedHotel;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-2 md:px-0">
      {/* First-Timer Welcome Alert - Mobile Optimized */}
      {showWelcomeAlert && (
        <div className="fixed top-4 right-4 left-4 md:left-auto z-50 max-w-md bg-green-600 text-white p-3 md:p-4 rounded-lg shadow-xl border border-green-500 animate-slide-in-right interactive-card">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">🎉 Welcome to EaseMyExpo!</h3>
              <p className="text-sm mb-3">
                You're joining 199 of 250 new exhibitors who rebooked after using our cost forecast! 
                Save 30% on your first exhibition with smart planning.
              </p>
              <div className="bg-green-700 rounded-md p-2 mb-2 slide-up">
                <p className="text-xs font-semibold">✨ First-Timer Bonus Package:</p>
                <ul className="text-xs mt-1 space-y-1">
                  <li>• Free cost optimization consultation</li>
                  <li>• Priority vendor matching</li>
                  <li>• 24/7 exhibition support</li>
                </ul>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowWelcomeAlert(false)}
                  className="bg-white text-green-600 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100 button-hover"
                >
                  Start Planning →
                </button>

              </div>
            </div>
            <button 
              onClick={() => setShowWelcomeAlert(false)}
              className="text-green-200 hover:text-white ml-2 icon-spin"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Achievement Notification - Hidden on Mobile */}
      {showAchievement && (
        <div className="hidden md:block fixed top-20 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg shadow-xl border border-green-300 animate-bounce glow-effect">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center pulse-on-hover">
              <span className="text-lg">{getAchievementInfo('achievement_unlocked')?.icon}</span>
            </div>
            <div>
              <h3 className="font-bold text-sm">Achievement Unlocked!</h3>
              <p className="text-xs">{getAchievementInfo('achievement_unlocked')?.title}</p>
              <p className="text-xs opacity-90">{getAchievementInfo('achievement_unlocked')?.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Compact Header - Fixed positioning */}
      <div className="sticky top-0 z-40 bg-white/95 border-b border-green-200 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Logo size="sm" showText={true} />
            </div>
            <div className="hidden md:flex items-center space-x-3 text-sm text-gray-600">
              <Link href="/recommendations">
                <button className="bg-gradient-to-r from-primary-green to-secondary-green text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:from-dark-green hover:to-primary-green transition-all transform hover:scale-105 shadow-sm">
                  🎯 AI Events
                </button>
              </Link>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                Step {currentStep} of 7
              </span>
              <span className="text-emerald-600 font-medium text-xs">
                {progressScore}% Complete
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Clean Modern Layout */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className={`grid grid-cols-1 gap-8 ${currentStep === 7 ? 'lg:grid-cols-1' : 'lg:grid-cols-4'}`}>

            {/* Main Form Card */}
            <div className={currentStep === 7 ? 'lg:col-span-1' : 'lg:col-span-3'}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift transition-all duration-300">

                {/* Step Header with Modern Design */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {(() => {
                        const step = steps.find(s => s.step === currentStep);
                        const Icon = step?.icon || Calculator;
                        return <Icon className="w-8 h-8" />;
                      })()}
                      <div>
                        <h2 className="text-2xl font-bold">
                          {steps.find(s => s.step === currentStep)?.label || 'Step'}
                        </h2>
                        <p className="text-green-100 text-sm">
                          Step {currentStep} of 7 • Fill in the details below
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{progressScore}%</div>
                      <div className="text-xs text-emerald-100">Complete</div>
                    </div>
                  </div>
                </div>

                {/* Form Content Area */}
                <div className="p-8">

                  {/* Clean Step Progress Indicator */}
                  <div className="flex justify-center items-center mb-8">
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-6 py-3">
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                          <div
                            key={step}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ease-out cursor-pointer hover:scale-150 ${
                              step === currentStep
                                ? 'bg-emerald-500 scale-125 pulse-on-hover'
                                : step < currentStep
                                ? 'bg-emerald-300 hover:bg-emerald-400'
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                            onClick={() => {
                              if (step <= currentStep) {
                                setCurrentStep(step);
                                // Scroll to top when clicking step dots
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        Step {currentStep} of 7
                      </div>
                    </div>
                  </div>

                  {/* Step Content */}
                  {currentStep === 1 && (
                    <div className="space-y-8 animate-fade-in-up main-content-mobile pb-32 lg:pb-8">
                      <div className="bg-gray-50 rounded-xl p-6 interactive-card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 transition-colors hover:text-emerald-600">Contact Details</h3>
                        <p className="text-gray-600 mb-6">Estimate the cost of establishing your stall in events & expos, tailored to your unique business needs.</p>
                        <GlobalSettings formData={formData} updateFormData={updateFormData} />
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6 interactive-card">
                        <EventDetails formData={formData} updateFormData={updateFormData} />
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6 interactive-card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 transition-colors hover:text-emerald-600">Team & Travel</h3>
                        <TeamTravel formData={formData} updateFormData={updateFormData} />
                      </div>

                      {/* Step Navigation - Fixed for Mobile */}
                      <div className="flex justify-between items-center pt-8 pb-4 mobile-nav-buttons relative z-50 bg-white p-4 -mx-6 border-t border-gray-200 lg:bg-transparent lg:border-0 lg:p-0 lg:mx-0">
                        <button
                          onClick={goToPreviousStep}
                          disabled={currentStep === FIRST_STEP}
                          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all relative z-50 ${
                            currentStep === FIRST_STEP
                              ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                              : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                          <span>Previous</span>
                        </button>

                        <button
                          onClick={goToNextStep}
                          className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all bg-emerald-600 text-white hover:bg-emerald-700 relative z-50"
                        >
                          <span>Next Step</span>
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <StallDesign 
                          data={stallDesignData}
                          onUpdate={(updates) => setStallDesignData(prev => ({ ...prev, ...updates }))}
                        />
                      </div>

                      {/* Exhibition Recommendations based on industry selection */}
                      {formData.industry && (
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Industry Exhibitions & Insights
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Discover relevant exhibitions and industry-specific insights for {formData.industry}
                          </p>
                          <ExhibitionRecommendations 
                            selectedIndustry={formData.industry}
                            selectedCity={formData.destinationCity}
                          />
                        </div>
                      )}

                      {/* Step Navigation - Fixed for Mobile */}
                      <div className="flex justify-between items-center pt-8 mobile-nav-buttons relative z-50 bg-white p-4 -mx-6 border-t border-gray-200 lg:bg-transparent lg:border-0 lg:p-0 lg:mx-0">
                        <button
                          onClick={goToPreviousStep}
                          disabled={currentStep === FIRST_STEP}
                          className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all text-gray-700 bg-gray-100 hover:bg-gray-200 relative z-50"
                        >
                          <ChevronLeft className="w-5 h-5" />
                          <span>Previous</span>
                        </button>

                        <button
                          onClick={goToNextStep}
                          className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all bg-emerald-600 text-white hover:bg-emerald-700 relative z-50"
                        >
                          <span>Next Step</span>
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Services</h3>
                        <p className="text-gray-600 mb-6">Choose additional services like AV equipment, branding, marketing materials, etc.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg hover:border-primary transition-colors">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.avEquipment}
                          onChange={(e) => updateFormData({ avEquipment: e.target.checked })}
                          className="h-4 w-4 text-primary"
                        />
                        <div>
                          <h4 className="font-medium">AV Equipment</h4>
                          <p className="text-sm text-gray-500">Microphones, speakers, projectors</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg hover:border-primary transition-colors">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.lighting}
                          onChange={(e) => updateFormData({ lighting: e.target.checked })}
                          className="h-4 w-4 text-primary"
                        />
                        <div>
                          <h4 className="font-medium">Lighting</h4>
                          <p className="text-sm text-gray-500">LED panels, spotlights</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg hover:border-primary transition-colors">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.internet}
                          onChange={(e) => updateFormData({ internet: e.target.checked })}
                          className="h-4 w-4 text-primary"
                        />
                        <div>
                          <h4 className="font-medium">Internet & WiFi</h4>
                          <p className="text-sm text-gray-500">High-speed connectivity</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg hover:border-primary transition-colors">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.storage}
                          onChange={(e) => updateFormData({ storage: e.target.checked })}
                          className="h-4 w-4 text-primary"
                        />
                        <div>
                          <h4 className="font-medium">Storage</h4>
                          <p className="text-sm text-gray-500">Secure storage space</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg hover:border-primary transition-colors">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.security}
                          onChange={(e) => updateFormData({ security: e.target.checked })}
                          className="h-4 w-4 text-primary"
                        />
                        <div>
                          <h4 className="font-medium">Security</h4>
                          <p className="text-sm text-gray-500">24/7 booth security</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg hover:border-primary transition-colors">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.furniture}
                          onChange={(e) => updateFormData({ furniture: e.target.checked })}
                          className="h-4 w-4 text-primary"
                        />
                        <div>
                          <h4 className="font-medium">Premium Furniture</h4>
                          <p className="text-sm text-gray-500">Tables, chairs, displays</p>
                        </div>
                      </div>
                    </div>
                        </div>
                      </div>

                      {/* Step Navigation - Fixed for Mobile */}
                      <div className="flex justify-between items-center pt-8 mobile-nav-buttons relative z-50 bg-white p-4 -mx-6 border-t border-gray-200 lg:bg-transparent lg:border-0 lg:p-0 lg:mx-0">
                        <button
                          onClick={goToPreviousStep}
                          disabled={currentStep === FIRST_STEP}
                          className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all text-gray-700 bg-gray-100 hover:bg-gray-200 relative z-50"
                        >
                          <ChevronLeft className="w-5 h-5" />
                          <span>Previous</span>
                        </button>

                        <button
                          onClick={goToNextStep}
                          className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all bg-emerald-600 text-white hover:bg-emerald-700 relative z-50"
                        >
                          <span>Next Step</span>
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-8">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Vendor Recommendations</h3>
                        <p className="text-gray-600 mb-6">Get intelligent vendor recommendations based on your project requirements and preferences.</p>
                        <PersonalizedVendorEngine 
                          formData={formData} 
                          onVendorSelect={(vendor: any) => {
                            const vendorId = vendor.id || vendor.name;
                            console.log('Personalized vendor selected:', vendorId);
                            setSelectedVendors(prev => {
                              if (prev.includes(vendorId)) {
                                return prev.filter(id => id !== vendorId);
                              } else {
                                return [...prev, vendorId];
                              }
                            });
                          }}
                        />
                      </div>

                      {/* Legacy Vendor Search */}
                      <div className="bg-white rounded-xl p-6 border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traditional Vendor Search</h3>
                        <p className="text-gray-600 mb-6">Search for specific vendors in your destination city.</p>
                        <VendorRecommendations 
                          formData={formData} 
                          onVendorSelect={(vendor: any, selected: boolean) => {
                            const vendorId = vendor.id || vendor.name;
                            console.log('Vendor selection changed:', vendorId, selected);
                            setSelectedVendors(prev => 
                              selected 
                                ? [...prev, vendorId]
                                : prev.filter(id => id !== vendorId)
                            );
                          }}
                          selectedVendors={selectedVendors}
                        />
                      </div>

                      {/* Step Navigation - Fixed for Mobile */}
                      <div className="flex justify-between items-center pt-8 mobile-nav-buttons relative z-50 bg-white p-4 -mx-6 border-t border-gray-200 lg:bg-transparent lg:border-0 lg:p-0 lg:mx-0">
                        <button
                          onClick={goToPreviousStep}
                          className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all text-gray-700 bg-gray-100 hover:bg-gray-200 relative z-50"
                        >
                          <ChevronLeft className="w-5 h-5" />
                          <span>Previous</span>
                        </button>

                        {currentStep === LAST_STEP ? (
                          <button
                            onClick={() => {
                              // Scroll to summary section
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all bg-emerald-600 text-white hover:bg-emerald-700 relative z-50"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>Complete</span>
                          </button>
                        ) : (
                          <button
                            onClick={goToNextStep}
                            className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all bg-emerald-600 text-white hover:bg-emerald-700 relative z-50"
                          >
                            <span>Next Step</span>
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 5 && (
                    <div className="space-y-8">
                      {/* First-Timer Progress Milestone */}
                      {isFirstTimeUser && (
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-lg shadow-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold">Great Progress!</h4>
                              <p className="text-sm">Smart exhibitors like you save ₹1.2L on average by comparing flight options here.</p>
                            </div>
                            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                              Step 5/7
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Flights</h3>
                        <FlightSelection 
                          formData={formData} 
                          onFlightSelect={setSelectedFlights}
                          selectedFlights={selectedFlights}
                        />
                      </div>

                      {/* Step Navigation - Fixed for Mobile */}
                      <div className="flex justify-between items-center pt-8 mobile-nav-buttons relative z-50 bg-white p-4 -mx-6 border-t border-gray-200 lg:bg-transparent lg:border-0 lg:p-0 lg:mx-0">
                        <button
                          onClick={goToPreviousStep}
                          className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all text-gray-700 bg-gray-100 hover:bg-gray-200 relative z-50"
                        >
                          <ChevronLeft className="w-5 h-5" />
                          <span>Previous</span>
                        </button>

                        {currentStep === LAST_STEP ? (
                          <button
                            onClick={() => {
                              // Scroll to summary section
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all bg-emerald-600 text-white hover:bg-emerald-700 relative z-50"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>Complete</span>
                          </button>
                        ) : (
                          <button
                            onClick={goToNextStep}
                            className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all bg-emerald-600 text-white hover:bg-emerald-700 relative z-50"
                          >
                            <span>Next Step</span>
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 6 && (
                    <div className="space-y-8">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Hotels</h3>
                        <p className="text-gray-600 mb-6">Choose your preferred accommodation based on your team size and stay duration.</p>
                        <HotelSelection 
                          formData={formData} 
                          onHotelSelect={setSelectedHotel}
                          selectedHotel={selectedHotel}
                        />
                      </div>

                      {/* Step Navigation - Fixed for Mobile */}
                      <div className="flex justify-between items-center pt-8 mobile-nav-buttons relative z-50 bg-white p-4 -mx-6 border-t border-gray-200 lg:bg-transparent lg:border-0 lg:p-0 lg:mx-0">
                        <button
                          onClick={goToPreviousStep}
                          className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all text-gray-700 bg-gray-100 hover:bg-gray-200 relative z-50"
                        >
                          <ChevronLeft className="w-5 h-5" />
                          <span>Previous</span>
                        </button>

                        {currentStep === LAST_STEP ? (
                          <button
                            onClick={() => {
                              // Scroll to summary section
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all bg-emerald-600 text-white hover:bg-emerald-700 relative z-50"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>Complete</span>
                          </button>
                        ) : (
                          <button
                            onClick={goToNextStep}
                            className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all bg-emerald-600 text-white hover:bg-emerald-700 relative z-50"
                          >
                            <span>Next Step</span>
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 7 && (
                    <EnhancedFinalStep
                      formData={formData}
                      costs={costs}
                      selectedFlights={selectedFlights}
                      selectedHotel={selectedHotel}
                      selectedVendors={selectedVendors}
                      formatCurrency={formatCurrency}
                      onStartOver={handleStartOver}
                      stallDesignData={stallDesignData}
                    />
                  )}

                </div>
              </div>
            </div>

            {/* Sidebar - Completely hidden on step 7 to prevent overlap */}
            <div className="lg:col-span-1">
              {currentStep !== 7 && (
                <div className="bg-white rounded-xl shadow-lg sticky top-8 overflow-hidden">
                  {/* Sidebar content for other steps */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>





      {/* Exhibition Planning Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Exhibition Planning Wizard</h2>
              <button
                onClick={() => setShowWizard(false)}
                className="text-gray-400 hover:text-gray-600"
                data-testid="button-close-wizard"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="p-0">
              <PlanningWizard />
            </div>
          </div>
        </div>
      )}

      {/* Risk Assessment Modal */}
      {showRiskAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-orange-600" />
                Exhibition Risk Assessment
              </h2>
              <button
                onClick={() => setShowRiskAssessment(false)}
                className="text-gray-400 hover:text-gray-600"
                data-testid="button-close-risk-assessment"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <RiskAssessment 
                formData={formData}
                costs={costs}
              />
            </div>
          </div>
        </div>
      )}

      <ExhibitionTips 
        isOpen={showTips}
        onClose={() => setShowTips(false)}
      />

      {/* Exhibition Storyboard Modal */}
      <ExhibitionStoryboard
        isOpen={showStoryboard}
        onClose={() => setShowStoryboard(false)}
        formData={formData}
        costs={costs}
        selectedFlights={selectedFlights}
        selectedHotel={selectedHotel}
      />

      {/* AI Success Predictor Modal */}
      {showSuccessPredictor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                AI Success Predictor
              </h2>
              <button
                onClick={() => setShowSuccessPredictor(false)}
                className="text-gray-400 hover:text-gray-600"
                data-testid="button-close-success-predictor"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <SuccessPredictor 
                formData={formData}
                costs={costs}
              />
            </div>
          </div>
        </div>
      )}


      {/* Budget Wizard Modal */}
      {showBudgetWizard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3>Budget Wizard</h3>
            <p>Total Cost: {costs?.total || 0} {formData.currency}</p>
            <button 
              onClick={() => setShowBudgetWizard(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Achievement Notification - Hidden on Mobile */}
      <div className="hidden md:block">
        {currentAchievement && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Achievement: {currentAchievement.title}
          </div>
        )}
      </div>

      {/* Mobile Live Pricing Panel - Bottom on Mobile */}
      {costs && currentStep !== 7 && (
        <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">Live Total</span>
                <span className="text-xs text-gray-500">Step {currentStep}/7</span>
              </div>
              <div className="text-xs text-emerald-600 font-medium">
                🏆 {achievements.length} achievements • {progressScore}% complete
              </div>
            </div>

            <div className="text-2xl font-bold text-emerald-600 mb-2">
              {formatCurrency(
                costs.total + 
                (Object.values(selectedFlights || {}).reduce((total: number, flight: any) => total + (flight?.price || 0), 0)) + 
                (selectedHotel?.totalPrice || 0),
                formData.currency
              )}
            </div>

            {/* Budget Status */}
            {previousCost && costs.total !== previousCost && (
              <div className="text-sm mb-2">
                {costs.total > previousCost ? (
                  <span className="text-red-600">Cost increased by {formatCurrency(costs.total - previousCost, formData.currency)}</span>
                ) : (
                  <span className="text-green-600">Saved {formatCurrency(previousCost - costs.total, formData.currency)}! 🎯</span>
                )}
              </div>
            )}

            {/* Cost Breakdown Bar */}
            <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-green-500" 
                style={{ width: `${(costs.constructionCost / costs.total) * 100}%` }}
                title="Booth"
              ></div>
              <div 
                className="bg-blue-500" 
                style={{ width: `${(costs.travelCost / costs.total) * 100}%` }}
                title="Travel"
              ></div>
              <div 
                className="bg-purple-500" 
                style={{ width: `${((costs.staffCost + costs.marketingCost + costs.servicesCost) / costs.total) * 100}%` }}
                title="Services"
              ></div>
            </div>

            <div className="flex justify-between text-xs text-gray-600">
              <span>Booth</span>
              <span>Travel</span>
              <span>Services</span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Live Pricing Panel - Right Side on Desktop */}
      {costs && (
        <div className="hidden lg:block fixed right-4 top-1/2 transform -translate-y-1/2 z-40 w-80">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Pricing</span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Step {currentStep}/7</span>
              </div>
              
              <div className="text-2xl font-bold mb-1">
                {formatCurrency(
                  costs.total + 
                  (Object.values(selectedFlights || {}).reduce((total: number, flight: any) => total + (flight?.price || 0), 0)) + 
                  (selectedHotel?.totalPrice || 0),
                  formData.currency
                )}
              </div>
              
              <div className="text-xs text-emerald-100">
                🏆 {achievements.length} achievements • {progressScore}% complete
              </div>
            </div>

            <div className="p-4">
              {/* Budget Status */}
              {previousCost && costs.total !== previousCost && (
                <div className="text-sm mb-3 p-2 rounded-lg bg-gray-50">
                  {costs.total > previousCost ? (
                    <span className="text-red-600">↑ Cost increased by {formatCurrency(costs.total - previousCost, formData.currency)}</span>
                  ) : (
                    <span className="text-green-600">↓ Saved {formatCurrency(previousCost - costs.total, formData.currency)}! 🎯</span>
                  )}
                </div>
              )}

              {/* Cost Breakdown Bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Booth Construction</span>
                    <span>{formatCurrency(costs.constructionCost, formData.currency)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300" 
                      style={{ width: `${(costs.constructionCost / costs.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Travel & Hotels</span>
                    <span>{formatCurrency(costs.travelCost + (Object.values(selectedFlights || {}).reduce((total: number, flight: any) => total + (flight?.price || 0), 0)) + (selectedHotel?.totalPrice || 0), formData.currency)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300" 
                      style={{ width: `${((costs.travelCost + (Object.values(selectedFlights || {}).reduce((total: number, flight: any) => total + (flight?.price || 0), 0)) + (selectedHotel?.totalPrice || 0)) / (costs.total + (Object.values(selectedFlights || {}).reduce((total: number, flight: any) => total + (flight?.price || 0), 0)) + (selectedHotel?.totalPrice || 0))) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Services & Marketing</span>
                    <span>{formatCurrency(costs.staffCost + costs.marketingCost + costs.servicesCost, formData.currency)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-300" 
                      style={{ width: `${((costs.staffCost + costs.marketingCost + costs.servicesCost) / costs.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Achievement Progress */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-600 mb-2">Progress</div>
                <div className="flex space-x-2">
                  {achievements.slice(0, 3).map((achievement, index) => (
                    <div key={index} className="flex-1">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mb-1">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      </div>
                      <div className="text-xs text-gray-600 text-center">{achievement}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* All pricing feedback completely removed */}

      {/* All smart assistant and mascot systems completely removed */}

      {/* All celebration modals removed */}

    </div>
  );
}