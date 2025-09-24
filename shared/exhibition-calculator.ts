// Enhanced Exhibition Cost Calculator with Rate-Based Logic
// Based on validated Indian market pricing feedback

export interface CalculationParams {
  area: { value: number; unit: "sqm" | "sqft" };
  space: {
    flat?: number;
    rate_per_sqm?: number;
    location_premium_pct?: number;
  };
  construction: {
    flat?: number;
    rate_per_sqm?: number;
    finish_factor?: number;
  };
  utilities: {
    power_kW?: number;
    power_rate?: number;
    internet?: number;
    furniture?: number;
  };
  logistics: {
    weight_kg?: number;
    rate_per_kg?: number;
  };
  travel: {
    team_count?: number;
    nights?: number;
    airfare_per_person?: number;
    hotel_adr?: number;
    local_transport_per_day?: number;
    meals_per_person_per_day?: number;
  };
  staff_ops: {
    promoters?: number;
    promoter_days?: number;
    promoter_rate_per_day?: number;
    uniforms?: number;
    ops_misc?: number;
  };
  marketing: {
    print?: number;
    giveaways?: number;
    av?: number;
    other?: number;
  };
  tax: {
    gst_pct?: number;
    tax_space?: boolean;
    tax_construction?: boolean;
    tax_utilities?: boolean;
    tax_logistics?: boolean;
    tax_travel?: boolean;
    tax_staff_ops?: boolean;
    tax_marketing?: boolean;
  };
  contingency: {
    pct?: number;
    apply_on?: "pre_tax" | "post_tax";
  };
}

export interface CalculationResult {
  space: number;
  construction: number;
  utilities: number;
  logistics: number;
  travel: number;
  staff_ops: number;
  marketing: number;
  subtotal: number;
  tax: number;
  contingency: number;
  grand_total: number;
  per_sqm: number;
  per_sqft: number;
  breakdown: {
    [key: string]: number;
  };
}

