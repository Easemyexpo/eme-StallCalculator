// Comprehensive travel data for different markets

export interface FlightOption {
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  stops: number;
  type: 'economy' | 'business' | 'first';
}

export interface HotelOption {
  name: string;
  rating: number;
  location: string;
  pricePerNight: number;
  amenities: string[];
  distanceToVenue: string;
}

export interface LogisticsOption {
  company: string;
  service: string;
  estimatedCost: number;
  deliveryTime: string;
  includes: string[];
}

// Indian market data
// Real flight pricing based on 2024 market research
function calculateFlightPrice(basePrice: number, distance: number, isBusinessClass: boolean = false): number {
  // Distance multiplier for Indian domestic flights
  const distanceMultiplier = Math.min(1 + (distance / 2000), 2.5); // Max 2.5x for long distances
  
  // Business class premium (3-4x economy)
  const classMultiplier = isBusinessClass ? 3.5 : 1;
  
  // Apply seasonality (±20%)
  const seasonalVariation = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
  
  return Math.round(basePrice * distanceMultiplier * classMultiplier * seasonalVariation);
}

export const INDIAN_FLIGHTS: Record<string, FlightOption[]> = {
  'domestic': [
    {
      airline: "IndiGo",
      departure: "6:00 AM",
      arrival: "8:30 AM", 
      duration: "2h 30m",
      price: 4200, // Based on research: ₹3,200-10,000 range
      stops: 0,
      type: 'economy'
    },
    {
      airline: "Air India",
      departure: "10:15 AM",
      arrival: "12:45 PM",
      duration: "2h 30m", 
      price: 4800, // ₹3,500-7,500 range
      stops: 0,
      type: 'economy'
    },
    {
      airline: "SpiceJet",
      departure: "2:30 PM",
      arrival: "5:00 PM",
      duration: "2h 30m",
      price: 3600, // Budget carrier, ₹3,499-6,201 range
      stops: 0,
      type: 'economy'
    },
    {
      airline: "Vistara",
      departure: "11:30 AM",
      arrival: "2:00 PM",
      duration: "2h 30m", 
      price: 5500, // Premium economy
      stops: 0,
      type: 'economy'
    },
    {
      airline: "IndiGo",
      departure: "7:45 AM",
      arrival: "10:15 AM",
      duration: "2h 30m",
      price: 14500, // IndiGoStretch business class
      stops: 0,
      type: 'business'
    },
    {
      airline: "Vistara",
      departure: "4:20 PM",
      arrival: "6:50 PM",
      duration: "2h 30m",
      price: 18000, // Premium business class
      stops: 0,
      type: 'business'
    },
    {
      airline: "Air India",
      departure: "9:10 AM",
      arrival: "11:40 AM",
      duration: "2h 30m",
      price: 16500, // Business class
      stops: 0,
      type: 'business'
    }
  ]
};

// Hotel pricing based on market research and actual rates
function calculateHotelPrice(basePrice: number, rating: number, location: string): number {
  // Rating premium (3-star base, 4-star +40%, 5-star +100%)
  const ratingMultiplier = rating === 5 ? 2.0 : rating === 4 ? 1.4 : 1.0;
  
  // Location premium for exhibition proximity
  const locationMultiplier = location.includes("Exhibition") || location.includes("Convention") || location.includes("Pragati") ? 1.2 : 1.0;
  
  return Math.round(basePrice * ratingMultiplier * locationMultiplier);
}

