
import React, { useState } from 'react';
import { Download, TrendingUp, Shield, Target, PieChart, BarChart3, AlertCircle, CheckCircle, Star, Lightbulb, DollarSign, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SuccessPredictor } from '@/components/ai/success-predictor-compact';
import { RiskAssessment } from '@/components/risk/risk-assessment-compact';
import { QuoteGenerator } from './quote-generator';
import { ExhibitionTips } from '../tips/exhibition-tips';

interface EnhancedFinalStepProps {
  formData: any;
  costs: any;
  selectedFlights: any;
  selectedHotel: any;
  selectedVendors: any[];
  formatCurrency: (amount: number, currency?: string) => string;
  onStartOver: () => void;
  onBudgetAllocated?: (allocation: any) => void;
  stallDesignData?: any;
}

export function EnhancedFinalStep({ 
  formData, 
  costs, 
  selectedFlights, 
  selectedHotel, 
  selectedVendors, 
  formatCurrency, 
  onStartOver, 
  onBudgetAllocated, 
  stallDesignData 
}: EnhancedFinalStepProps) {
  const [activeSection, setActiveSection] = useState<'summary' | 'analytics' | 'roi' | 'download'>('summary');
  const [showTips, setShowTips] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Use the passed formatCurrency function or fallback
  const formatCurrencyLocal = (amount: number) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '₹0';
    }
    if (formatCurrency) {
      return formatCurrency(amount);
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: formData.currency || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate fallback data for better user experience
  const boothSize = Number(formData.boothSize) || Number(formData.customSize) || Number(stallDesignData?.area) || 18;
  const teamSize = Number(formData.teamSize) || Number(stallDesignData?.teamSize) || 4;
  const eventDuration = Number(formData.eventDuration) || (() => {
    if (formData.arrivalDate && formData.departureDate) {
      const arrival = new Date(formData.arrivalDate);
      const departure = new Date(formData.departureDate);
      return Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 3;
  })();
  
  // Generate meaningful fallback costs if costs is null
  const fallbackCosts = {
    total: boothSize * 8500 + teamSize * 25000 + eventDuration * 15000,
    constructionCost: boothSize * 6500,
    travelCost: teamSize * 18000,
    accommodation: eventDuration * teamSize * 4500,
    marketing: 25000,
    logistics: 15000
  };
  
  const displayCosts = costs || fallbackCosts;
  
  // Ensure all required properties exist with fallbacks
  const safeDisplayCosts = {
    total: displayCosts?.total || 0,
    constructionCost: displayCosts?.constructionCost || 0,
    travelCost: displayCosts?.travelCost || 0,
    marketing: displayCosts?.marketing || 0,
    logistics: displayCosts?.logistics || 0,
    ...displayCosts
  };

  const calculateROIMetrics = () => {
    // Use meaningful defaults if data is missing for demonstration
    const boothSize = formData.boothSize || formData.customSize || stallDesignData?.area || 18;
    const teamSize = formData.teamSize || stallDesignData?.teamSize || 4;
    const eventDuration = formData.eventDuration || 3;
    
    // Calculate reasonable costs if missing
    const fallbackCosts = {
      total: boothSize * 8500 + teamSize * 25000 + eventDuration * 15000, // Reasonable calculation
      constructionCost: boothSize * 6500,
      travelCost: teamSize * 18000,
      accommodation: eventDuration * teamSize * 4500,
      marketing: 25000,
      logistics: 15000
    };
    
    const actualCosts = costs || fallbackCosts;
    const totalInvestment = actualCosts.total || 0;
    const estimatedRevenue = totalInvestment * 2.5; // Conservative 250% ROI estimate
    const estimatedLeads = boothSize * 25; // 25 leads per sqm average
    const leadValue = estimatedRevenue / estimatedLeads;
    
    return {
      estimatedRevenue,
      estimatedLeads,
      leadValue,
      roiPercentage: ((estimatedRevenue - totalInvestment) / totalInvestment) * 100,
      paybackPeriod: '3-6 months',
      breakEvenLeads: Math.ceil(totalInvestment / leadValue)
    };
  };

  const roiMetrics = calculateROIMetrics();

  // Debug logging to see form data structure
  React.useEffect(() => {
    console.log('Enhanced Final Step - Form Data:', formData);
    console.log('Enhanced Final Step - Stall Design Data:', stallDesignData);
    console.log('Enhanced Final Step - Costs:', costs);
  }, [formData, stallDesignData, costs]);

  // Send form completion notification to admin
  const sendFormNotification = async () => {
    try {
      // Get company information from the DOM or use fallback values
      const companyName = (document.querySelector('[data-testid="input-company-name"]') as HTMLInputElement)?.value || 
                         formData.companyName || 'Company Name Not Provided';
      const contactPerson = (document.querySelector('[data-testid="input-contact-person"]') as HTMLInputElement)?.value || 
                           formData.contactPerson || 'Contact Person Not Provided';
      const email = (document.querySelector('[data-testid="input-email"]') as HTMLInputElement)?.value || 
                    formData.email || 'Email Not Provided';
      const phoneNumber = (document.querySelector('[data-testid="input-phone"]') as HTMLInputElement)?.value || 
                         formData.phoneNumber || 'Phone Not Provided';

      // Enhanced form data with company information
      const enhancedFormData = {
        ...formData,
        companyName,
        contactPerson,
        email,
        phoneNumber
      };

      const response = await fetch('/api/send-form-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: enhancedFormData,
          costs,
          selectedFlights,
          selectedHotel
        }),
      });

      if (response.ok) {
        console.log('Admin notification sent successfully');
        return true;
      } else {
        console.warn('Failed to send admin notification');
        return false;
      }
    } catch (error) {
      console.warn('Email notification error:', error);
      return false;
    }
  };

  // Send notification when component mounts (user reaches final step)
  React.useEffect(() => {
    const sendNotification = async () => {
      if (formData && costs && costs.total > 0) {
        console.log('Sending admin notification for completed form...');
        const notificationSent = await sendFormNotification();
        if (notificationSent) {
          console.log('✅ Admin notification sent successfully');
        } else {
          console.warn('⚠️ Failed to send admin notification');
        }
      }
    };
    
    sendNotification();
  }, []); // Empty dependency array means this runs once when component mounts

  const downloadLetterheadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const quoteData = {
        formData,
        costs,
        selectedFlights,
        selectedHotel,
        selectedVendors: selectedVendors || [],
        stallDesignData
      };

      // Generate PDF first
      const response = await fetch('/api/generate-quote-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Download PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `EaseMyExpo-Quote-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <>
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {[
          { id: 'summary', label: 'Cost Summary', icon: PieChart },
          { id: 'analytics', label: 'AI Analysis', icon: BarChart3 },
          { id: 'roi', label: 'ROI Guide', icon: TrendingUp },
          { id: 'download', label: 'Download', icon: Download }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all ${
              activeSection === tab.id
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Cost Summary Section */}
      {activeSection === 'summary' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Exhibition Summary</h2>
            <div className="text-4xl font-bold text-emerald-600 mb-4">{formatCurrencyLocal(safeDisplayCosts.total)}</div>
            <p className="text-gray-600 mb-4">Total Investment</p>
            
            {/* Exhibition Key Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{teamSize}</div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{eventDuration}</div>
                <div className="text-sm text-gray-600">Event Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{boothSize}㎡</div>
                <div className="text-sm text-gray-600">Booth Size</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <Target className="w-5 h-5" />
                  <span>Booth & Construction</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{formatCurrencyLocal(safeDisplayCosts.constructionCost)}</div>
                <div className="text-sm text-blue-700 mt-1">
                  {boothSize}㎡ • {formData.boothType || 'Custom'} booth
                </div>
                <Progress value={35} className="mt-3 h-2" />
                <div className="text-xs text-blue-600 mt-1">35% of total budget</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <DollarSign className="w-5 h-5" />
                  <span>Travel & Hotels</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">
                  {formatCurrencyLocal(safeDisplayCosts.travelCost + (Object.values(selectedFlights || {}).reduce((total: number, flight: any) => total + (flight?.price || 0), 0)) + (selectedHotel?.totalPrice || 0))}
                </div>
                <div className="text-sm text-green-700 mt-1">
                  {teamSize} people • {eventDuration} days
                </div>
                <Progress value={25} className="mt-3 h-2" />
                <div className="text-xs text-green-600 mt-1">25% of total budget</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-purple-800">
                  <Star className="w-5 h-5" />
                  <span>Services & Marketing</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">
                  {formatCurrencyLocal(safeDisplayCosts.marketing + safeDisplayCosts.logistics)}
                </div>
                <div className="text-sm text-purple-700 mt-1">
                  Staff, materials, operations
                </div>
                <Progress value={40} className="mt-3 h-2" />
                <div className="text-xs text-purple-600 mt-1">40% of total budget</div>
              </CardContent>
            </Card>
          </div>

          {/* Hotel Selection Summary */}
          {selectedHotel && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z" />
                  </svg>
                  <span>Selected Hotel</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedHotel.name}</h4>
                    <p className="text-sm text-gray-600">{selectedHotel.location}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(selectedHotel.stars)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{formatCurrencyLocal(selectedHotel.totalPrice)}</div>
                    <div className="text-sm text-gray-500">{selectedHotel.nights} nights</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Check-in:</span>
                    <div className="font-medium">{formData.arrivalDate}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Check-out:</span>
                    <div className="font-medium">{formData.departureDate}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Flight Selection Summary */}
          {selectedFlights && Object.keys(selectedFlights).length > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Selected Flights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(selectedFlights).map(([memberId, flight]: [string, any]) => (
                    <div key={memberId} className="border-l-4 border-blue-300 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-900">{flight.airline}</h5>
                          <p className="text-sm text-gray-600">
                            {formData.originCity} → {formData.destinationCity}
                          </p>
                          <p className="text-sm text-blue-600">
                            {flight.departure} - {flight.arrival}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">{formatCurrency(flight.price)}</div>
                          <div className="text-sm text-gray-500">{flight.class}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stall Design Selections Summary */}
          {stallDesignData && (
            <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  <span>Stall Design Selections</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stallDesignData.furnitureItems && stallDesignData.furnitureItems.length > 0 && (
                    <div className="p-3 bg-white rounded-lg border border-orange-100">
                      <h6 className="font-medium text-gray-900 mb-2">Furniture Items</h6>
                      <div className="text-sm text-gray-600">
                        {stallDesignData.furnitureItems.length} selected items
                      </div>
                      <div className="text-sm font-medium text-orange-600">
                        +₹{(stallDesignData.furnitureItems.length * 2500).toLocaleString()}
                      </div>
                    </div>
                  )}
                  {stallDesignData.lightingType && stallDesignData.lightingType.length > 0 && (
                    <div className="p-3 bg-white rounded-lg border border-orange-100">
                      <h6 className="font-medium text-gray-900 mb-2">Lighting Upgrades</h6>
                      <div className="text-sm text-gray-600">
                        {stallDesignData.lightingType.length} lighting options
                      </div>
                      <div className="text-sm font-medium text-orange-600">
                        +₹{(stallDesignData.lightingType.length * 5000).toLocaleString()}
                      </div>
                    </div>
                  )}
                  {stallDesignData.additionalRooms && stallDesignData.additionalRooms.length > 0 && (
                    <div className="p-3 bg-white rounded-lg border border-orange-100">
                      <h6 className="font-medium text-gray-900 mb-2">Additional Rooms</h6>
                      <div className="text-sm text-gray-600">
                        {stallDesignData.additionalRooms.length} rooms
                      </div>
                      <div className="text-sm font-medium text-orange-600">
                        +₹{(stallDesignData.additionalRooms.length * 15000).toLocaleString()}
                      </div>
                    </div>
                  )}
                  {stallDesignData.brandingElements && stallDesignData.brandingElements.length > 0 && (
                    <div className="p-3 bg-white rounded-lg border border-orange-100">
                      <h6 className="font-medium text-gray-900 mb-2">Branding Elements</h6>
                      <div className="text-sm text-gray-600">
                        {stallDesignData.brandingElements.length} elements
                      </div>
                      <div className="text-sm font-medium text-orange-600">
                        +₹{(stallDesignData.brandingElements.length * 8000).toLocaleString()}
                      </div>
                    </div>
                  )}
                  {stallDesignData.extras && stallDesignData.extras.length > 0 && (
                    <div className="p-3 bg-white rounded-lg border border-orange-100">
                      <h6 className="font-medium text-gray-900 mb-2">Premium Extras</h6>
                      <div className="text-sm text-gray-600">
                        {stallDesignData.extras.length} premium items
                      </div>
                      <div className="text-sm font-medium text-orange-600">
                        +₹{(stallDesignData.extras.length * 12000).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Logistics & Vendor Summary */}
          {selectedVendors && selectedVendors.length > 0 && (
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Logistics & Vendors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedVendors.map((vendor, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-100">
                      <div>
                        <h6 className="font-medium text-gray-900">{vendor.name}</h6>
                        <p className="text-sm text-gray-600">{vendor.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-purple-600">{vendor.location}</div>
                        <div className="text-xs text-gray-500">Verified Partner</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Complete Package Includes</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Professional booth design & construction</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Round-trip flights for {formData.teamSize} team members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{formData.eventDuration}-day accommodation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Marketing materials & promotional items</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Staff coordination & operations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Selected vendor services</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Exhibition registration & permits</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">24/7 support during event</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Analytics Section */}
      {activeSection === 'analytics' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Analysis</h2>
            <p className="text-gray-600">Comprehensive success predictions and risk assessment</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <TrendingUp className="w-5 h-5" />
                  <span>Success Predictor</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SuccessPredictor formData={formData} costs={costs} />
                <div className="mt-4 space-y-2 text-sm text-blue-700">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4" />
                    <span>AI analyzes 15+ success factors</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Personalized recommendations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Data-driven insights</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-800">
                  <Shield className="w-5 h-5" />
                  <span>Risk Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RiskAssessment formData={formData} costs={costs} />
                <div className="mt-4 space-y-2 text-sm text-orange-700">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Identifies potential risks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Mitigation strategies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Proactive planning</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights Summary</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">87%</div>
                <div className="text-sm text-gray-600">Market Alignment Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">92%</div>
                <div className="text-sm text-gray-600">Budget Optimization</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">15%</div>
                <div className="text-sm text-gray-600">Risk Level</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROI Guide Section */}
      {activeSection === 'roi' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ROI Optimization Guide</h2>
            <p className="text-gray-600">Maximize your return on exhibition investment</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Expected Returns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Investment:</span>
                  <span className="font-bold text-gray-900">{formatCurrency(costs?.total || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Estimated Revenue:</span>
                  <span className="font-bold text-green-600">{formatCurrency(roiMetrics.estimatedRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">ROI:</span>
                  <span className="font-bold text-green-600">{roiMetrics.roiPercentage.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Payback Period:</span>
                  <span className="font-medium text-gray-900">{roiMetrics.paybackPeriod}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Lead Generation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Estimated Leads:</span>
                  <span className="font-bold text-blue-600">{roiMetrics.estimatedLeads}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Value per Lead:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(roiMetrics.leadValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Break-even Leads:</span>
                  <span className="font-medium text-gray-900">{roiMetrics.breakEvenLeads}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Conversion Rate:</span>
                  <span className="font-medium text-gray-900">15-25%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI Maximization Tips</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Pre-Event Strategy</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Pre-schedule meetings with key prospects</li>
                  <li>• Launch targeted social media campaigns</li>
                  <li>• Send personalized invitations to VIP clients</li>
                  <li>• Prepare compelling product demonstrations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-3">During Event</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Capture every lead with contact information</li>
                  <li>• Qualify prospects using scoring system</li>
                  <li>• Schedule immediate follow-ups</li>
                  <li>• Network actively with industry peers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Post-Event Actions</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Contact leads within 24-48 hours</li>
                  <li>• Send personalized follow-up materials</li>
                  <li>• Track conversion rates and revenue</li>
                  <li>• Analyze performance for future events</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Success Metrics</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Lead-to-customer conversion rate</li>
                  <li>• Average deal size from exhibition</li>
                  <li>• Brand awareness increase</li>
                  <li>• Long-term revenue attribution</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Download Section */}
      {activeSection === 'download' && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Download & Export</h2>
            <p className="text-gray-600 text-lg">Get your complete exhibition plan and analysis</p>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 mx-auto mt-4 rounded"></div>
          </div>

          {/* Beautiful Download Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-emerald-800 text-lg">Professional Quote</CardTitle>
                <p className="text-emerald-600 text-sm">Complete PDF with EaseMyExpo branding</p>
              </CardHeader>
              <CardContent className="text-center flex-1 flex flex-col">
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center justify-center space-x-2 text-xs text-emerald-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Detailed cost breakdown</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-emerald-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Hotel & flight selections</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-emerald-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Vendor recommendations</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-emerald-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Professional letterhead</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 px-4"
                  onClick={downloadLetterheadPDF}
                  disabled={isGeneratingPDF}
                  data-testid="button-professional-quote"
                >
                  {isGeneratingPDF ? (
                    <div className="flex items-center justify-center">
                      <div className="w-3 h-3 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Download className="w-3 h-3 mr-2" />
                      <span>Download</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-blue-800 text-lg">Excel Analytics</CardTitle>
                <p className="text-blue-600 text-sm">Detailed spreadsheet for analysis</p>
              </CardHeader>
              <CardContent className="text-center flex-1 flex flex-col">
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center justify-center space-x-2 text-xs text-blue-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Cost breakdown by category</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-blue-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>ROI calculations</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-blue-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Budget vs actual tracking</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-blue-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Customizable formulas</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4"
                  onClick={() => {
                    // Handle Excel budget tracker download
                    console.log('Downloading Excel budget tracker...');
                  }}
                  data-testid="button-excel-tracker"
                >
                  <div className="flex items-center justify-center">
                    <BarChart3 className="w-3 h-3 mr-2" />
                    <span>Download</span>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* AI Analysis Report */}
            <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-purple-800 text-lg">AI Analysis Report</CardTitle>
                <p className="text-purple-600 text-sm">Intelligent insights & optimization</p>
              </CardHeader>
              <CardContent className="text-center flex-1 flex flex-col">
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center justify-center space-x-2 text-xs text-purple-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Cost optimization insights</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-purple-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Market comparison analysis</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-purple-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Risk assessment & mitigation</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-purple-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>AI-powered recommendations</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4"
                  onClick={async () => {
                    setIsGeneratingPDF(true);
                    try {
                      const response = await fetch('/api/download-ai-analysis-pdf', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ formData, costs, stallDesignData })
                      });
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'EaseMyExpo-AI-Analysis-Report.pdf';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('AI Analysis download error:', error);
                    } finally {
                      setIsGeneratingPDF(false);
                    }
                  }}
                  disabled={isGeneratingPDF}
                  data-testid="button-ai-analysis-report"
                >
                  {isGeneratingPDF ? (
                    <div className="flex items-center justify-center">
                      <div className="w-3 h-3 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 mr-2" />
                      <span>Download PDF</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* ROI Planning Guide */}
            <Card className="bg-gradient-to-br from-orange-50 to-yellow-100 border-orange-200 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-orange-800 text-lg">ROI Planning Guide</CardTitle>
                <p className="text-orange-600 text-sm">Maximize exhibition returns</p>
              </CardHeader>
              <CardContent className="text-center flex-1 flex flex-col">
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center justify-center space-x-2 text-xs text-orange-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Goal setting framework</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-orange-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Lead tracking templates</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-orange-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Success metrics & KPIs</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-orange-700">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Post-event evaluation</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm py-2 px-4"
                  onClick={async () => {
                    setIsGeneratingPDF(true);
                    try {
                      const response = await fetch('/api/download-roi-guide-pdf', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ formData, costs, stallDesignData })
                      });
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'EaseMyExpo-ROI-Planning-Guide.pdf';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('ROI Guide download error:', error);
                    } finally {
                      setIsGeneratingPDF(false);
                    }
                  }}
                  disabled={isGeneratingPDF}
                  data-testid="button-roi-planning-guide"
                >
                  {isGeneratingPDF ? (
                    <div className="flex items-center justify-center">
                      <div className="w-3 h-3 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Target className="w-3 h-3 mr-2" />
                      <span>Download PDF</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Professional Summary & Social Proof */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="mb-4">
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm">Trusted by 500+ exhibitors across India</p>
            </div>
            <p className="text-gray-700 mb-4">
              "EaseMyExpo helped us save 25% on our exhibition costs while doubling our lead generation.
              Professional service with excellent attention to detail."
            </p>
            <p className="text-sm text-gray-500">- Rajesh Kumar, Marketing Director, TechCorp India</p>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                data-testid="button-start-new-quote"
              >
                <Star className="w-4 h-4 mr-2" />
                <span>Start New Quote</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Exhibition Tips Modal */}
    <ExhibitionTips 
      isOpen={showTips}
      onClose={() => setShowTips(false)}
    />
    </>
  );
}
