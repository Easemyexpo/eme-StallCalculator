import { MARKET_MULTIPLIERS, CostBreakdown } from "@shared/schema";

// Re-export for convenience
export { CostBreakdown };
import { calculateCost, INDIAN_MARKET_DEFAULTS, type CalculationParams } from "@shared/exhibition-calculator";
import { calculateEnhancedCost, INDIAN_MARKET_RATES, type CalculationInput } from "@shared/enhanced-calculator";

// Distance calculation for travel costs
function calculateTravelDistance(originCity: string, originState: string, destinationCity: string, destinationState: string): number {
  // If same city, return minimal distance
  if (originCity === destinationCity && originState === destinationState) {
    return 50; // Local travel within city
  }

  // If same state/region but different cities
  if (originState === destinationState) {
    return 200; // Within state travel
  }

  // Inter-state/international distances (rough estimates in km)
  const distances: Record<string, Record<string, number>> = {
    // From Mumbai
    'Mumbai-IN-MH': {
      'New Delhi-IN-DL': 1400,
      'Bangalore-IN-KA': 980,
      'Chennai-IN-TN': 1340,
      'Hyderabad-IN-AP': 710,
      'Kolkata-IN-WB': 2000,
      'Ahmedabad-IN-GJ': 530,
      'Pune-IN-MH': 150,
    },
    // From Delhi
    'New Delhi-IN-DL': {
      'Mumbai-IN-MH': 1400,
      'Bangalore-IN-KA': 2200,
      'Chennai-IN-TN': 2180,
      'Hyderabad-IN-AP': 1570,
      'Kolkata-IN-WB': 1470,
      'Ahmedabad-IN-GJ': 960,
    },
    // From Bangalore
    'Bangalore-IN-KA': {
      'Mumbai-IN-MH': 980,
      'New Delhi-IN-DL': 2200,
      'Chennai-IN-TN': 350,
      'Hyderabad-IN-AP': 570,
      'Kolkata-IN-WB': 1870,
      'Ahmedabad-IN-GJ': 1490,
    }
  };

  const originKey = `${originCity}-${originState}`;
  const destinationKey = `${destinationCity}-${destinationState}`;

  // Check if we have specific distance data
  if (distances[originKey] && distances[originKey][destinationKey]) {
    return distances[originKey][destinationKey];
  }

  // Fallback estimates based on regions
  if (originState.startsWith('IN-') && destinationState.startsWith('IN-')) {
    return 800; // Average Indian inter-state distance
  }

  if (originState.startsWith('IN-') && !destinationState.startsWith('IN-')) {
    return 5000; // International travel from India
  }

  return 1000; // Default distance
}

