// Enhanced stall design cost calculator with per-sqm pricing and budget allocation integration
export interface BudgetAllocation {
  booth_construction?: number;
  marketing_materials?: number;
  staff_operations?: number;
  travel_accommodation?: number;
  technology_av?: number;
}

export interface StallCostBreakdown {
  structuralCosts: {
    wallCost: number;
    flooringCost: number;
    ceilingCost: number;
    additionalRoomsCost: number;
  };
  brandingCosts: {
    printAreaCost: number;
    brandingElementsCost: number;
    digitalDisplaysCost: number;
  };
  furnitureCosts: {
    rentalCost: number;
    customBuildCost: number;
  };
  technicalCosts: {
    lightingCost: number;
    powerCost: number;
  };
  laborCosts: {
    installationCost: number;
    dismantlingCost: number;
    outstationCharges: number;
  };
  extrasCost: number;
  totalCost: number;
}

// Cost rates per square meter
const COST_RATES = {
  walls: {
    octonorm: 8500,
    mdf: 6000,
    laminated_plywood: 12000,
    modular_aluminum: 15000
  },
  flooring: {
    carpeting: 450,
    raised_wooden: 850,
    vinyl_finish: 650,
    laminate: 500,
    marble: 1200,
    ceramic: 400
  },
  ceiling: {
    open: 0,
    truss_lights: 2500,
    branding_fascia: 4500
  },
  additionalRooms: {
    'Storage Room': 25000,
    'Meeting Room': 45000,
    'Pantry': 35000,
    'Reception Area': 30000
  },
  branding: {
    flex_prints: 180, // per sqm
    vinyl_graphics: 250,
    fabric_prints: 320,
    '3d_logos': 8500, // per piece
    backlit_panels: 1300, // per sqft -> ₹1200/sqft ~ ₹13000/sqm
    led_walls: 45000 // per sqm
  },
  furniture: {
    rental: {
      reception_counter: 2500,
      meeting_table: 1200,
      chairs: 200,
      display_shelves: 800,
      storage_cabinets: 1500,
      product_display: 2000,
      brochure_stands: 500,
      demo_counter: 3000
    },
    custom: {
      reception_counter: 15000,
      meeting_table: 8500,
      chairs: 2500,
      display_shelves: 12000,
      storage_cabinets: 18000,
      product_display: 25000,
      brochure_stands: 4500,
      demo_counter: 35000
    }
  },
  lighting: {
    spot_lights: 1200, // per piece
    led_strips: 850, // per meter
    track_lighting: 2500, // per meter
    pendant_lights: 1800, // per piece
    ambient_lighting: 3500 // per sqm
  },
  power: {
    '1_phase': 800, // per KW
    '3_phase': 1200 // per KW
  },
  labor: {
    installation: 450, // per sqm per day
    dismantling: 250, // per sqm per day
    outstationMultiplier: 1.5
  }
};

