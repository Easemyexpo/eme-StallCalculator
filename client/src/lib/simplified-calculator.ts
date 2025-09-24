// Simplified cost calculation system with fixed rates
export interface SimplifiedCalculationParams {
  area_sqm: number;
  stall_fabrication_rate_per_sqm: number; // ₹8,000 - ₹20,000
  flight_cost: number;
  hotel_cost: number;
  marketing_cost: number;
  logistics_cost: number;
}

export interface SimplifiedCalculationResult {
  space_cost: number;
  stall_fabrication_cost: number;
  travel_hotel_cost: number;
  marketing_cost: number;
  logistics_cost: number;
  total_cost: number;
  breakdown: {
    space_cost: number;
    stall_fabrication_cost: number;
    travel_hotel: number;
    marketing: number;
    logistics: number;
  };
}

// Fixed rates as specified by user
const FIXED_RATES = {
  space_rate_per_sqm: 12000, // ₹12,000 per sqm
  stall_fabrication_rate_range: {
    min: 8000,  // ₹8,000 per sqm
    max: 20000  // ₹20,000 per sqm
  }
};

export function calculateSimplifiedCost(params: SimplifiedCalculationParams): SimplifiedCalculationResult {
  // Validate stall fabrication rate is within range
  const fabricationRate = Math.max(
    FIXED_RATES.stall_fabrication_rate_range.min,
    Math.min(FIXED_RATES.stall_fabrication_rate_range.max, params.stall_fabrication_rate_per_sqm)
  );

  // Calculate costs using formulas
  const space_cost = params.area_sqm * FIXED_RATES.space_rate_per_sqm;
  const stall_fabrication_cost = params.area_sqm * fabricationRate;
  const travel_hotel_cost = params.flight_cost + params.hotel_cost;
  
  const total_cost = space_cost + stall_fabrication_cost + travel_hotel_cost + params.marketing_cost + params.logistics_cost;

  return {
    space_cost,
    stall_fabrication_cost,
    travel_hotel_cost,
    marketing_cost: params.marketing_cost,
    logistics_cost: params.logistics_cost,
    total_cost,
    breakdown: {
      space_cost,
      stall_fabrication_cost,
      travel_hotel: travel_hotel_cost,
      marketing: params.marketing_cost,
      logistics: params.logistics_cost
    }
  };
}

// Helper function to calculate additional services costs
export function calculateAdditionalServicesCost(formData: any): number {
  let additionalCost = 0;
  
  const serviceCosts = {
    furniture: 25000,
    avEquipment: 18500,
    lighting: 12000,
    internet: 5500,
    storage: 8000,
    security: 15000
  };
  
  Object.keys(serviceCosts).forEach(service => {
    if (formData[service]) {
      additionalCost += (serviceCosts as any)[service];
    }
  });
  
  return additionalCost;
}

// Enhanced stall fabrication rate with detailed option pricing
export function calculateStallFabricationRate(stallDesignData: any): number {
  let baseRate = 8000; // Base ₹8,000 per sqm
  let additionalCosts = 0;

  // Wall type upgrades
  const wallUpgrades = {
    'basic': 0,
    'standard': 2000,   // +₹2k per sqm
    'premium': 5000,    // +₹5k per sqm
    'luxury': 8000,     // +₹8k per sqm
    'wooden': 6000,     // +₹6k per sqm
    'glass': 7000,      // +₹7k per sqm
    'fabric': 3000      // +₹3k per sqm
  };

  // Flooring upgrades
  const flooringUpgrades = {
    'carpet': 0,        // Base option
    'wooden': 850,      // +₹850 per sqm as specified
    'laminate': 600,    // +₹600 per sqm
    'vinyl': 400,       // +₹400 per sqm
    'marble': 1200,     // +₹1200 per sqm
    'granite': 1500,    // +₹1500 per sqm
    'ceramic': 500      // +₹500 per sqm
  };

  // Add wall type cost
  additionalCosts += (wallUpgrades as any)[stallDesignData.wallType?.toLowerCase()] || 0;
  
  // Add flooring cost
  additionalCosts += (flooringUpgrades as any)[stallDesignData.flooring?.toLowerCase()] || 0;

  // Lighting upgrades (per sqm cost based on type)
  const lightingCosts = {
    'basic': 0,
    'led': 300,         // +₹300 per sqm
    'premium': 600,     // +₹600 per sqm
    'designer': 1000,   // +₹1000 per sqm
    'smart': 1200       // +₹1200 per sqm
  };

  if (stallDesignData.lightingType && Array.isArray(stallDesignData.lightingType)) {
    stallDesignData.lightingType.forEach((lighting: string) => {
      additionalCosts += (lightingCosts as any)[lighting.toLowerCase()] || 0;
    });
  }

  // Digital displays (fixed cost per display, distributed per sqm)
  if (stallDesignData.digitalDisplays && Array.isArray(stallDesignData.digitalDisplays)) {
    const displayCost = stallDesignData.digitalDisplays.length * 15000; // ₹15k per display
    const costPerSqm = displayCost / (stallDesignData.area || 18); // Distribute across area
    additionalCosts += costPerSqm;
  }

  // Branding elements cost per sqm
  if (stallDesignData.brandingElements && Array.isArray(stallDesignData.brandingElements)) {
    const brandingCost = stallDesignData.brandingElements.length * 3000; // ₹3k per element
    const costPerSqm = brandingCost / (stallDesignData.area || 18);
    additionalCosts += costPerSqm;
  }

  // Furniture upgrades
  if (stallDesignData.furnitureItems && Array.isArray(stallDesignData.furnitureItems)) {
    const furnitureCost = stallDesignData.furnitureItems.length * 2500; // ₹2.5k per item
    const costPerSqm = furnitureCost / (stallDesignData.area || 18);
    additionalCosts += costPerSqm;
  }

  // Extra days installation cost
  if (stallDesignData.installationDays > 2) {
    const extraDaysCost = (stallDesignData.installationDays - 2) * 5000; // ₹5k per extra day
    const costPerSqm = extraDaysCost / (stallDesignData.area || 18);
    additionalCosts += costPerSqm;
  }

  return Math.min(20000, baseRate + additionalCosts); // Cap at ₹20k per sqm
}

// Helper function to get stall fabrication rate based on stall type (legacy support)
export function getStallFabricationRate(stallType: string): number {
  const rates = {
    'basic': 8000,      // ₹8,000 per sqm
    'standard': 12000,   // ₹12,000 per sqm  
    'premium': 16000,    // ₹16,000 per sqm
    'luxury': 20000      // ₹20,000 per sqm
  };
  
  return rates[stallType as keyof typeof rates] || rates.standard;
}

// Helper function to format currency (Indian Rupees only)
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}