export interface CalculatorInput {
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

// Type alias for FormData
export type FormData = CalculatorInput;

export function calculateCosts(input: CalculatorInput, state?: string): CostBreakdown {
  // Use enhanced calculator for more accurate pricing
  return calculateEnhancedCosts(input, state);
}

export function calculateEnhancedCosts(input: CalculatorInput, state?: string): CostBreakdown {
  // Determine if Indian location for accurate pricing
  const isIndianMarket = input.currency === 'INR' || input.marketLevel === 'india' || state?.startsWith('IN-') || input.destinationState?.startsWith('IN-');
  
  // Actual booth size (considering custom size) - ensure numeric
  const actualBoothSize = Number(input.customSize) || Number(input.boothSize) || 18;
  
  // Calculate actual stay duration from dates (if provided)
  let actualStayDuration = Number(input.eventDuration) || 3;
  if (input.arrivalDate && input.departureDate) {
    const arrivalTime = new Date(input.arrivalDate).getTime();
    const departureTime = new Date(input.departureDate).getTime();
    if (arrivalTime && departureTime && departureTime > arrivalTime) {
      actualStayDuration = Math.ceil((departureTime - arrivalTime) / (1000 * 60 * 60 * 24));
    }
  }

  // Create enhanced calculation input
  const enhancedInput: CalculationInput = {
    area: { value: actualBoothSize, unit: "sqm" },
    
    space: {
      rate_per_sqm: isIndianMarket 
        ? (INDIAN_MARKET_RATES.space_rates as any)[input.destinationCity] || INDIAN_MARKET_RATES.space_rates['Chennai']
        : 85, // International rate
      location_premium_pct: isIndianMarket 
        ? (INDIAN_MARKET_RATES.location_premiums as any)[input.venueType] || 0
        : 0
    },
    
    construction: {
      rate_per_sqm: isIndianMarket 
        ? (INDIAN_MARKET_RATES.construction_rates as any)[input.boothType] || INDIAN_MARKET_RATES.construction_rates['modular']
        : 180, // International rate
      finish_factor: input.boothType === 'premium' ? 1.2 : 
                    input.boothType === 'custom' ? 1.1 : 1.0
    },
    
    utilities: {
      power_kW: actualBoothSize * 0.5, // Estimate 0.5 kW per sqm
      power_rate: isIndianMarket ? INDIAN_MARKET_RATES.utility_rates.power_per_kw : 8,
      internet: input.internet ? (isIndianMarket ? INDIAN_MARKET_RATES.utility_rates.internet : 500) : 0,
      furniture: input.furniture ? actualBoothSize * (isIndianMarket ? INDIAN_MARKET_RATES.utility_rates.furniture_per_sqm : 50) : 0,
      other: (input.avEquipment ? actualBoothSize * (isIndianMarket ? INDIAN_MARKET_RATES.utility_rates.av_per_sqm : 60) : 0) +
             (input.lighting ? actualBoothSize * (isIndianMarket ? INDIAN_MARKET_RATES.utility_rates.lighting_per_sqm : 40) : 0) +
             (input.storage ? (isIndianMarket ? 9500 : 400) : 0) +
             (input.security ? actualStayDuration * (isIndianMarket ? 6200 : 250) : 0)
    },
    
    logistics: {
      weight_kg: actualBoothSize * 12, // Estimate 12kg per sqm
      rate_per_kg: isIndianMarket ? INDIAN_MARKET_RATES.logistics_rates.per_kg : 8,
      route_km: calculateTravelDistance(input.originCity, input.originState, input.destinationCity, input.destinationState),
      rate_per_km: isIndianMarket ? INDIAN_MARKET_RATES.logistics_rates.per_km : 3
    },
    
    travel: {
      team_count: Number(input.teamSize) || 4,
      nights: actualStayDuration,
      airfare_per_person: getFlightCost(input, isIndianMarket),
      hotel_adr: getHotelCost(input, isIndianMarket),
      local_transport_per_day: isIndianMarket ? INDIAN_MARKET_RATES.logistics_rates.local_transport : 80,
      meals_per_person_per_day: isIndianMarket ? 1500 : 60
    },
    
    staff_ops: {
      promoters: Math.max(1, Math.floor(actualBoothSize / 18)), // 1 promoter per 18 sqm
      promoter_days: actualStayDuration,
      promoter_rate_per_day: isIndianMarket ? INDIAN_MARKET_RATES.staff_rates.promoter_per_day : 100,
      uniforms: (Number(input.teamSize) || 4) * (isIndianMarket ? 2500 : 100),
      ops_misc: isIndianMarket ? 15000 : 600
    },
    
    marketing: {
      print: isIndianMarket ? INDIAN_MARKET_RATES.marketing_rates.print_base : 800,
      giveaways: isIndianMarket ? INDIAN_MARKET_RATES.marketing_rates.giveaways_base : 1200,
      digital: actualBoothSize > 50 ? (isIndianMarket ? INDIAN_MARKET_RATES.marketing_rates.digital_base : 1000) : 0,
      av: input.avEquipment ? (isIndianMarket ? INDIAN_MARKET_RATES.marketing_rates.av_production : 1500) : 0,
      other: actualBoothSize * (isIndianMarket ? 800 : 30)
    },
    
    tax: {
      gst_pct: isIndianMarket ? 18 : 0, // 18% GST in India
      tax_space: true,
      tax_construction: true,
      tax_utilities: true,
      tax_logistics: true,
      tax_travel: false, // Travel typically not taxed
      tax_staff_ops: true,
      tax_marketing: true
    },
    
    contingency: {
      pct: 10, // 10% contingency
      apply_on: "pre_tax"
    }
  };

  // Apply seasonal multiplier
  const seasonalMultiplier = getSeasonalMultiplier(input.eventStartDate);
  
  // Apply team size discounts for large groups
  const teamDiscount = getTeamDiscount(Number(input.teamSize) || 4);
  
  const result = calculateEnhancedCost(enhancedInput);
  
  // Apply multipliers
  const adjustedTotal = result.totals.grand_total * seasonalMultiplier * teamDiscount;
  
  return {
    boothCost: Math.round(result.breakdown.space),
    constructionCost: Math.round(result.breakdown.construction),
    travelCost: Math.round(result.breakdown.travel),
    staffCost: Math.round(result.breakdown.staff_ops),
    marketingCost: Math.round(result.breakdown.marketing),
    logisticsCost: Math.round(result.breakdown.logistics),
    servicesCost: Math.round(result.breakdown.utilities),
    total: Math.round(adjustedTotal),
    currency: input.currency || 'INR'
  };
}

function getFlightCost(input: CalculatorInput, isIndianMarket: boolean): number {
  if (!isIndianMarket) {
    return 450; // International default
  }
  
  const routeKey = `${input.originCity}-${input.destinationCity}`;
  const reverseRouteKey = `${input.destinationCity}-${input.originCity}`;
  
  let baseCost = (INDIAN_MARKET_RATES.flight_routes as any)[routeKey] || 
                (INDIAN_MARKET_RATES.flight_routes as any)[reverseRouteKey] || 
                4500; // Default domestic rate
  
  // Apply class multipliers
  if (input.accommodationLevel === 'luxury') {
    baseCost *= 3.2; // Business class
  } else if (input.accommodationLevel === 'business') {
    baseCost *= 1.4; // Premium economy
  }
  
  return baseCost;
}

function getHotelCost(input: CalculatorInput, isIndianMarket: boolean): number {
  if (!isIndianMarket) {
    return input.accommodationLevel === 'luxury' ? 320 : 
           input.accommodationLevel === 'business' ? 190 : 110;
  }
  
  const cityRates = (INDIAN_MARKET_RATES.hotel_rates as any)[input.destinationCity] || 
                   INDIAN_MARKET_RATES.hotel_rates['Chennai'];
  
  if (input.accommodationLevel === 'luxury') {
    return cityRates.luxury;
  } else if (input.accommodationLevel === 'business') {
    return cityRates.business;
  } else {
    return cityRates.budget;
  }
}

function getSeasonalMultiplier(eventStartDate?: string): number {
  if (!eventStartDate) return 1.0;
  
  const eventDate = new Date(eventStartDate);
  const month = eventDate.getMonth() + 1;
  
  // Peak exhibition seasons in India: Oct-Mar
  if (month >= 10 || month <= 3) {
    return 1.12; // 12% premium for peak season
  } else if (month >= 4 && month <= 6) {
    return 0.94; // 6% discount for summer months
  }
  return 0.97; // Slight discount for monsoon months
}

function getTeamDiscount(teamSize: number): number {
  if (teamSize >= 10) return 0.92; // 8% discount for 10+ people
  if (teamSize >= 6) return 0.95;  // 5% discount for 6-9 people
  if (teamSize >= 4) return 0.98;  // 2% discount for 4-5 people
  return 1.0; // No discount for smaller teams
}

// Legacy function - keeping for backward compatibility but redirecting to enhanced version  
export function calculateCostsLegacy(input: CalculatorInput, state?: string): CostBreakdown {
  return calculateEnhancedCosts(input, state);
}