export function calculateStallCosts(data: any, budgetAllocation?: BudgetAllocation): StallCostBreakdown {
  const area = data.area || 0;
  const printArea = data.printArea || 0;
  
  // Convert sqft to sqm if needed
  const areaInSqm = data.areaUnit === 'sqft' ? area * 0.092903 : area;
  const printAreaInSqm = data.areaUnit === 'sqft' ? printArea * 0.092903 : printArea;

  // Structural Costs
  const wallCost = COST_RATES.walls[data.wallType as keyof typeof COST_RATES.walls] * areaInSqm || 0;
  const flooringCost = COST_RATES.flooring[data.flooring as keyof typeof COST_RATES.flooring] * areaInSqm || 0;
  const ceilingCost = COST_RATES.ceiling[data.ceiling as keyof typeof COST_RATES.ceiling] * areaInSqm || 0;
  
  const additionalRoomsCost = (data.additionalRooms || []).reduce((total: number, room: string) => {
    return total + (COST_RATES.additionalRooms[room as keyof typeof COST_RATES.additionalRooms] || 0);
  }, 0);

  // Branding Costs
  const printAreaCost = printAreaInSqm * 180; // Base printing cost per sqm
  
  const brandingElementsCost = (data.brandingElements || []).reduce((total: number, element: string) => {
    const rate = COST_RATES.branding[element as keyof typeof COST_RATES.branding] || 0;
    
    // Per-piece items vs per-sqm items
    if (['3d_logos'].includes(element)) {
      return total + rate; // Fixed cost per piece
    } else if (['led_walls', 'backlit_panels'].includes(element)) {
      return total + (rate * printAreaInSqm); // Cost per sqm of print area
    } else {
      return total + (rate * printAreaInSqm); // Other graphics per print area
    }
  }, 0);

  const digitalDisplaysCost = (data.digitalDisplays || []).reduce((total: number, display: string) => {
    // Digital displays would have specific costs based on size/type
    return total + 25000; // Base cost per display
  }, 0);

  // Furniture Costs
  const furnitureType = data.furnitureType || 'rental';
  const furnitureItems = data.furnitureItems || [];
  
  const furnitureCost = furnitureItems.reduce((total: number, item: string) => {
    const rates = COST_RATES.furniture[furnitureType as keyof typeof COST_RATES.furniture];
    return total + (rates[item as keyof typeof rates] || 0);
  }, 0);

  // Technical Costs
  const lightingCost = (data.lightingType || []).reduce((total: number, lighting: string) => {
    const rate = COST_RATES.lighting[lighting as keyof typeof COST_RATES.lighting] || 0;
    
    if (['ambient_lighting'].includes(lighting)) {
      return total + (rate * areaInSqm); // Per sqm lighting
    } else if (['led_strips', 'track_lighting'].includes(lighting)) {
      return total + (rate * 10); // Assume 10 meters average
    } else {
      return total + (rate * 4); // Assume 4 pieces average
    }
  }, 0);

  const powerRequirement = data.powerRequirement || 5; // Default 5KW
  const powerRate = COST_RATES.power[data.powerType as keyof typeof COST_RATES.power] || COST_RATES.power['1_phase'];
  const powerCost = powerRequirement * powerRate;

  // Labor Costs
  const installationDays = data.installationDays || 3;
  const dismantlingDays = data.dismantlingDays || 1;
  const isOutstation = data.isOutstation || false;
  
  const installationCost = areaInSqm * COST_RATES.labor.installation * installationDays;
  const dismantlingCost = areaInSqm * COST_RATES.labor.dismantling * dismantlingDays;
  const outstationCharges = isOutstation ? (installationCost + dismantlingCost) * (COST_RATES.labor.outstationMultiplier - 1) : 0;

  // Extras Cost
  let extrasCost = (data.extras || []).length * 5000; // ₹5000 per extra item

  // Position multipliers
  const positionMultiplier = data.boothPosition === 'corner' ? 1.1 : data.boothPosition === 'island' ? 1.25 : 1.0;

  const structuralCosts = {
    wallCost: Math.round(wallCost * positionMultiplier),
    flooringCost: Math.round(flooringCost),
    ceilingCost: Math.round(ceilingCost),
    additionalRoomsCost: Math.round(additionalRoomsCost)
  };

  const brandingCosts = {
    printAreaCost: Math.round(printAreaCost),
    brandingElementsCost: Math.round(brandingElementsCost),
    digitalDisplaysCost: Math.round(digitalDisplaysCost)
  };

  const furnitureCosts = {
    rentalCost: furnitureType === 'rental' ? Math.round(furnitureCost) : 0,
    customBuildCost: furnitureType === 'custom_build' ? Math.round(furnitureCost) : 0
  };

  const technicalCosts = {
    lightingCost: Math.round(lightingCost),
    powerCost: Math.round(powerCost)
  };

  const laborCosts = {
    installationCost: Math.round(installationCost),
    dismantlingCost: Math.round(dismantlingCost),
    outstationCharges: Math.round(outstationCharges)
  };

  // Calculate initial total cost - ENSURE ALL ELEMENTS ARE INCLUDED
  let totalCost = Math.round(
    structuralCosts.wallCost +
    structuralCosts.flooringCost +
    structuralCosts.ceilingCost +
    structuralCosts.additionalRoomsCost +
    brandingCosts.printAreaCost +
    brandingCosts.brandingElementsCost +
    brandingCosts.digitalDisplaysCost +
    furnitureCosts.rentalCost +
    furnitureCosts.customBuildCost +
    technicalCosts.lightingCost +
    technicalCosts.powerCost +
    laborCosts.installationCost +
    laborCosts.dismantlingCost +
    laborCosts.outstationCharges +
    extrasCost // This ensures extras are properly counted
  );

  // Debug log to verify all calculations are included
  console.log('Stall Calculator Debug:', {
    structuralTotal: structuralCosts.wallCost + structuralCosts.flooringCost + structuralCosts.ceilingCost + structuralCosts.additionalRoomsCost,
    brandingTotal: brandingCosts.printAreaCost + brandingCosts.brandingElementsCost + brandingCosts.digitalDisplaysCost,
    furnitureTotal: furnitureCosts.rentalCost + furnitureCosts.customBuildCost,
    technicalTotal: technicalCosts.lightingCost + technicalCosts.powerCost,
    laborTotal: laborCosts.installationCost + laborCosts.dismantlingCost + laborCosts.outstationCharges,
    extrasCost,
    finalTotal: totalCost,
    additionalRoomsArray: data.additionalRooms,
    brandingElementsArray: data.brandingElements,
    extrasArray: data.extras
  });



  return {
    structuralCosts,
    brandingCosts,
    furnitureCosts,
    technicalCosts,
    laborCosts,
    extrasCost: Math.round(extrasCost),
    totalCost
  };
}