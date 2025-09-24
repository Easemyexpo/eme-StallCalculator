import { useState, useEffect } from "react";
import { AnimatedBackground } from "@/components/calculator/animated-background";
import { GlobalSettings } from "@/components/calculator/global-settings";
import { EventDetails } from "@/components/calculator/event-details";
import { BoothSpecifications } from "@/components/calculator/booth-specifications";
import { TeamTravel } from "@/components/calculator/team-travel";
import { CostSummary } from "@/components/calculator/cost-summary";
import { VendorRecommendations } from "@/components/calculator/vendor-recommendations";
import AICostPrediction from "@/components/calculator/ai-cost-prediction";
import VenueDatabase from "@/components/calculator/venue-database";
import InteractiveHeatmap from "@/components/calculator/interactive-heatmap";
import SmartVendorMatching from "@/components/calculator/smart-vendor-matching";
import ExportComparison from "@/components/calculator/export-comparison";
import BudgetVisualizer from "@/components/calculator/budget-visualizer";
import AIAssistant from "@/components/calculator/ai-assistant";
import { TravelOptions } from "@/components/calculator/travel-options";
import { RealTimeTravel } from "@/components/calculator/real-time-travel";
import ExternalDataPanel from "@/components/calculator/external-data-panel";
import { Logo } from "@/components/ui/logo";
import { calculateCosts } from "@/lib/calculator";
import { CostBreakdown } from "@shared/schema";
import { Brain, Globe, Lightbulb } from "lucide-react";

interface CalculatorFormData {
  currency: string;
  marketLevel: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  eventStartDate: string;
  eventEndDate: string;
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
}

export default function Calculator() {
  const [formData, setFormData] = useState<CalculatorFormData>({
    currency: "USD",
    marketLevel: "medium",
    originCity: "",
    originState: "",
    destinationCity: "",
    destinationState: "",
    eventStartDate: "",
    eventEndDate: "",
    arrivalDate: "",
    departureDate: "",
    eventType: "trade",
    eventDuration: 3,
    distance: 500,
    venueType: "standard",
    boothSize: 18,
    boothType: "custom",
    teamSize: 4,
    accommodationLevel: "business",
    furniture: false,
    avEquipment: false,
    lighting: false,
    internet: false,
    storage: false,
    security: false,
  });

  const [costs, setCosts] = useState<CostBreakdown>({
    boothCost: 0,
    constructionCost: 0,
    travelCost: 0,
    staffCost: 0,
    marketingCost: 0,
    logisticsCost: 0,
    servicesCost: 0,
    total: 0,
    currency: "USD",
  });

  const [externalDataVisible, setExternalDataVisible] = useState(false);

  useEffect(() => {
    const newCosts = calculateCosts(formData, formData.destinationState);
    setCosts(newCosts);
  }, [formData]);

  const updateFormData = (updates: Partial<CalculatorFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetCalculator = () => {
    if (window.confirm("Are you sure you want to reset all values?")) {
      setFormData({
        currency: "USD",
        marketLevel: "medium",
        originCity: "",
        originState: "",
        destinationCity: "",
        destinationState: "",
        eventStartDate: "",
        eventEndDate: "",
        arrivalDate: "",
        departureDate: "",
        eventType: "trade",
        eventDuration: 3,
        distance: 500,
        venueType: "standard",
        boothSize: 18,
        boothType: "custom",
        teamSize: 4,
        accommodationLevel: "business",
        furniture: false,
        avEquipment: false,
        lighting: false,
        internet: false,
        storage: false,
        security: false,
      });
    }
  };

  return (
    <div className="font-body bg-gradient-to-br from-gray-900 via-slate-800 to-emerald-900 min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="glass-effect border-b border-emerald-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex justify-center mb-6 animate-fade-in">
                <Logo size="lg" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-emerald-300 to-emerald-400 bg-clip-text text-transparent" data-testid="title-main">
                Exhibition Cost Calculator
              </h1>
              <p className="text-xl text-gray-300 font-light mt-4" data-testid="text-subtitle">
                <span className="text-primary font-semibold">AI-Powered Intelligence by EaseMyExpo</span><br />
                Smart cost estimation for Indian exhibitions with global market insights
              </p>
              <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full text-sm text-emerald-300">
                <Globe className="w-4 h-4" data-testid="icon-globe" />
                <span data-testid="text-features">Indian market focus • Global coverage • AI vendor matching • Real-time calculations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Calculator */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              <GlobalSettings 
                formData={formData} 
                updateFormData={updateFormData} 
              />
              
              <ExternalDataPanel 
                formData={formData}
                isVisible={externalDataVisible}
                onToggle={() => setExternalDataVisible(!externalDataVisible)}
              />
              
              <EventDetails 
                formData={formData} 
                updateFormData={updateFormData} 
              />
              
              <BoothSpecifications 
                formData={formData} 
                updateFormData={updateFormData} 
              />
              
              <TeamTravel 
                formData={formData} 
                updateFormData={updateFormData} 
              />
              
              <TravelOptions 
                formData={formData}
              />
              
              <RealTimeTravel 
                formData={formData}
              />
              
              <VendorRecommendations 
                formData={formData} 
              />
            </div>

            {/* Cost Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <CostSummary 
                  costs={costs} 
                  currency={costs.currency}
                  onReset={resetCalculator} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Event Images Gallery */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center" data-testid="title-gallery">
              Professional Exhibition Showcase
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350" 
                alt="Large corporate exhibition" 
                className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                data-testid="img-gallery-1"
              />
              <img 
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350" 
                alt="High-end trade show booth" 
                className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                data-testid="img-gallery-2"
              />
              <img 
                src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350" 
                alt="International conference center" 
                className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                data-testid="img-gallery-3"
              />
              <img 
                src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350" 
                alt="Technology expo displays" 
                className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                data-testid="img-gallery-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
