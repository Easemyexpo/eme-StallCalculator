// Enhanced Exhibition Cost Calculator based on calc.js structure
// Provides detailed breakdown with rate-based calculations

const SQFT_PER_SQM = 10.7639;

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function toSqm(areaValue: number, unit: string): number {
  if (!areaValue || areaValue <= 0) throw new Error("areaValue must be > 0");
  if (unit === "sqm") return areaValue;
  if (unit === "sqft") return areaValue / SQFT_PER_SQM;
  throw new Error('areaUnit must be "sqm" or "sqft"');
}

function num(v: any): number {
  const n = Number(v || 0);
  if (!isFinite(n) || n < 0) return 0;
  return n;
}

function pct(v: any): number {
  if (!isFinite(v) || v <= 0) return 0;
  return v / 100;
}

function bool(v: any): boolean {
  return !!v;
}

function safeMul(a: number, b: number): number {
  if (!a || !b) return 0;
  return a * b;
}

function pick(flat: number, computed: number): number {
  // Prefer flat if provided (>0), else computed, else 0
  return flat > 0 ? flat : (computed > 0 ? computed : 0);
}

export interface CalculationInput {
  area: { value: number; unit: "sqm" | "sqft" };
  space?: {
    flat?: number;
    rate_per_sqm?: number;
    location_premium_pct?: number;
  };
  construction?: {
    flat?: number;
    rate_per_sqm?: number;
    finish_factor?: number;
  };
  utilities?: {
    power_kW?: number;
    power_rate?: number;
    internet?: number;
    water?: number;
    furniture?: number;
    other?: number;
  };
  logistics?: {
    flat?: number;
    weight_kg?: number;
    rate_per_kg?: number;
    cbm?: number;
    rate_per_cbm?: number;
    route_km?: number;
    rate_per_km?: number;
  };
  travel?: {
    team_count?: number;
    nights?: number;
    airfare_per_person?: number;
    hotel_adr?: number;
    local_transport_per_day?: number;
    meals_per_person_per_day?: number;
  };
  staff_ops?: {
    promoters?: number;
    promoter_days?: number;
    promoter_rate_per_day?: number;
    uniforms?: number;
    ops_misc?: number;
  };
  marketing?: {
    print?: number;
    giveaways?: number;
    digital?: number;
    av?: number;
    other?: number;
  };
  tax?: {
    gst_pct?: number;
    tax_space?: boolean;
    tax_construction?: boolean;
    tax_utilities?: boolean;
    tax_logistics?: boolean;
    tax_travel?: boolean;
    tax_staff_ops?: boolean;
    tax_marketing?: boolean;
  };
  contingency?: {
    pct?: number;
    apply_on?: "pre_tax" | "post_tax";
  };
}

export interface CalculationResult {
  area_sqm: number;
  area_sqft: number;
  breakdown: {
    space: number;
    construction: number;
    utilities: number;
    logistics: number;
    travel: number;
    staff_ops: number;
    marketing: number;
    subtotal: number;
    tax_total: number;
    contingency_total: number;
  };
  totals: {
    grand_total: number;
    cost_per_sqm: number;
    cost_per_sqft: number;
  };
}

