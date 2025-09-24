// Test file to validate calculation logic against user feedback
// User validation: 18sqm booth with ₹502k total cost
// Breakdown: Space ₹63k (₹3,500/sqm), Construction ₹270k (₹15,000/sqm), Travel ₹114k, Staff ₹30k, Marketing ₹25k

const { calculateCost } = require("./shared/exhibition-calculator");

// Example A: User's exact numbers validation
const userValidation = calculateCost({
  area: { value: 18, unit: "sqm" },
  space: { flat: 63000 }, // ₹63k total space cost
  construction: { flat: 270000 }, // ₹270k construction cost
  utilities: {}, // 0
  logistics: {}, // 0
  travel: { team_count: 0 }, // We'll use staff_ops for flat ₹114k
  staff_ops: { ops_misc: 144000 }, // ₹114k travel + ₹30k staff = ₹144k
  marketing: { other: 25000 }, // ₹25k marketing
  tax: { gst_pct: 0 }, // Pre-tax validation
  contingency: { pct: 0 } // No contingency for exact match
});

console.log("=== USER VALIDATION TEST ===");
console.log("Expected total: ₹502,000");
console.log("Calculated total:", userValidation.grand_total);
console.log("Match:", userValidation.grand_total === 502000 ? "✅ EXACT MATCH" : "❌ Needs adjustment");
console.log("Space per sqm:", Math.round(userValidation.space / 18), "(Expected: ₹3,500)");
console.log("Construction per sqm:", Math.round(userValidation.construction / 18), "(Expected: ₹15,000)");

// Example B: Rate-based realistic calculation with Indian market defaults
const rateBasedCalc = calculateCost({
  area: { value: 18, unit: "sqm" },
  space: {
    rate_per_sqm: 3500, // User validated rate
    location_premium_pct: 0
  },
  construction: {
    rate_per_sqm: 15000, // User validated premium rate
    finish_factor: 1.0
  },
  utilities: {
    power_kW: 5,
    power_rate: 4500,
    internet: 12000,
    furniture: 18000
  },
  logistics: {
    weight_kg: 180, // 18sqm * 10kg/sqm
    rate_per_kg: 25
  },
  travel: {
    team_count: 4,
    nights: 3,
    airfare_per_person: 18000, // User validated ₹18k/person domestic
    hotel_adr: 8000, // Business hotels
    local_transport_per_day: 1000,
    meals_per_person_per_day: 800
  },
  staff_ops: {
    promoters: 2,
    promoter_days: 3,
    promoter_rate_per_day: 2000,
    uniforms: 8000,
    ops_misc: 16000
  },
  marketing: {
    print: 15000,
    giveaways: 10000,
    av: 0
  },
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
  contingency: { pct: 5, apply_on: "post_tax" }
});

console.log("\n=== RATE-BASED CALCULATION ===");
console.log("Space cost:", rateBasedCalc.space, `(${Math.round(rateBasedCalc.space/18)}/sqm)`);
console.log("Construction:", rateBasedCalc.construction, `(${Math.round(rateBasedCalc.construction/18)}/sqm)`);
console.log("Travel:", rateBasedCalc.travel);
console.log("Staff ops:", rateBasedCalc.staff_ops);
console.log("Marketing:", rateBasedCalc.marketing);
console.log("Utilities:", rateBasedCalc.utilities);
console.log("Logistics:", rateBasedCalc.logistics);
console.log("Subtotal:", rateBasedCalc.subtotal);
console.log("Tax (18% GST):", rateBasedCalc.tax);
console.log("Contingency (5%):", rateBasedCalc.contingency);
console.log("GRAND TOTAL:", rateBasedCalc.grand_total);
console.log("Cost per sqm:", Math.round(rateBasedCalc.per_sqm));

// Example C: Verification that travel cost matches user's ₹114k for 4 staff, 3-4 days
const travelTest = calculateCost({
  area: { value: 1, unit: "sqm" }, // Minimal area for travel-only test
  space: { flat: 0 },
  construction: { flat: 0 },
  utilities: {},
  logistics: {},
  travel: {
    team_count: 4,
    nights: 3,
    airfare_per_person: 18000, // ₹18k * 4 = ₹72k
    hotel_adr: 8000, // ₹8k * 3 nights * 4 people = ₹96k
    local_transport_per_day: 1000, // ₹1k * 3 days * 4 = ₹12k  
    meals_per_person_per_day: 800 // ₹800 * 3 days * 4 = ₹9.6k
  },
  staff_ops: {},
  marketing: {},
  tax: { gst_pct: 0 },
  contingency: { pct: 0 }
});

console.log("\n=== TRAVEL COST VALIDATION ===");
console.log("Expected travel: ₹114,000 (user validated)");
console.log("Calculated travel:", travelTest.travel);
console.log("Breakdown:");
console.log("- Flights: ₹72,000 (₹18k × 4 people)");
console.log("- Hotels: ₹96,000 (₹8k × 3 nights × 4 people)");
console.log("- Transport: ₹12,000 (₹1k × 3 days × 4 people)");
console.log("- Meals: ₹9,600 (₹800 × 3 days × 4 people)");
console.log("- Total calculated:", travelTest.travel, "vs Expected: 114,000");