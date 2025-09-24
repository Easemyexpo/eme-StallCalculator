import { Calendar, MapPin, Clock, Building, Star, Users, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface EventDetailsProps {
  formData: {
    eventType: string;
    eventDuration: number;
    distance: number;
    venueType: string;
    originState?: string;
    originCity?: string;
    destinationCity?: string;
    destinationState?: string;
    exhibitionStartDate?: string;
    exhibitionEndDate?: string;
    arrivalDate?: string;
    departureDate?: string;
    exhibitionName?: string;
    industry?: string;
  };
  updateFormData: (updates: any) => void;
}

export function EventDetails({ formData, updateFormData }: EventDetailsProps) {

  // Calculate distance between cities
  const calculateDistance = (originCity: string, originState: string, destinationCity: string, destinationState: string): number => {
    if (!originCity || !destinationCity) return 0;
    
    // If same city
    if (originCity === destinationCity && originState === destinationState) {
      return 50; // Local travel within city
    }
    
    // If same state but different cities
    if (originState === destinationState) {
      return 200; // Within state travel
    }
    
    // Inter-state distances (in km)
    const distances: Record<string, Record<string, number>> = {
      'Mumbai-IN-MH': {
        'New Delhi-IN-DL': 1400, 'Bangalore-IN-KA': 980, 'Chennai-IN-TN': 1340,
        'Hyderabad-IN-AP': 710, 'Kolkata-IN-WB': 2000, 'Ahmedabad-IN-GJ': 530,
        'Pune-IN-MH': 150, 'Mysore-IN-KA': 980, 'Jaipur-IN-RJ': 1170
      },
      'New Delhi-IN-DL': {
        'Mumbai-IN-MH': 1400, 'Bangalore-IN-KA': 2200, 'Chennai-IN-TN': 2180,
        'Hyderabad-IN-AP': 1570, 'Kolkata-IN-WB': 1470, 'Ahmedabad-IN-GJ': 960,
        'Pune-IN-MH': 1450, 'Mysore-IN-KA': 2300, 'Jaipur-IN-RJ': 280
      },
      'Bangalore-IN-KA': {
        'Mumbai-IN-MH': 980, 'New Delhi-IN-DL': 2200, 'Chennai-IN-TN': 350,
        'Hyderabad-IN-AP': 570, 'Kolkata-IN-WB': 1870, 'Ahmedabad-IN-GJ': 1490,
        'Pune-IN-MH': 840, 'Mysore-IN-KA': 140, 'Jaipur-IN-RJ': 1970
      },
      'Pune-IN-MH': {
        'Mumbai-IN-MH': 150, 'New Delhi-IN-DL': 1450, 'Bangalore-IN-KA': 840,
        'Chennai-IN-TN': 1180, 'Hyderabad-IN-AP': 560, 'Kolkata-IN-WB': 1850,
        'Ahmedabad-IN-GJ': 670, 'Mysore-IN-KA': 820, 'Jaipur-IN-RJ': 1220
      }
    };
    
    const originKey = `${originCity}-${originState}`;
    const destinationKey = `${destinationCity}-${destinationState}`;
    
    if (distances[originKey] && distances[originKey][destinationKey]) {
      return distances[originKey][destinationKey];
    }
    
    // Check reverse direction
    if (distances[destinationKey] && distances[destinationKey][originKey]) {
      return distances[destinationKey][originKey];
    }
    
    // Fallback for Indian cities
    if (originState?.startsWith('IN-') && destinationState?.startsWith('IN-')) {
      return 800; // Average Indian inter-state distance
    }
    
    return 1000; // Default distance
  };

  // Calculate recommended arrival/departure dates based on exhibition dates
  const calculateRecommendedDates = () => {
    if (formData.exhibitionStartDate && formData.exhibitionEndDate) {
      const startDate = new Date(formData.exhibitionStartDate);
      const endDate = new Date(formData.exhibitionEndDate);
      
      // Recommend arrival 1-2 days before exhibition start
      const recommendedArrival = new Date(startDate);
      recommendedArrival.setDate(startDate.getDate() - 1);
      
      // Recommend departure 1 day after exhibition end
      const recommendedDeparture = new Date(endDate);
      recommendedDeparture.setDate(endDate.getDate() + 1);
      
      return {
        arrival: recommendedArrival.toISOString().split('T')[0],
        departure: recommendedDeparture.toISOString().split('T')[0]
      };
    }
    return { arrival: '', departure: '' };
  };

  const calculateStayDuration = () => {
    if (formData.arrivalDate && formData.departureDate) {
      const arrival = new Date(formData.arrivalDate);
      const departure = new Date(formData.departureDate);
      const diffTime = Math.abs(departure.getTime() - arrival.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const getSeasonalPricing = () => {
    if (formData.exhibitionStartDate) {
      const month = new Date(formData.exhibitionStartDate).getMonth() + 1;
      if (month >= 10 || month <= 3) {
        return { season: 'Peak season (Oct-Mar)', modifier: '+15%', icon: '🔥' };
      } else if (month >= 4 && month <= 6) {
        return { season: 'Summer (Apr-Jun)', modifier: '-5%', icon: '☀️' };
      } else {
        return { season: 'Monsoon (Jul-Sep)', modifier: 'Standard', icon: '🌧️' };
      }
    }
    return { season: '', modifier: '', icon: '' };
  };

  const recommended = calculateRecommendedDates();
  const stayDuration = calculateStayDuration();
  const seasonalInfo = getSeasonalPricing();
  
  // Calculate distance and update form data when cities change
  const currentDistance = calculateDistance(
    formData.originCity || '', 
    formData.originState || '', 
    formData.destinationCity || '', 
    formData.destinationState || ''
  );
  
  // Auto-update distance in form data using useEffect to prevent render warnings
  useEffect(() => {
    if (currentDistance !== formData.distance && currentDistance > 0) {
      updateFormData({ distance: currentDistance });
    }
  }, [currentDistance, formData.distance]);

  return (
    <div className="space-y-8" data-testid="card-event-details">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <p className="text-gray-600">Configure your exhibition event details</p>
      </div>

      {/* Location & Event Section */}
      <div className="space-y-6">
          {/* Exhibition Name - Always Required */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center space-x-2 mb-4">
              <Building className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Exhibition Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exhibition/Event Name *</label>
                <input
                  type="text"
                  value={formData.exhibitionName || ''}
                  onChange={(e) => updateFormData({ exhibitionName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter the name of the exhibition or trade show"
                  required
                  data-testid="input-exhibition-name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Industry *</label>
                <select
                  value={formData.industry || ''}
                  onChange={(e) => updateFormData({ industry: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                  data-testid="select-industry"
                >
                  <option value="">Select your industry</option>
                  <option value="Aerospace & Defense">Aerospace & Defense</option>
                  <option value="Agriculture & Farming">Agriculture & Farming</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Banking & Finance">Banking & Finance</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Chemical & Petrochemical">Chemical & Petrochemical</option>
                  <option value="Construction & Infrastructure">Construction & Infrastructure</option>
                  <option value="Consumer Electronics">Consumer Electronics</option>
                  <option value="Education & Training">Education & Training</option>
                  <option value="Energy & Power">Energy & Power</option>
                  <option value="Fashion & Textiles">Fashion & Textiles</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Healthcare & Medical">Healthcare & Medical</option>
                  <option value="Heavy Machinery">Heavy Machinery</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Jewelry & Gems">Jewelry & Gems</option>
                  <option value="Leather & Footwear">Leather & Footwear</option>
                  <option value="Logistics & Transportation">Logistics & Transportation</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Mining & Metals">Mining & Metals</option>
                  <option value="Oil & Gas">Oil & Gas</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Pharmaceuticals">Pharmaceuticals</option>
                  <option value="Plastics & Polymers">Plastics & Polymers</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="Retail & E-commerce">Retail & E-commerce</option>
                  <option value="Security & Safety">Security & Safety</option>
                  <option value="Sports & Recreation">Sports & Recreation</option>
                  <option value="Telecommunications">Telecommunications</option>
                  <option value="Tourism & Travel">Tourism & Travel</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Water Treatment">Water Treatment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Destination Selection */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Exhibition Location</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure State/Region</label>
                <select 
                  value={formData.originState || ''}
                  onChange={(e) => updateFormData({ originState: e.target.value, originCity: '' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  data-testid="select-departure-state"
                >
                  <option value="">Select Departure State/Region</option>
                  <option value="IN-DL">Delhi</option>
                  <option value="IN-MH">Maharashtra (Mumbai, Pune)</option>
                  <option value="IN-KA">Karnataka (Bangalore)</option>
                  <option value="IN-TN">Tamil Nadu (Chennai)</option>
                  <option value="IN-WB">West Bengal (Kolkata)</option>
                  <option value="IN-AP">Andhra Pradesh (Hyderabad)</option>
                  <option value="IN-GJ">Gujarat (Ahmedabad)</option>
                  <option value="IN-RJ">Rajasthan (Jaipur)</option>
                  <option value="IN-KL">Kerala (Kochi)</option>
                  <option value="IN-PB">Punjab (Chandigarh)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arrival State/Region (Exhibition Location)</label>
                <select 
                  value={formData.destinationState || ''}
                  onChange={(e) => updateFormData({ destinationState: e.target.value, destinationCity: '' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  data-testid="select-destination-state"
                >
                  <option value="">Select Destination State/Region</option>
                  <option value="IN-DL">Delhi</option>
                  <option value="IN-MH">Maharashtra (Mumbai, Pune)</option>
                  <option value="IN-KA">Karnataka (Bangalore)</option>
                  <option value="IN-TN">Tamil Nadu (Chennai)</option>
                  <option value="IN-WB">West Bengal (Kolkata)</option>
                  <option value="IN-AP">Andhra Pradesh (Hyderabad)</option>
                  <option value="IN-GJ">Gujarat (Ahmedabad)</option>
                  <option value="IN-RJ">Rajasthan (Jaipur)</option>
                  <option value="IN-KL">Kerala (Kochi)</option>
                  <option value="IN-PB">Punjab (Chandigarh)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure City</label>
                <select 
                  value={formData.originCity || ''} 
                  onChange={(e) => {
                    const updates: any = { originCity: e.target.value };
                    // Auto-calculate distance when both cities are selected
                    if (formData.destinationCity && e.target.value) {
                      const distances: { [key: string]: number } = {
                        'Mumbai-Delhi': 1400, 'Mumbai-Bangalore': 840, 'Mumbai-Chennai': 1030,
                        'Delhi-Mumbai': 1400, 'Delhi-Bangalore': 1740, 'Delhi-Chennai': 1760,
                        'Bangalore-Mumbai': 840, 'Bangalore-Delhi': 1740, 'Bangalore-Chennai': 290,
                        'Chennai-Mumbai': 1030, 'Chennai-Delhi': 1760, 'Chennai-Bangalore': 290,
                        'Mysore-Chennai': 480, 'Chennai-Mysore': 480, 'Mysore-Bangalore': 140
                      };
                      const key1 = `${e.target.value}-${formData.destinationCity}`;
                      const key2 = `${formData.destinationCity}-${e.target.value}`;
                      updates.distance = distances[key1] || distances[key2] || 500;
                    }
                    updateFormData(updates);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                  data-testid="select-origin-city"
                  disabled={!formData.originState}
                >
                  <option value="">{!formData.originState ? "First select departure state/region" : "Select Departure City"}</option>
                  {formData.originState === "IN-MH" && (
                    <>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Pune">Pune</option>
                    </>
                  )}
                  {formData.originState === "IN-DL" && (
                    <>
                      <option value="New Delhi">New Delhi</option>
                    </>
                  )}
                  {formData.originState === "IN-KA" && (
                    <>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Mysore">Mysore</option>
                    </>
                  )}
                  {formData.originState === "IN-TN" && (
                    <>
                      <option value="Chennai">Chennai</option>
                      <option value="Coimbatore">Coimbatore</option>
                    </>
                  )}
                  {formData.originState === "IN-AP" && (
                    <>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Vijayawada">Vijayawada</option>
                    </>
                  )}
                  {formData.originState === "IN-WB" && (
                    <>
                      <option value="Kolkata">Kolkata</option>
                    </>
                  )}
                  {formData.originState === "IN-GJ" && (
                    <>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Surat">Surat</option>
                      <option value="Vadodara">Vadodara</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arrival City (Exhibition Venue)</label>
                <select 
                  value={formData.destinationCity || ''} 
                  onChange={(e) => {
                    const updates: any = { destinationCity: e.target.value };
                    // Auto-calculate distance when both cities are selected
                    if (formData.originCity && e.target.value) {
                      const distances: { [key: string]: number } = {
                        'Mumbai-Delhi': 1400, 'Mumbai-Bangalore': 840, 'Mumbai-Chennai': 1030,
                        'Delhi-Mumbai': 1400, 'Delhi-Bangalore': 1740, 'Delhi-Chennai': 1760,
                        'Bangalore-Mumbai': 840, 'Bangalore-Delhi': 1740, 'Bangalore-Chennai': 290,
                        'Chennai-Mumbai': 1030, 'Chennai-Delhi': 1760, 'Chennai-Bangalore': 290,
                        'Mysore-Chennai': 480, 'Chennai-Mysore': 480, 'Mysore-Bangalore': 140
                      };
                      const key1 = `${formData.originCity}-${e.target.value}`;
                      const key2 = `${e.target.value}-${formData.originCity}`;
                      updates.distance = distances[key1] || distances[key2] || 500;
                    }
                    updateFormData(updates);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                  data-testid="select-destination-city"
                  disabled={!formData.destinationState}
                >
                  <option value="">{!formData.destinationState ? "First select arrival state/region" : "Select Arrival City"}</option>
                  {formData.destinationState === "IN-MH" && (
                    <>
                      <option value="Mumbai">Mumbai (Bombay Exhibition Centre)</option>
                      <option value="Pune">Pune</option>
                    </>
                  )}
                  {formData.destinationState === "IN-DL" && (
                    <>
                      <option value="New Delhi">New Delhi (Pragati Maidan)</option>
                    </>
                  )}
                  {formData.destinationState === "IN-KA" && (
                    <>
                      <option value="Bangalore">Bangalore (BIEC)</option>
                      <option value="Mysore">Mysore</option>
                    </>
                  )}
                  {formData.destinationState === "IN-TN" && (
                    <>
                      <option value="Chennai">Chennai (Trade Centre)</option>
                      <option value="Coimbatore">Coimbatore</option>
                    </>
                  )}
                  {formData.destinationState === "IN-AP" && (
                    <>
                      <option value="Hyderabad">Hyderabad (HITEX)</option>
                      <option value="Vijayawada">Vijayawada</option>
                    </>
                  )}
                  {formData.destinationState === "IN-WB" && (
                    <>
                      <option value="Kolkata">Kolkata</option>
                    </>
                  )}
                  {formData.destinationState === "IN-GJ" && (
                    <>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Surat">Surat</option>
                      <option value="Vadodara">Vadodara</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <select 
                  value={formData.eventType}
                  onChange={(e) => updateFormData({ eventType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  data-testid="select-event-type"
                >
                  <option value="trade">Trade Show</option>
                  <option value="consumer">Consumer Exhibition</option>
                  <option value="tech">Technology Conference</option>
                  <option value="medical">Medical/Healthcare</option>
                  <option value="food">Food & Beverage</option>
                  <option value="automotive">Automotive</option>
                  <option value="fashion">Fashion/Beauty</option>
                  <option value="industrial">Industrial/Manufacturing</option>
                </select>
              </div>
              <div></div>
            </div>
          </div>

          {/* Venue Information */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center space-x-2 mb-4">
              <Building className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Venue Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue Type</label>
                <select 
                  value={formData.venueType}
                  onChange={(e) => updateFormData({ venueType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  data-testid="select-venue-type"
                >
                  <option value="convention_center">Convention Center</option>
                  <option value="exhibition_hall">Exhibition Hall</option>
                  <option value="hotel_conference">Hotel Conference Center</option>
                  <option value="outdoor">Outdoor Venue</option>
                  <option value="corporate">Corporate Campus</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0" 
                    max="5000" 
                    value={formData.distance} 
                    onChange={(e) => updateFormData({ distance: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                    placeholder="500"
                    data-testid="input-distance"
                  />
                  {currentDistance > 0 && currentDistance !== formData.distance && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <button
                        onClick={() => updateFormData({ distance: currentDistance })}
                        className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
                      >
                        Auto: {currentDistance}km
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.originCity && formData.destinationCity 
                    ? `${formData.originCity} → ${formData.destinationCity}` 
                    : "Distance affects travel costs and logistics"}
                </p>
              </div>
            </div>
            
            {/* Enhanced Venue Information */}
            {formData.destinationCity && (
              <div className="mt-4 bg-white rounded-lg border border-green-200 p-4">
                <h4 className="font-medium text-gray-900 mb-3">📍 Venue Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Facility Features:</strong>
                    <ul className="text-gray-600 mt-1 space-y-1">
                      <li>• Air-conditioned halls</li>
                      <li>• Power backup facilities</li>
                      <li>• Parking for 500+ vehicles</li>
                      <li>• Food courts & restaurants</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Logistics Support:</strong>
                    <ul className="text-gray-600 mt-1 space-y-1">
                      <li>• Loading docks available</li>
                      <li>• Material handling equipment</li>
                      <li>• Storage facilities</li>
                      <li>• Security & surveillance</li>
                    </ul>
                  </div>
                </div>
                
                {/* Distance & Travel Info */}
                {formData.originCity && formData.destinationCity && formData.distance > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-blue-900">
                        Travel Distance: {formData.distance} km
                      </span>
                      <span className="text-blue-700">
                        Est. Flight Time: {Math.round(formData.distance / 600 * 60)} min
                      </span>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Route: {formData.originCity} ✈️ {formData.destinationCity}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      {/* Exhibition Schedule Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Exhibition Schedule</h3>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-purple-200 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exhibition Start Date *
              </label>
              <input
                type="date"
                value={formData.exhibitionStartDate || ''}
                onChange={(e) => updateFormData({ exhibitionStartDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                data-testid="input-exhibition-start-date"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exhibition End Date *
              </label>
              <input
                type="date"
                value={formData.exhibitionEndDate || ''}
                onChange={(e) => updateFormData({ exhibitionEndDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                data-testid="input-exhibition-end-date"
                required
              />
            </div>
          </div>
          
          {/* Duration Display */}
          {formData.exhibitionStartDate && formData.exhibitionEndDate && (
            <div className="mt-3 text-center">
              <span className="text-sm text-gray-600">Exhibition Duration: </span>
              <span className="font-semibold text-primary">
                {Math.ceil((new Date(formData.exhibitionEndDate).getTime() - new Date(formData.exhibitionStartDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Travel Schedule Section */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Your Travel Schedule</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Arrival Date</label>
            <input 
              type="date" 
              value={formData.arrivalDate || recommended.arrival} 
              onChange={(e) => updateFormData({ arrivalDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
              data-testid="input-arrival-date"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 1-2 days before exhibition start</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Departure Date</label>
            <input 
              type="date" 
              value={formData.departureDate || recommended.departure} 
              onChange={(e) => updateFormData({ departureDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
              data-testid="input-departure-date"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 1 day after exhibition end</p>
          </div>
        </div>

        {/* Stay Duration & Seasonal Info */}
        {stayDuration > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Stay Duration:</span>
                <span className="text-lg font-bold text-orange-600">
                  {stayDuration} {stayDuration === 1 ? 'night' : 'nights'}
                </span>
              </div>
            </div>

            {seasonalInfo.season && (
              <div className="p-3 bg-white rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                    <span>{seasonalInfo.icon}</span>
                    <span>{seasonalInfo.season}:</span>
                  </span>
                  <span className={`text-sm font-bold ${
                    seasonalInfo.modifier.includes('+') ? 'text-red-600' : 
                    seasonalInfo.modifier.includes('-') ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {seasonalInfo.modifier}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Auto-calculated stay duration</p>
              </div>
            )}
          </div>
        )}
      </div>


    </div>
  );
}