export function calculateEnhancedCost(p: CalculationInput): CalculationResult {
  // 1) Normalize area
  const area_sqm = toSqm(p.area.value, p.area.unit);
  const area_sqft = area_sqm * SQFT_PER_SQM;

  // 2) SPACE (flat or rate)
  const space_flat = num(p.space?.flat);
  const space_from_rate =
    safeMul(num(p.space?.rate_per_sqm), area_sqm) *
    (1 + pct(num(p.space?.location_premium_pct)));
  const space = pick(space_flat, space_from_rate);

  // 3) CONSTRUCTION (flat or rate×area×finish)
  const cons_flat = num(p.construction?.flat);
  const finish_factor = p.construction?.finish_factor ? Math.max(0, p.construction.finish_factor) : 1;
  const cons_from_rate =
    safeMul(num(p.construction?.rate_per_sqm), area_sqm) * finish_factor;
  const construction = pick(cons_flat, cons_from_rate);

  // 4) UTILITIES
  const utilities =
    safeMul(num(p.utilities?.power_kW), num(p.utilities?.power_rate)) +
    num(p.utilities?.internet) +
    num(p.utilities?.water) +
    num(p.utilities?.furniture) +
    num(p.utilities?.other);

  // 5) LOGISTICS (flat or composed)
  const log_flat = num(p.logistics?.flat);
  const log_from_parts =
    safeMul(num(p.logistics?.weight_kg), num(p.logistics?.rate_per_kg)) +
    safeMul(num(p.logistics?.cbm), num(p.logistics?.rate_per_cbm)) +
    safeMul(num(p.logistics?.route_km), num(p.logistics?.rate_per_km));
  const logistics = pick(log_flat, log_from_parts);

  // 6) TRAVEL
  const team = Math.max(0, p.travel?.team_count || 0);
  const nights = Math.max(0, p.travel?.nights || 0);
  const airfare_pp = num(p.travel?.airfare_per_person);
  const adr = num(p.travel?.hotel_adr);
  const local_per_day = num(p.travel?.local_transport_per_day);
  const meals_per_day = num(p.travel?.meals_per_person_per_day);
  const travel =
    safeMul(team, airfare_pp) +
    safeMul(team, nights * (adr + local_per_day + meals_per_day));

  // 7) STAFF & OPS
  const promoters = Math.max(0, p.staff_ops?.promoters || 0);
  const promoter_days = Math.max(0, p.staff_ops?.promoter_days || 0);
  const promoter_rate = num(p.staff_ops?.promoter_rate_per_day);
  const uniforms = num(p.staff_ops?.uniforms);
  const ops_misc = num(p.staff_ops?.ops_misc);
  const staff_ops =
    safeMul(promoters, promoter_days * promoter_rate) + uniforms + ops_misc;

  // 8) MARKETING
  const marketing =
    num(p.marketing?.print) +
    num(p.marketing?.giveaways) +
    num(p.marketing?.digital) +
    num(p.marketing?.av) +
    num(p.marketing?.other);

  // 9) Subtotal before taxes/contingency
  const subtotal =
    space + construction + utilities + logistics + travel + staff_ops + marketing;

  // 10) TAX (GST) — choose what's taxable
  const gst_rate = pct(num(p.tax?.gst_pct ?? 18)); // Default 18% GST for India
  const taxableBuckets = {
    space: bool(p.tax?.tax_space ?? true),
    construction: bool(p.tax?.tax_construction ?? true),
    utilities: bool(p.tax?.tax_utilities ?? true),
    logistics: bool(p.tax?.tax_logistics ?? true),
    travel: bool(p.tax?.tax_travel ?? false), // Travel usually not taxed
    staff_ops: bool(p.tax?.tax_staff_ops ?? true),
    marketing: bool(p.tax?.tax_marketing ?? true),
  };
  const taxableAmount =
    (taxableBuckets.space ? space : 0) +
    (taxableBuckets.construction ? construction : 0) +
    (taxableBuckets.utilities ? utilities : 0) +
    (taxableBuckets.logistics ? logistics : 0) +
    (taxableBuckets.travel ? travel : 0) +
    (taxableBuckets.staff_ops ? staff_ops : 0) +
    (taxableBuckets.marketing ? marketing : 0);

  const tax_total = taxableAmount * gst_rate;

  // 11) Contingency (choose base: pre-tax or post-tax)
  const contingency_rate = pct(num(p.contingency?.pct ?? 10)); // Default 10% contingency
  const contingency_base =
    p.contingency?.apply_on === "post_tax" ? subtotal + tax_total : subtotal;
  const contingency_total = contingency_base * contingency_rate;

  // 12) Grand totals
  const grand_total = subtotal + tax_total + contingency_total;

  // 13) Per-area pricing
  const per_sqm = grand_total / area_sqm;
  const per_sqft = grand_total / area_sqft;

  return {
    area_sqm: round2(area_sqm),
    area_sqft: round2(area_sqft),
    breakdown: {
      space: round2(space),
      construction: round2(construction),
      utilities: round2(utilities),
      logistics: round2(logistics),
      travel: round2(travel),
      staff_ops: round2(staff_ops),
      marketing: round2(marketing),
      subtotal: round2(subtotal),
      tax_total: round2(tax_total),
      contingency_total: round2(contingency_total),
    },
    totals: {
      grand_total: round2(grand_total),
      cost_per_sqm: round2(per_sqm),
      cost_per_sqft: round2(per_sqft),
    },
  };
}

// Indian market specific rates and defaults
export const INDIAN_MARKET_RATES = {
  // City-specific booth rental rates (INR per sqm)
  space_rates: {
    'Mumbai': 4200,
    'Delhi': 3900, 
    'Bangalore': 3700,
    'Chennai': 3500,
    'Hyderabad': 3400,
    'Pune': 3200,
    'Ahmedabad': 3100,
    'Kolkata': 2900,
    'Jaipur': 2800,
    'Surat': 2700,
    'Indore': 2600,
    'Bhubaneswar': 2500
  },

  // Construction rates by booth type (INR per sqm)
  construction_rates: {
    'basic': 6000,      // Shell scheme
    'modular': 8000,    // Standard modular
    'custom': 12000,    // Custom builds
    'premium': 15000    // Premium finishes
  },

  // Location premiums by venue type (%)
  location_premiums: {
    'exhibition_hall': 0,
    'convention_center': 15,
    'hotel_venue': 25,
    'outdoor_venue': -15
  },

  // Flight rates by route (INR per person)
  flight_routes: {
    'Mumbai-Delhi': 4800,
    'Mumbai-Bangalore': 4200,
    'Mumbai-Chennai': 4500,
    'Delhi-Bangalore': 5400,
    'Delhi-Chennai': 5600,
    'Bangalore-Chennai': 3200
  },

  // Hotel ADR by city and class (INR per person per night)
  hotel_rates: {
    'Mumbai': { budget: 4200, business: 9500, luxury: 18000 },
    'Delhi': { budget: 3900, business: 8800, luxury: 16500 },
    'Bangalore': { budget: 3700, business: 8200, luxury: 15500 },
    'Chennai': { budget: 3500, business: 8000, luxury: 15000 }
  },

  // Staff and operational rates (INR)
  staff_rates: {
    promoter_per_day: 2500,
    setup_crew_per_day: 3500,
    security_per_day: 2000,
    coordinator_per_day: 4000
  },

  // Logistics rates (INR)
  logistics_rates: {
    per_kg: 25,           // Shipping rate per kg
    per_cbm: 800,         // Volume rate per cubic meter
    per_km: 15,           // Distance rate per km
    local_transport: 2000  // Local transport per day
  },

  // Utility rates (INR)
  utility_rates: {
    power_per_kw: 150,    // Power rate per kW
    internet: 15000,      // Internet connection
    furniture_per_sqm: 950, // Furniture per sqm
    av_per_sqm: 1450,     // AV equipment per sqm
    lighting_per_sqm: 720  // Lighting per sqm
  },

  // Marketing rates (INR)
  marketing_rates: {
    print_base: 15000,
    giveaways_base: 25000,
    digital_base: 20000,
    av_production: 35000
  }
};