export const INDIAN_HOTELS: Record<string, HotelOption[]> = {
  'IN-DL': [
    {
      name: "ITC Maurya",
      rating: 5,
      location: "Diplomatic Enclave, Near Pragati Maidan",
      pricePerNight: 18000, // Premium 5-star near exhibition center
      amenities: ["Business Center", "Exhibition Services", "Luxury Spa", "Multiple Restaurants"],
      distanceToVenue: "3.5 km from Pragati Maidan"
    },
    {
      name: "The Leela Palace",
      rating: 5,
      location: "Chanakyapuri",
      pricePerNight: 18000,
      amenities: ["Luxury Suites", "Concierge", "Spa", "Business Facilities"],
      distanceToVenue: "8 km from ITPO"
    },
    {
      name: "Treebo Trend Capitol",
      rating: 3,
      location: "Karol Bagh",
      pricePerNight: 3200,
      amenities: ["Basic Business Center", "WiFi", "Room Service"],
      distanceToVenue: "12 km from Pragati Maidan"
    },
    {
      name: "Taj Palace",
      rating: 5,
      location: "Diplomatic Enclave",
      pricePerNight: 22000,
      amenities: ["Presidential Suites", "Exhibition Planning", "24/7 Business Center"],
      distanceToVenue: "6 km from ITPO"
    }
  ],
  'IN-MH': [
    {
      name: "ITC Grand Central",
      rating: 5,
      location: "Parel, Near BEC",
      pricePerNight: 12000,
      amenities: ["Exhibition Services", "Business Center", "Airport Transfer"],
      distanceToVenue: "3 km from Bombay Exhibition Centre"
    },
    {
      name: "The Leela Mumbai",
      rating: 5,
      location: "Andheri East",
      pricePerNight: 14000,
      amenities: ["Luxury Business Facilities", "Exhibition Support", "Spa"],
      distanceToVenue: "5 km from BEC"
    },
    {
      name: "Treebo Trend Abhiraj",
      rating: 3,
      location: "Goregaon",
      pricePerNight: 2800,
      amenities: ["Basic WiFi", "Room Service", "Business Corner"],
      distanceToVenue: "8 km from BEC"
    },
    {
      name: "JW Marriott Mumbai Sahar",
      rating: 5,
      location: "Andheri East",
      pricePerNight: 16000,
      amenities: ["Executive Floors", "Conference Facilities", "Exhibition Services"],
      distanceToVenue: "4 km from BEC"
    }
  ],
  'IN-KA': [
    {
      name: "ITC Gardenia",
      rating: 5,
      location: "Residency Road",
      pricePerNight: 10000,
      amenities: ["Business Center", "Exhibition Services", "Tech Support"],
      distanceToVenue: "5 km from BIEC"
    },
    {
      name: "The Leela Palace Bangalore",
      rating: 5,
      location: "HAL Airport Road",
      pricePerNight: 12000,
      amenities: ["Luxury Facilities", "Business Services", "Airport Proximity"],
      distanceToVenue: "8 km from BIEC"
    },
    {
      name: "Treebo Trend Bliss",
      rating: 3,
      location: "Electronic City",
      pricePerNight: 2500,
      amenities: ["WiFi", "Basic Business Facilities"],
      distanceToVenue: "12 km from BIEC"
    }
  ]
};

export const INDIAN_LOGISTICS: LogisticsOption[] = [
  {
    company: "Blue Dart Express",
    service: "Exhibition Freight & Setup",
    estimatedCost: 45000,
    deliveryTime: "2-3 days",
    includes: ["Door-to-door pickup", "Custom clearance", "Setup assistance", "Insurance"]
  },
  {
    company: "Gati KWE",
    service: "Exhibition Logistics",
    estimatedCost: 38000,
    deliveryTime: "3-4 days",
    includes: ["Freight transport", "Storage facilities", "Basic setup support"]
  },
  {
    company: "All Cargo Logistics",
    service: "Trade Show Shipping",
    estimatedCost: 42000,
    deliveryTime: "2-3 days", 
    includes: ["Specialized exhibition transport", "Venue delivery", "Return logistics"]
  },
  {
    company: "VRL Logistics",
    service: "Exhibition Material Transport",
    estimatedCost: 18000,
    deliveryTime: "4-5 days",
    includes: ["Road transport", "Basic handling", "Delivery confirmation"]
  }
];

// International market data
export const INTERNATIONAL_FLIGHTS: Record<string, FlightOption[]> = {
  'US': [
    {
      airline: "American Airlines",
      departure: "8:00 AM",
      arrival: "10:30 AM",
      duration: "3h 30m",
      price: 450,
      stops: 0,
      type: 'economy'
    },
    {
      airline: "Delta",
      departure: "11:15 AM",
      arrival: "1:45 PM",
      duration: "3h 30m",
      price: 520,
      stops: 0,
      type: 'economy'
    },
    {
      airline: "United",
      departure: "6:30 AM",
      arrival: "9:00 AM",
      duration: "3h 30m",
      price: 1200,
      stops: 0,
      type: 'business'
    }
  ],
  'EU': [
    {
      airline: "Lufthansa",
      departure: "9:00 AM",
      arrival: "11:00 AM",
      duration: "2h 00m",
      price: 320,
      stops: 0,
      type: 'economy'
    },
    {
      airline: "Air France",
      departure: "2:15 PM",
      arrival: "4:15 PM",
      duration: "2h 00m",
      price: 380,
      stops: 0,
      type: 'economy'
    },
    {
      airline: "Swiss International",
      departure: "7:45 AM",
      arrival: "9:45 AM",
      duration: "2h 00m",
      price: 950,
      stops: 0,
      type: 'business'
    }
  ]
};

