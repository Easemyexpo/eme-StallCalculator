import { useState, useCallback, useMemo } from "react";
import { EnhancedFinalStep } from "@/components/calculator/enhanced-final-step";
import { DetailsStep } from "@/components/calculator/details-step";
import { StallDesignStep } from "@/components/calculator/stall-design-step";
import { ServicesStep } from "@/components/calculator/services-step";
import { VendorStep } from "@/components/calculator/vendor-step";
import { FlightsStep } from "@/components/calculator/flights-step";
import { HotelsStep } from "@/components/calculator/hotels-step";

import type { FormData as CalculatorFormData } from "@/lib/calculator";

const STEPS = [
  { id: 1, title: "Exhibition Details", component: "details" },
  { id: 2, title: "Stall Design", component: "stall-design" },
  { id: 3, title: "Booth Specifications", component: "services" },
  { id: 4, title: "Smart Vendor Matching", component: "vendor" },
  { id: 5, title: "Travel Bookings", component: "flights" },
  { id: 6, title: "Hotel Selection", component: "hotels" },
  { id: 7, title: "Final Quote", component: "final" }
];

export default function ExpoCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CalculatorFormData>({
    currency: 'INR',
    marketLevel: 'medium',
    originCity: '',
    originState: '',
    destinationCity: '',
    destinationState: '',
    eventStartDate: '',
    eventEndDate: '',
    arrivalDate: '',
    departureDate: '',
    eventType: '',
    eventDuration: 3,
    distance: 0,
    venueType: '',
    boothSize: 0,
    customSize: 0,
    boothType: '',
    teamSize: 1,
    accommodationLevel: 'standard',
    furniture: false,
    avEquipment: false,
    lighting: false,
    internet: false,
    storage: false,
    security: false
  });
  
  const [stallDesignData, setStallDesignData] = useState({
    area: 0,
    areaUnit: 'sqm',
    boothPosition: 'inline',
    construction: 'standard',
    materials: [],
    features: [],
    accessibility: false,
    branding: 'basic'
  });
  const [selectedFlights, setSelectedFlights] = useState<any>({});
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [selectedVendors, setSelectedVendors] = useState<any[]>([]);
  const [showReturnFlights, setShowReturnFlights] = useState(false);

  const updateFormData = useCallback((data: Partial<CalculatorFormData>) => {
    setFormData((prev: CalculatorFormData) => ({ ...prev, ...data }));
  }, []);

  const updateStallDesignData = useCallback((data: any) => {
    setStallDesignData(prev => ({ ...prev, ...data }));
  }, []);

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    const step = STEPS[currentStep - 1];
    
    switch (step.component) {
      case "details":
        return <DetailsStep formData={formData} updateFormData={updateFormData} />;
      case "stall-design":
        return <StallDesignStep stallDesignData={stallDesignData} updateStallDesignData={updateStallDesignData} />;
      case "services":
        return <ServicesStep formData={formData} updateFormData={updateFormData} />;
      case "vendor":
        return <VendorStep 
          formData={formData} 
          selectedVendors={selectedVendors} 
          setSelectedVendors={setSelectedVendors} 
        />;
      case "flights":
        return <FlightsStep 
          formData={formData}
          selectedFlights={selectedFlights}
          setSelectedFlights={setSelectedFlights}
          showReturnFlights={showReturnFlights}
          setShowReturnFlights={setShowReturnFlights}
        />;
      case "hotels":
        return <HotelsStep 
          formData={formData}
          selectedHotel={selectedHotel}
          setSelectedHotel={setSelectedHotel}
        />;
      case "final":
        return <EnhancedFinalStep 
          formData={formData}
          costs={{ total: 0, currency: 'INR' }}
          stallDesignData={stallDesignData}
          selectedFlights={selectedFlights}
          selectedHotel={selectedHotel}
          selectedVendors={selectedVendors}
          formatCurrency={(amount: number) => `₹${(amount || 0).toLocaleString()}`}
          onStartOver={() => setCurrentStep(1)}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-2 md:px-0">
      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trade Show Cost Calculator
          </h1>
          <p className="text-gray-600">Powered by EaseMyExpo</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep > step.id 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-12 h-1 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
            </span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        {currentStep !== 7 && (
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Next Step
            </button>
          </div>
        )}
      </div>
    </div>
  );
}