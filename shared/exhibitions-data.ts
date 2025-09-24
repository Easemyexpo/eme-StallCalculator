// Real exhibition and trade show data for Indian markets
export interface Exhibition {
  id: string;
  name: string;
  industry: string[];
  venue: string;
  city: string;
  state: string;
  country: string;
  organizer: string;
  website?: string;
  frequency: 'Annual' | 'Biennial' | 'Quarterly';
  expectedVisitors: string;
  exhibitorCount: string;
  stallPricing: {
    shellScheme: string;
    rawSpace: string;
  };
  dates: {
    year: number;
    startDate: string;
    endDate: string;
  }[];
  description: string;
  keyFeatures: string[];
  targetAudience: string[];
  pastExhibitors?: string[];
}

export const INDIAN_EXHIBITIONS: Exhibition[] = [
  // Technology & IT
  {
    id: "india-mobile-congress",
    name: "India Mobile Congress",
    industry: ["Technology", "Telecommunications", "Electronics"],
    venue: "Pragati Maidan",
    city: "New Delhi",
    state: "IN-DL",
    country: "India",
    organizer: "Cellular Operators Association of India (COAI)",
    website: "https://indiamobilecongress.com",
    frequency: "Annual",
    expectedVisitors: "50,000+",
    exhibitorCount: "300+",
    stallPricing: {
      shellScheme: "₹4,500-6,000/sqm",
      rawSpace: "₹3,200-4,800/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-10-15", endDate: "2025-10-17" },
      { year: 2024, startDate: "2024-10-14", endDate: "2024-10-16" }
    ],
    description: "Asia's largest telecom, media & technology forum bringing together global leaders, policymakers, and innovators.",
    keyFeatures: [
      "5G Technology Showcase",
      "Digital India Summit",
      "Startup Pavilion",
      "Policy Roundtables"
    ],
    targetAudience: [
      "Telecom operators",
      "Technology companies",
      "Government officials",
      "Investors"
    ],
    pastExhibitors: ["Reliance Jio", "Bharti Airtel", "Vodafone Idea", "Nokia", "Ericsson"]
  },

  // Healthcare
  {
    id: "medical-fair-india",
    name: "Medical Fair India",
    industry: ["Healthcare", "Medical Devices", "Pharmaceuticals"],
    venue: "India Expo Centre & Mart",
    city: "Greater Noida",
    state: "IN-UP",
    country: "India",
    organizer: "Messe Düsseldorf India",
    website: "https://medical-fair-india.com",
    frequency: "Annual",
    expectedVisitors: "25,000+",
    exhibitorCount: "800+",
    stallPricing: {
      shellScheme: "₹5,200-7,500/sqm",
      rawSpace: "₹4,000-6,200/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-02-26", endDate: "2025-02-28" },
      { year: 2024, startDate: "2024-02-29", endDate: "2024-03-02" }
    ],
    description: "International trade fair for medical technology, diagnostics, pharmaceuticals, and medical services.",
    keyFeatures: [
      "MedTech Innovation Hub",
      "Digital Health Zone",
      "Hospital Infrastructure",
      "Medical Tourism Pavilion"
    ],
    targetAudience: [
      "Hospitals",
      "Medical distributors",
      "Healthcare professionals",
      "Government health departments"
    ],
    pastExhibitors: ["Siemens Healthineers", "GE Healthcare", "Philips", "Abbott", "Johnson & Johnson"]
  },

  // Automotive
  {
    id: "auto-expo-india",
    name: "Auto Expo - The Motor Show",
    industry: ["Automotive", "Transportation", "Manufacturing"],
    venue: "India Expo Mart",
    city: "Greater Noida",
    state: "IN-UP",
    country: "India",
    organizer: "Society of Indian Automobile Manufacturers (SIAM)",
    website: "https://autoexpo.in",
    frequency: "Biennial",
    expectedVisitors: "600,000+",
    exhibitorCount: "1,200+",
    stallPricing: {
      shellScheme: "₹6,800-9,500/sqm",
      rawSpace: "₹5,500-8,000/sqm"
    },
    dates: [
      { year: 2026, startDate: "2026-01-17", endDate: "2026-01-22" },
      { year: 2024, startDate: "2024-01-12", endDate: "2024-01-17" }
    ],
    description: "India's largest automotive show showcasing latest vehicles, technology, and innovations.",
    keyFeatures: [
      "Electric Vehicle Zone",
      "Future Mobility Pavilion",
      "Commercial Vehicle Section",
      "Auto Components Display"
    ],
    targetAudience: [
      "Automobile manufacturers",
      "Component suppliers",
      "Dealers and distributors",
      "Technology providers"
    ],
    pastExhibitors: ["Maruti Suzuki", "Tata Motors", "Mahindra", "Hyundai", "Honda"]
  },

  // Textiles
  {
    id: "india-itme",
    name: "India ITME",
    industry: ["Textiles", "Manufacturing", "Fashion"],
    venue: "Bombay Exhibition Centre",
    city: "Mumbai",
    state: "IN-MH",
    country: "India",
    organizer: "India Trade Promotion Organisation (ITPO)",
    website: "https://india-itme.com",
    frequency: "Biennial",
    expectedVisitors: "100,000+",
    exhibitorCount: "1,600+",
    stallPricing: {
      shellScheme: "₹4,200-6,000/sqm",
      rawSpace: "₹3,500-5,200/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-12-11", endDate: "2025-12-16" },
      { year: 2023, startDate: "2023-12-08", endDate: "2023-12-13" }
    ],
    description: "India's premier textile machinery exhibition showcasing latest technology and innovations.",
    keyFeatures: [
      "Spinning Technology",
      "Weaving Machinery",
      "Garment Manufacturing",
      "Technical Textiles"
    ],
    targetAudience: [
      "Textile manufacturers",
      "Garment exporters",
      "Technology providers",
      "Government officials"
    ],
    pastExhibitors: ["Rieter", "Trutzschler", "Saurer", "Picanol", "Staubli"]
  },

  // Food & Agriculture
  {
    id: "aahar-delhi",
    name: "Aahar - International Food & Hospitality Fair",
    industry: ["Food & Beverages", "Hospitality", "Agriculture"],
    venue: "Pragati Maidan",
    city: "New Delhi",
    state: "IN-DL",
    country: "India",
    organizer: "India Trade Promotion Organisation (ITPO)",
    website: "https://indiatradefair.com",
    frequency: "Annual",
    expectedVisitors: "75,000+",
    exhibitorCount: "1,000+",
    stallPricing: {
      shellScheme: "₹3,800-5,500/sqm",
      rawSpace: "₹3,000-4,500/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-03-14", endDate: "2025-03-18" },
      { year: 2024, startDate: "2024-03-12", endDate: "2024-03-16" }
    ],
    description: "India's largest food and hospitality exhibition featuring food products, technology, and services.",
    keyFeatures: [
      "Food Processing Technology",
      "Organic Food Pavilion",
      "Restaurant & Hotel Equipment",
      "Culinary Championship"
    ],
    targetAudience: [
      "Food manufacturers",
      "Restaurant chains",
      "Hotel industry",
      "Food distributors"
    ],
    pastExhibitors: ["ITC Limited", "Britannia", "Nestle", "Godrej", "MTR Foods"]
  },

  // Construction & Real Estate
  {
    id: "acetech-delhi",
    name: "ACETECH",
    industry: ["Construction", "Architecture", "Real Estate"],
    venue: "Pragati Maidan",
    city: "New Delhi",
    state: "IN-DL",
    country: "India",
    organizer: "NürnbergMesse India",
    website: "https://acetech.in",
    frequency: "Annual",
    expectedVisitors: "45,000+",
    exhibitorCount: "600+",
    stallPricing: {
      shellScheme: "₹4,800-7,000/sqm",
      rawSpace: "₹3,800-5,800/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-12-04", endDate: "2025-12-07" },
      { year: 2024, startDate: "2024-12-05", endDate: "2024-12-08" }
    ],
    description: "International exhibition for architecture, construction technology, and building materials.",
    keyFeatures: [
      "Green Building Solutions",
      "Smart Home Technology",
      "Construction Equipment",
      "Interior Design Trends"
    ],
    targetAudience: [
      "Architects",
      "Contractors",
      "Real estate developers",
      "Government planners"
    ],
    pastExhibitors: ["Asian Paints", "UltraTech Cement", "Godrej Properties", "L&T Construction"]
  },

  // Electronics & Technology
  {
    id: "electronica-india",
    name: "electronica India",
    industry: ["Electronics", "Technology", "Manufacturing"],
    venue: "India Expo Centre & Mart",
    city: "Greater Noida",
    state: "IN-UP",
    country: "India",
    organizer: "Messe München India",
    website: "https://electronica-india.com",
    frequency: "Biennial",
    expectedVisitors: "30,000+",
    exhibitorCount: "700+",
    stallPricing: {
      shellScheme: "₹5,500-8,000/sqm",
      rawSpace: "₹4,500-6,800/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-09-18", endDate: "2025-09-20" },
      { year: 2023, startDate: "2023-09-21", endDate: "2023-09-23" }
    ],
    description: "International trade fair for electronic components, systems, and applications.",
    keyFeatures: [
      "IoT & Connectivity",
      "Automotive Electronics",
      "Power Electronics",
      "Sensor Technology"
    ],
    targetAudience: [
      "Electronics manufacturers",
      "Component distributors",
      "R&D organizations",
      "Technology integrators"
    ],
    pastExhibitors: ["Texas Instruments", "STMicroelectronics", "Infineon", "ROHM", "Mouser Electronics"]
  },

  // Jewelry & Gems
  {
    id: "iijs-mumbai",
    name: "India International Jewellery Show (IIJS)",
    industry: ["Jewelry & Gems", "Fashion", "Luxury"],
    venue: "Bombay Exhibition Centre",
    city: "Mumbai",
    state: "IN-MH",
    country: "India",
    organizer: "Gem & Jewellery Export Promotion Council (GJEPC)",
    website: "https://iijs.org",
    frequency: "Annual",
    expectedVisitors: "45,000+",
    exhibitorCount: "1,500+",
    stallPricing: {
      shellScheme: "₹5,800-8,500/sqm",
      rawSpace: "₹4,500-7,200/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-08-14", endDate: "2025-08-18" },
      { year: 2024, startDate: "2024-08-15", endDate: "2024-08-19" }
    ],
    description: "India's premier jewelry trade show featuring precious stones, finished jewelry, and industry innovations.",
    keyFeatures: [
      "Precious Stones Pavilion",
      "Designer Jewelry Collections",
      "Diamond & Gold Showcase",
      "International Buyer Program"
    ],
    targetAudience: [
      "Jewelry manufacturers",
      "Gem dealers",
      "International buyers",
      "Retail jewelers"
    ],
    pastExhibitors: ["Tanishq", "PC Jeweller", "Kalyan Jewellers", "Malabar Gold"]
  },

  // Manufacturing & Engineering
  {
    id: "imtex-bangalore",
    name: "IMTEX - Indian Metal-cutting & Machine Tool Exhibition",
    industry: ["Manufacturing", "Engineering", "Technology"],
    venue: "Bangalore International Exhibition Centre (BIEC)",
    city: "Bangalore",
    state: "IN-KA",
    country: "India",
    organizer: "Indian Machine Tool Manufacturers Association (IMTMA)",
    website: "https://imtex.in",
    frequency: "Biennial",
    expectedVisitors: "60,000+",
    exhibitorCount: "1,000+",
    stallPricing: {
      shellScheme: "₹4,800-7,000/sqm",
      rawSpace: "₹3,800-5,800/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-01-23", endDate: "2025-01-28" },
      { year: 2023, startDate: "2023-01-19", endDate: "2023-01-24" }
    ],
    description: "Premier machine tool and manufacturing technology exhibition showcasing cutting-edge industrial solutions.",
    keyFeatures: [
      "CNC Machine Tools",
      "Industry 4.0 Solutions",
      "Additive Manufacturing",
      "Precision Engineering"
    ],
    targetAudience: [
      "Manufacturing companies",
      "Engineering firms",
      "Tool manufacturers",
      "Industrial buyers"
    ],
    pastExhibitors: ["DMG MORI", "Mazak", "Okuma", "Haas Automation", "ACE Manufacturing"]
  },

  // Energy & Power
  {
    id: "renewable-energy-india",
    name: "Renewable Energy India Expo",
    industry: ["Energy", "Technology", "Environment"],
    venue: "India Expo Centre & Mart",
    city: "Greater Noida",
    state: "IN-UP",
    country: "India",
    organizer: "Indian Renewable Energy Development Agency (IREDA)",
    website: "https://renewableenergyindiaexpo.com",
    frequency: "Annual",
    expectedVisitors: "35,000+",
    exhibitorCount: "600+",
    stallPricing: {
      shellScheme: "₹5,000-7,500/sqm",
      rawSpace: "₹4,200-6,500/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-09-18", endDate: "2025-09-20" },
      { year: 2024, startDate: "2024-09-19", endDate: "2024-09-21" }
    ],
    description: "Leading renewable energy exhibition showcasing solar, wind, and sustainable energy solutions.",
    keyFeatures: [
      "Solar Technology Pavilion",
      "Wind Power Solutions",
      "Energy Storage Systems",
      "Smart Grid Technology"
    ],
    targetAudience: [
      "Energy companies",
      "Government agencies",
      "Technology providers",
      "Investors"
    ],
    pastExhibitors: ["Tata Power Solar", "Adani Green Energy", "ReNew Power", "Azure Power"]
  },

  // Chemical & Petrochemical
  {
    id: "chemexpo-mumbai",
    name: "ChemExpo India",
    industry: ["Chemical", "Petrochemical", "Manufacturing"],
    venue: "Bombay Exhibition Centre",
    city: "Mumbai",
    state: "IN-MH",
    country: "India",
    organizer: "Indian Chemical Council",
    website: "https://chemexpoindia.com",
    frequency: "Annual",
    expectedVisitors: "20,000+",
    exhibitorCount: "500+",
    stallPricing: {
      shellScheme: "₹4,500-6,800/sqm",
      rawSpace: "₹3,500-5,500/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-11-20", endDate: "2025-11-22" },
      { year: 2024, startDate: "2024-11-21", endDate: "2024-11-23" }
    ],
    description: "Comprehensive chemical industry exhibition featuring specialty chemicals, petrochemicals, and process technology.",
    keyFeatures: [
      "Specialty Chemicals",
      "Process Equipment",
      "Laboratory Technology",
      "Safety Solutions"
    ],
    targetAudience: [
      "Chemical manufacturers",
      "Process engineers",
      "Equipment suppliers",
      "R&D organizations"
    ],
    pastExhibitors: ["Reliance Industries", "ONGC", "Indian Oil", "Tata Chemicals"]
  },

  // Agriculture & Food Processing
  {
    id: "kisan-mumbai",
    name: "Kisan - Agriculture & Food Processing Exhibition",
    industry: ["Agriculture", "Food Processing", "Technology"],
    venue: "Goregaon Exhibition Centre",
    city: "Mumbai",
    state: "IN-MH",
    country: "India",
    organizer: "Federation of Indian Chambers of Commerce (FICCI)",
    website: "https://kisanexpo.com",
    frequency: "Annual",
    expectedVisitors: "40,000+",
    exhibitorCount: "800+",
    stallPricing: {
      shellScheme: "₹3,500-5,200/sqm",
      rawSpace: "₹2,800-4,200/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-12-10", endDate: "2025-12-14" },
      { year: 2024, startDate: "2024-12-12", endDate: "2024-12-16" }
    ],
    description: "Comprehensive agriculture and food processing exhibition showcasing modern farming and food technology.",
    keyFeatures: [
      "Modern Farming Equipment",
      "Food Processing Technology",
      "Organic Farming Solutions",
      "Government Scheme Information"
    ],
    targetAudience: [
      "Farmers",
      "Food processors",
      "Agricultural equipment dealers",
      "Government officials"
    ],
    pastExhibitors: ["Mahindra Tractors", "John Deere", "ITC Agri Business", "Hindustan Unilever"]
  },

  // Education & Training
  {
    id: "education-expo-delhi",
    name: "India Education Expo",
    industry: ["Education", "Technology", "Training"],
    venue: "Pragati Maidan",
    city: "New Delhi",
    state: "IN-DL",
    country: "India",
    organizer: "Education Promotion Society of India",
    website: "https://indiaeducationexpo.com",
    frequency: "Annual",
    expectedVisitors: "80,000+",
    exhibitorCount: "1,200+",
    stallPricing: {
      shellScheme: "₹3,200-4,800/sqm",
      rawSpace: "₹2,500-3,800/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-01-15", endDate: "2025-01-17" },
      { year: 2024, startDate: "2024-01-16", endDate: "2024-01-18" }
    ],
    description: "Largest education exhibition in India showcasing educational institutions, courses, and career opportunities.",
    keyFeatures: [
      "University Pavilions",
      "Skill Development Programs",
      "EdTech Solutions",
      "Career Counseling"
    ],
    targetAudience: [
      "Students",
      "Parents",
      "Educational institutions",
      "Training providers"
    ],
    pastExhibitors: ["BYJU'S", "Unacademy", "IIT/IIM Institutes", "Study Abroad Consultants"]
  },

  // Furniture & Interior Design
  {
    id: "acetech-mumbai",
    name: "ACETECH Mumbai",
    industry: ["Furniture", "Interior Design", "Construction"],
    venue: "Bombay Exhibition Centre",
    city: "Mumbai",
    state: "IN-MH",
    country: "India",
    organizer: "NürnbergMesse India",
    frequency: "Annual",
    expectedVisitors: "35,000+",
    exhibitorCount: "500+",
    stallPricing: {
      shellScheme: "₹4,500-6,500/sqm",
      rawSpace: "₹3,500-5,200/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-04-17", endDate: "2025-04-20" },
      { year: 2024, startDate: "2024-04-18", endDate: "2024-04-21" }
    ],
    description: "Premier architecture, construction, and design exhibition featuring latest trends and innovations.",
    keyFeatures: [
      "Modern Furniture Design",
      "Smart Home Solutions",
      "Sustainable Materials",
      "Architectural Innovation"
    ],
    targetAudience: [
      "Architects",
      "Interior designers",
      "Contractors",
      "Homeowners"
    ],
    pastExhibitors: ["Godrej Interio", "Nilkamal", "Durian", "HomeLane"]
  },

  // Banking & Finance
  {
    id: "ifsec-mumbai",
    name: "IFSEC India - Security & Fire Exhibition",
    industry: ["Security", "Technology", "Banking"],
    venue: "Bombay Exhibition Centre",
    city: "Mumbai",
    state: "IN-MH",
    country: "India",
    organizer: "UBM India",
    frequency: "Annual",
    expectedVisitors: "15,000+",
    exhibitorCount: "400+",
    stallPricing: {
      shellScheme: "₹4,200-6,200/sqm",
      rawSpace: "₹3,200-4,800/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-12-03", endDate: "2025-12-05" },
      { year: 2024, startDate: "2024-12-04", endDate: "2024-12-06" }
    ],
    description: "Premier security and fire safety exhibition showcasing latest security technologies and solutions.",
    keyFeatures: [
      "Surveillance Technology",
      "Access Control Systems",
      "Fire Safety Solutions",
      "Cybersecurity"
    ],
    targetAudience: [
      "Security professionals",
      "Government agencies",
      "Corporate security",
      "Technology integrators"
    ],
    pastExhibitors: ["Hikvision", "Honeywell", "Johnson Controls", "Bosch Security"]
  },

  // Packaging Industry
  {
    id: "pacprocess-mumbai",
    name: "PackProcess India",
    industry: ["Packaging", "Manufacturing", "Food Processing"],
    venue: "Bombay Exhibition Centre",
    city: "Mumbai",
    state: "IN-MH",
    country: "India",
    organizer: "Messe Düsseldorf India",
    frequency: "Annual",
    expectedVisitors: "22,000+",
    exhibitorCount: "650+",
    stallPricing: {
      shellScheme: "₹4,000-5,800/sqm",
      rawSpace: "₹3,200-4,800/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-10-15", endDate: "2025-10-17" },
      { year: 2024, startDate: "2024-10-16", endDate: "2024-10-18" }
    ],
    description: "Leading packaging and processing exhibition featuring innovative packaging solutions and technology.",
    keyFeatures: [
      "Packaging Machinery",
      "Sustainable Packaging",
      "Smart Packaging Solutions",
      "Food Processing Equipment"
    ],
    targetAudience: [
      "Packaging manufacturers",
      "Food processors",
      "FMCG companies",
      "Equipment suppliers"
    ],
    pastExhibitors: ["Tetra Pak", "ITC Packaging", "Uflex", "Huhtamaki"]
  },

  // Oil & Gas
  {
    id: "petrotech-delhi",
    name: "PETROTECH - International Oil & Gas Exhibition",
    industry: ["Oil & Gas", "Energy", "Engineering"],
    venue: "India Expo Centre & Mart",
    city: "Greater Noida",
    state: "IN-UP",
    country: "India",
    organizer: "Ministry of Petroleum & Natural Gas",
    frequency: "Biennial",
    expectedVisitors: "80,000+",
    exhibitorCount: "1,000+",
    stallPricing: {
      shellScheme: "₹6,500-9,500/sqm",
      rawSpace: "₹5,200-7,800/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-02-09", endDate: "2025-02-12" },
      { year: 2023, startDate: "2023-02-12", endDate: "2023-02-15" }
    ],
    description: "Premier oil and gas exhibition featuring exploration, production, refining, and petrochemical technologies.",
    keyFeatures: [
      "Upstream Technology",
      "Downstream Solutions",
      "Digital Oil & Gas",
      "Clean Energy Transition"
    ],
    targetAudience: [
      "Oil companies",
      "Equipment manufacturers",
      "Government agencies",
      "Technology providers"
    ],
    pastExhibitors: ["ONGC", "Indian Oil", "Reliance", "Schlumberger", "Halliburton"]
  },

  // Water & Environment
  {
    id: "water-expo-delhi",
    name: "India Water Expo",
    industry: ["Water Treatment", "Environment", "Technology"],
    venue: "Pragati Maidan",
    city: "New Delhi",
    state: "IN-DL",
    country: "India",
    organizer: "Water Today",
    frequency: "Annual",
    expectedVisitors: "25,000+",
    exhibitorCount: "500+",
    stallPricing: {
      shellScheme: "₹3,800-5,500/sqm",
      rawSpace: "₹3,000-4,500/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-11-12", endDate: "2025-11-14" },
      { year: 2024, startDate: "2024-11-13", endDate: "2024-11-15" }
    ],
    description: "Comprehensive water and wastewater treatment exhibition showcasing innovative solutions and technologies.",
    keyFeatures: [
      "Water Treatment Systems",
      "Wastewater Management",
      "Smart Water Technology",
      "Environmental Solutions"
    ],
    targetAudience: [
      "Municipal corporations",
      "Water treatment companies",
      "Environmental consultants",
      "Government agencies"
    ],
    pastExhibitors: ["Aquatech", "VA Tech Wabag", "Ion Exchange", "Thermax"]
  },

  // Tourism & Hospitality
  {
    id: "ttf-kolkata",
    name: "Travel & Tourism Fair (TTF)",
    industry: ["Tourism", "Hospitality", "Travel"],
    venue: "Milan Mela Complex",
    city: "Kolkata",
    state: "IN-WB",
    country: "India",
    organizer: "TTF Travel & Tourism Foundation",
    frequency: "Annual",
    expectedVisitors: "40,000+",
    exhibitorCount: "300+",
    stallPricing: {
      shellScheme: "₹3,200-4,500/sqm",
      rawSpace: "₹2,500-3,800/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-02-20", endDate: "2025-02-23" },
      { year: 2024, startDate: "2024-02-22", endDate: "2024-02-25" }
    ],
    description: "Premier travel and tourism exhibition showcasing destinations, tour packages, and hospitality services.",
    keyFeatures: [
      "Destination Showcases",
      "Adventure Tourism",
      "Cultural Heritage Tours",
      "Travel Technology"
    ],
    targetAudience: [
      "Travel agents",
      "Tour operators",
      "Hotels & resorts",
      "Tourism boards"
    ],
    pastExhibitors: ["Thomas Cook", "SOTC", "MakeMyTrip", "Cox & Kings"]
  },

  // Pharma & Biotechnology
  {
    id: "cphi-mumbai",
    name: "CPhI India - Pharma Exhibition",
    industry: ["Pharmaceuticals", "Biotechnology", "Healthcare"],
    venue: "India Expo Centre & Mart",
    city: "Greater Noida",
    state: "IN-UP",
    country: "India",
    organizer: "Informa Markets",
    frequency: "Annual",
    expectedVisitors: "45,000+",
    exhibitorCount: "1,500+",
    stallPricing: {
      shellScheme: "₹5,500-8,200/sqm",
      rawSpace: "₹4,500-6,800/sqm"
    },
    dates: [
      { year: 2025, startDate: "2025-11-26", endDate: "2025-11-28" },
      { year: 2024, startDate: "2024-11-27", endDate: "2024-11-29" }
    ],
    description: "Leading pharmaceutical exhibition featuring APIs, finished dosages, pharma machinery, and services.",
    keyFeatures: [
      "API Manufacturing",
      "Pharma Machinery",
      "Contract Manufacturing",
      "Regulatory Services"
    ],
    targetAudience: [
      "Pharmaceutical companies",
      "API manufacturers",
      "Equipment suppliers",
      "Regulatory consultants"
    ],
    pastExhibitors: ["Sun Pharma", "Dr. Reddy's", "Cipla", "Lupin", "Biocon"]
  }
];