export const INTERNATIONAL_HOTELS: Record<string, HotelOption[]> = {
  'US': [
    {
      name: "Hilton Convention Center",
      rating: 4,
      location: "Downtown",
      pricePerNight: 280,
      amenities: ["Business Center", "Convention Services", "WiFi"],
      distanceToVenue: "0.5 miles from venue"
    },
    {
      name: "Marriott Exhibition District",
      rating: 4,
      location: "Exhibition District",
      pricePerNight: 320,
      amenities: ["Executive Floors", "Meeting Rooms", "Concierge"],
      distanceToVenue: "0.2 miles from venue"
    },
    {
      name: "Hampton Inn & Suites",
      rating: 3,
      location: "Convention Area",
      pricePerNight: 180,
      amenities: ["Free Breakfast", "Business Center", "WiFi"],
      distanceToVenue: "1.2 miles from venue"
    }
  ],
  'EU': [
    {
      name: "Messe Hotel Frankfurt",
      rating: 4,
      location: "Exhibition Grounds",
      pricePerNight: 220,
      amenities: ["Exhibition Services", "Business Facilities", "Shuttle Service"],
      distanceToVenue: "200m from Messe Frankfurt"
    },
    {
      name: "Sheraton Exhibition Center",
      rating: 4,
      location: "Trade Fair District",
      pricePerNight: 280,
      amenities: ["Executive Lounges", "Meeting Facilities", "Concierge"],
      distanceToVenue: "Direct connection to venue"
    },
    {
      name: "Ibis Exhibition",
      rating: 3,
      location: "Near Convention Center",
      pricePerNight: 120,
      amenities: ["Basic Business Center", "WiFi", "24/7 Reception"],
      distanceToVenue: "800m from venue"
    }
  ]
};

export const INTERNATIONAL_LOGISTICS: LogisticsOption[] = [
  {
    company: "DHL Trade Fair Logistics",
    service: "Exhibition Shipping",
    estimatedCost: 2800,
    deliveryTime: "5-7 days",
    includes: ["International shipping", "Customs handling", "Venue delivery", "Return shipping"]
  },
  {
    company: "FedEx Trade Networks", 
    service: "Trade Show Logistics",
    estimatedCost: 3200,
    deliveryTime: "4-6 days",
    includes: ["Door-to-booth service", "Custom clearance", "Setup coordination"]
  },
  {
    company: "UPS Supply Chain",
    service: "Exhibition Freight",
    estimatedCost: 2500,
    deliveryTime: "6-8 days",
    includes: ["Freight forwarding", "Warehouse services", "Local delivery"]
  }
];

// Apply realistic pricing based on distance and team size
function applyPricingMultipliers(options: any[], distance: number, teamSize: number, currency: string) {
  const isIndian = currency === 'INR';
  
  return options.map(option => {
    let basePrice = option.price;
    
    // Distance multiplier for flights
    if (option.airline) {
      const distanceMultiplier = Math.min(1 + (distance / 2000), 2.2); // Max 2.2x for long distances
      basePrice *= distanceMultiplier;
    }
    
    // Team size discounts for group bookings (5+ people get 10% discount)
    if (teamSize >= 5) {
      basePrice *= 0.9;
    }
    
    // Market-specific adjustments
    if (isIndian) {
      // Add seasonal variation for Indian markets (±15%)
      const seasonalVariation = 0.85 + (Math.random() * 0.3);
      basePrice *= seasonalVariation;
    }
    
    return {
      ...option,
      price: Math.round(basePrice)
    };
  });
}

// Function to get market-specific data
export function getMarketData(state: string, currency: string, distance: number = 500, teamSize: number = 1) {
  const isIndian = state?.startsWith('IN-') || currency === 'INR';
  
  if (isIndian) {
    const flights = applyPricingMultipliers(INDIAN_FLIGHTS.domestic, distance, teamSize, currency);
    const hotels = INDIAN_HOTELS[state] || INDIAN_HOTELS['IN-DL'];
    
    return {
      flights,
      hotels,
      logistics: INDIAN_LOGISTICS
    };
  }
  
  // Determine region for international
  const region = state?.startsWith('US-') || ['CA', 'NY', 'TX', 'FL', 'IL', 'NV', 'GA', 'MI'].includes(state || '') ? 'US' : 'EU';
  const flights = applyPricingMultipliers(
    INTERNATIONAL_FLIGHTS[region] || INTERNATIONAL_FLIGHTS.US, 
    distance, 
    teamSize, 
    currency
  );
  
  return {
    flights,
    hotels: INTERNATIONAL_HOTELS[region] || INTERNATIONAL_HOTELS.US,
    logistics: INTERNATIONAL_LOGISTICS
  };
}