export function calculateCost(params: CalculationParams): CalculationResult {
  // Convert area to sqm for calculations
  const areaSqm = params.area.unit === "sqft" 
    ? params.area.value * 0.092903 
    : params.area.value;
  
  const areaSqft = params.area.unit === "sqm" 
    ? params.area.value * 10.764 
    : params.area.value;

  // Space costs (booth rental)
  let space = 0;
  if (params.space.flat) {
    space = params.space.flat;
  } else if (params.space.rate_per_sqm) {
    space = areaSqm * params.space.rate_per_sqm;
    if (params.space.location_premium_pct) {
      space *= (1 + params.space.location_premium_pct / 100);
    }
  }

  // Construction costs
  let construction = 0;
  if (params.construction.flat) {
    construction = params.construction.flat;
  } else if (params.construction.rate_per_sqm) {
    construction = areaSqm * params.construction.rate_per_sqm;
    if (params.construction.finish_factor) {
      construction *= params.construction.finish_factor;
    }
  }

  // Utilities
  const utilities = (params.utilities.power_kW || 0) * (params.utilities.power_rate || 0) +
                   (params.utilities.internet || 0) +
                   (params.utilities.furniture || 0);

  // Logistics
  const logistics = (params.logistics.weight_kg || 0) * (params.logistics.rate_per_kg || 0);

  // Travel
  const teamCount = params.travel.team_count || 0;
  const nights = params.travel.nights || 0;
  const travel = teamCount * (
    (params.travel.airfare_per_person || 0) +
    (nights * (params.travel.hotel_adr || 0)) +
    (nights * (params.travel.local_transport_per_day || 0)) +
    (nights * (params.travel.meals_per_person_per_day || 0))
  );

  // Staff & Operations
  const promoterCost = (params.staff_ops.promoters || 0) * 
                      (params.staff_ops.promoter_days || 0) * 
                      (params.staff_ops.promoter_rate_per_day || 0);
  const staff_ops = promoterCost + 
                   (params.staff_ops.uniforms || 0) + 
                   (params.staff_ops.ops_misc || 0);

  // Marketing
  const marketing = (params.marketing.print || 0) +
                   (params.marketing.giveaways || 0) +
                   (params.marketing.av || 0) +
                   (params.marketing.other || 0);

  // Subtotal
  const subtotal = space + construction + utilities + logistics + travel + staff_ops + marketing;

  // Tax calculation
  let tax = 0;
  const gstRate = (params.tax.gst_pct || 0) / 100;
  
  if (gstRate > 0) {
    if (params.tax.tax_space) tax += space * gstRate;
    if (params.tax.tax_construction) tax += construction * gstRate;
    if (params.tax.tax_utilities) tax += utilities * gstRate;
    if (params.tax.tax_logistics) tax += logistics * gstRate;
    if (params.tax.tax_travel) tax += travel * gstRate;
    if (params.tax.tax_staff_ops) tax += staff_ops * gstRate;
    if (params.tax.tax_marketing) tax += marketing * gstRate;
  }

  // Contingency
  let contingency = 0;
  const contingencyRate = (params.contingency.pct || 0) / 100;
  
  if (contingencyRate > 0) {
    const baseAmount = params.contingency.apply_on === "post_tax" 
      ? subtotal + tax 
      : subtotal;
    contingency = baseAmount * contingencyRate;
  }

  const grand_total = subtotal + tax + contingency;

  return {
    space,
    construction,
    utilities,
    logistics,
    travel,
    staff_ops,
    marketing,
    subtotal,
    tax,
    contingency,
    grand_total,
    per_sqm: grand_total / areaSqm,
    per_sqft: grand_total / areaSqft,
    breakdown: {
      space_per_sqm: space / areaSqm,
      construction_per_sqm: construction / areaSqm,
      utilities_per_sqm: utilities / areaSqm,
      logistics_per_sqm: logistics / areaSqm,
      travel_per_sqm: travel / areaSqm,
      staff_ops_per_sqm: staff_ops / areaSqm,
      marketing_per_sqm: marketing / areaSqm,
    }
  };
}

// Indian Market Defaults based on user validation
export const INDIAN_MARKET_DEFAULTS = {
  // Booth rental: ₹3,500/sqm (validated as accurate)
  space: {
    rate_per_sqm: 3500,
    location_premium_pct: 0
  },
  
  // Construction: ₹15,000/sqm for premium custom work (validated)
  construction: {
    rate_per_sqm: 15000,
    finish_factor: 1.0
  },
  
  // Utilities (power, internet, furniture)
  utilities: {
    power_kW: 5,
    power_rate: 4500,
    internet: 12000,
    furniture: 18000
  },
  
  // Logistics (material transport)
  logistics: {
    weight_kg: 200,
    rate_per_kg: 25
  },
  
  // Travel validated as ₹114k for 4-5 staff for 3-4 days
  travel: {
    team_count: 4,
    nights: 3,
    airfare_per_person: 18000, // IndiGo/Vistara domestic
    hotel_adr: 8000, // Business class hotels
    local_transport_per_day: 1000,
    meals_per_person_per_day: 800
  },
  
  // Staff ops: ₹30k for local hiring/temp staff (validated)
  staff_ops: {
    promoters: 2,
    promoter_days: 3,
    promoter_rate_per_day: 2000,
    uniforms: 8000,
    ops_misc: 16000
  },
  
  // Marketing: ₹25k for basic brochures & giveaways (validated)
  marketing: {
    print: 15000,
    giveaways: 10000,
    av: 0, // Basic package doesn't include heavy AV
    other: 0
  },
  
  // Indian GST
  tax: {
    gst_pct: 18,
    tax_space: true,
    tax_construction: true,
    tax_utilities: true,
    tax_logistics: true,
    tax_travel: false,
    tax_staff_ops: true,
    tax_marketing: true
  },
  
  // Standard contingency
  contingency: {
    pct: 5,
    apply_on: "post_tax" as const
  }
};