// Industry-specific exhibition insights
export const INDUSTRY_INSIGHTS = {
  "Technology": {
    avgStallCost: "₹85,000-1,50,000",
    keyMetrics: ["Lead generation", "Technology demos", "Partnership meetings"],
    bestPractices: [
      "Interactive product demos",
      "Technical presentations",
      "Networking events",
      "Live coding sessions"
    ],
    seasonalTrends: "Peak season: October-March",
    roiExpectation: "150-300% ROI typical for tech exhibitions"
  },
  "Healthcare": {
    avgStallCost: "₹1,20,000-2,50,000",
    keyMetrics: ["Regulatory compliance demos", "Product certifications", "Medical professional engagement"],
    bestPractices: [
      "Clinical evidence display",
      "Compliance documentation",
      "Medical expert presentations",
      "Product safety demos"
    ],
    seasonalTrends: "Peak season: February-April, September-November",
    roiExpectation: "200-400% ROI for medical device companies"
  },
  "Automotive": {
    avgStallCost: "₹2,00,000-5,00,000",
    keyMetrics: ["Vehicle displays", "Technology integration", "Dealer network expansion"],
    bestPractices: [
      "Vehicle experience zones",
      "Technology demonstrations",
      "Test drive arrangements",
      "After-sales service displays"
    ],
    seasonalTrends: "Peak season: January-February (Auto Expo years)",
    roiExpectation: "250-500% ROI for automotive manufacturers"
  },
  "Textiles": {
    avgStallCost: "₹60,000-1,20,000",
    keyMetrics: ["Fabric quality display", "Production capability", "Export opportunities"],
    bestPractices: [
      "Fabric touch and feel zones",
      "Production process displays",
      "Sustainability showcases",
      "Fashion trend presentations"
    ],
    seasonalTrends: "Peak season: December-March",
    roiExpectation: "180-350% ROI for textile manufacturers"
  },
  "Jewelry & Gems": {
    avgStallCost: "₹1,50,000-3,50,000",
    keyMetrics: ["Jewelry display quality", "International buyer meetings", "Brand positioning"],
    bestPractices: [
      "Secure display arrangements",
      "Premium lighting setup",
      "International buyer programs",
      "Brand storytelling displays"
    ],
    seasonalTrends: "Peak season: August-September, January-February",
    roiExpectation: "200-450% ROI for jewelry manufacturers"
  },
  "Manufacturing": {
    avgStallCost: "₹95,000-2,20,000",
    keyMetrics: ["Machine demonstrations", "Technical specifications", "Order generation"],
    bestPractices: [
      "Live machine demonstrations",
      "Technical documentation",
      "Product specification displays",
      "After-sales service information"
    ],
    seasonalTrends: "Peak season: January-March, September-November",
    roiExpectation: "180-400% ROI for equipment manufacturers"
  },
  "Energy": {
    avgStallCost: "₹1,20,000-2,80,000",
    keyMetrics: ["Technology efficiency demos", "Government partnerships", "Sustainability metrics"],
    bestPractices: [
      "Energy efficiency demonstrations",
      "Sustainability showcases",
      "Government partnership displays",
      "ROI calculation tools"
    ],
    seasonalTrends: "Peak season: September-November",
    roiExpectation: "250-500% ROI for renewable energy companies"
  },
  "Chemical": {
    avgStallCost: "₹85,000-1,80,000",
    keyMetrics: ["Safety demonstrations", "Product samples", "Technical partnerships"],
    bestPractices: [
      "Safety protocol displays",
      "Product sample showcases",
      "Technical specification documentation",
      "Environmental compliance information"
    ],
    seasonalTrends: "Peak season: November-February",
    roiExpectation: "170-350% ROI for chemical manufacturers"
  },
  "Agriculture": {
    avgStallCost: "₹45,000-95,000",
    keyMetrics: ["Equipment demonstrations", "Yield improvement stories", "Government scheme awareness"],
    bestPractices: [
      "Equipment live demonstrations",
      "Success story presentations",
      "Government scheme information",
      "Farmer education programs"
    ],
    seasonalTrends: "Peak season: December-February",
    roiExpectation: "150-300% ROI for agricultural equipment companies"
  },
  "Education": {
    avgStallCost: "₹35,000-85,000",
    keyMetrics: ["Student enrollments", "Course demonstrations", "Career guidance"],
    bestPractices: [
      "Interactive course demonstrations",
      "Student success stories",
      "Career counseling services",
      "Scholarship information"
    ],
    seasonalTrends: "Peak season: January-March, July-September",
    roiExpectation: "120-250% ROI for educational institutions"
  },
  "Furniture": {
    avgStallCost: "₹65,000-1,40,000",
    keyMetrics: ["Design showcase", "Material quality", "Customization options"],
    bestPractices: [
      "Room setup displays",
      "Material quality showcases",
      "Customization demonstrations",
      "Design consultation services"
    ],
    seasonalTrends: "Peak season: April-June, October-December",
    roiExpectation: "160-320% ROI for furniture manufacturers"
  }
};

export function getExhibitionsByIndustry(industry: string): Exhibition[] {
  return INDIAN_EXHIBITIONS.filter(expo => 
    expo.industry.some(ind => ind.toLowerCase().includes(industry.toLowerCase()))
  );
}

export function getExhibitionsByCity(city: string): Exhibition[] {
  return INDIAN_EXHIBITIONS.filter(expo => 
    expo.city.toLowerCase().includes(city.toLowerCase())
  );
}

export function getUpcomingExhibitions(): Exhibition[] {
  const currentDate = new Date();
  return INDIAN_EXHIBITIONS.filter(expo => {
    return expo.dates.some(date => new Date(date.startDate) > currentDate);
  }).sort((a, b) => {
    const nextDateA = a.dates.find(date => new Date(date.startDate) > currentDate);
    const nextDateB = b.dates.find(date => new Date(date.startDate) > currentDate);
    if (!nextDateA) return 1;
    if (!nextDateB) return -1;
    return new Date(nextDateA.startDate).getTime() - new Date(nextDateB.startDate).getTime();
  });
}