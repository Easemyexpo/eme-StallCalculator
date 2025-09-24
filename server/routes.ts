import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { TwoPagePDFGenerator, AIAnalysisReportGenerator, ROIPlanningGuideGenerator } from "./two-page-pdf-generator";
import { generateAIAnalysisPDF } from "./ai-analysis-generator";
import { LetterheadGenerator } from "./letterhead-generator";
import { googleAPI } from "./services/google-api";
import { amadeusAPI, travelPayoutsAPI } from "./services/travel-api";
import { shipEngineAPI } from "./services/logistics-api";
import { hotelSearchSchema, flightSearchSchema, logisticsQuoteSchema, eventRecommendationRequest } from "@shared/schema";
import { sendUserFormNotification } from "./email";
import { aiEventRecommender } from "./services/ai-event-recommender";

// Mock data for development
const mockHotels = [
  {
    id: "hotel_1",
    name: "Luxury Hotel Downtown",
    location: "City Center",
    pricePerNight: 15000,
    rating: 4.5,
    amenities: ["WiFi", "Pool", "Gym", "Restaurant"],
    distance: "2.5 km from venue"
  },
  {
    id: "hotel_2", 
    name: "Business Hotel Airport",
    location: "Airport Area",
    pricePerNight: 8500,
    rating: 4.2,
    amenities: ["WiFi", "Airport Shuttle", "Restaurant"],
    distance: "15 km from venue"
  },
  {
    id: "hotel_3",
    name: "Budget Hotel Station",
    location: "Railway Station",
    pricePerNight: 3500,
    rating: 3.8,
    amenities: ["WiFi", "Restaurant"],
    distance: "8 km from venue"
  }
];

const mockFlights = [
  {
    id: "flight_1",
    airline: "Air India",
    flightNumber: "AI-101",
    departure: "09:00",
    arrival: "11:30",
    duration: "2h 30m",
    price: 8500,
    stops: "Non-stop",
    aircraft: "Boeing 737"
  },
  {
    id: "flight_2",
    airline: "IndiGo",
    flightNumber: "6E-201",
    departure: "14:15",
    arrival: "16:45", 
    duration: "2h 30m",
    price: 7200,
    stops: "Non-stop",
    aircraft: "Airbus A320"
  }
];

function getCityHotel(cityName: string, type: 'luxury' | 'premium' | 'budget'): string {
  const hotels = {
    luxury: [
      'Taj Palace Hotel',
      'The Oberoi',
      'ITC Maratha',
      'Leela Palace',
      'JW Marriott'
    ],
    premium: [
      'Holiday Inn',
      'Radisson Blu',
      'Novotel',
      'Crowne Plaza',
      'Hyatt Regency'
    ],
    budget: [
      'Treebo Trend',
      'OYO Rooms',
      'FabHotel',
      'Ginger Hotel',
      'Ibis Budget'
    ]
  };
  
  const cityHotels = hotels[type];
  const randomHotel = cityHotels[Math.floor(Math.random() * cityHotels.length)];
  return `${randomHotel} ${cityName}`;
}

// Mock vendors for development
const mockVendors = [
    {
      name: "ExpoTech Solutions",
      category: "booth",
      city: "Mumbai",
      state: "Maharashtra",
      location: "Mumbai, Maharashtra",
      description: "Premium exhibition booth design and construction",
      specialties: ["Custom Booths", "Modular Systems", "LED Displays"],
      rating: "4.8",
      isActive: true,
      phone: "+91-98765-43210",
      email: "contact@expotech.com",
      avgCost: 150000,
      certifications: ["ISO 9001", "Exhibition Design Certified"],
      recentWork: ["Auto Expo 2024", "Tech Summit 2024"],
      advantages: ["24/7 Support", "Quick Turnaround", "Premium Materials"],
      hourlyRate: 2500,
      projectRate: 200000,
      sqftRate: 800
    },
  {
    name: "LogiFast Services",
    category: "logistics",
    city: "Delhi",
    state: "Delhi",
    location: "Delhi, NCR",
    description: "Complete logistics and transportation solutions",
    specialties: ["Freight Forwarding", "Warehousing", "Last Mile Delivery"],
      rating: "4.6",
    isActive: true,
    phone: "+91-98765-43211",
    email: "info@logifast.com",
    avgCost: 75000,
    certifications: ["Logistics Certified", "Safety Standards"],
    recentWork: ["Delhi Trade Fair", "Industrial Expo"],
    advantages: ["Real-time Tracking", "Insurance Coverage", "Fast Delivery"],
    hourlyRate: 1500,
    projectRate: 100000,
    sqftRate: 300
  },
  {
    name: "TravelPro Agency",
    category: "travel",
    city: "Bangalore",
    state: "Karnataka",
    location: "Bangalore, Karnataka",
    description: "Corporate travel and accommodation booking",
    specialties: ["Flight Booking", "Hotel Reservations", "Group Travel"],
      rating: "4.7",
    isActive: true,
    phone: "+91-98765-43212",
    email: "bookings@travelpro.com",
    avgCost: 50000,
    certifications: ["IATA Certified", "Travel Agent License"],
    recentWork: ["Corporate Retreats", "Conference Travel"],
    advantages: ["Best Rates", "24/7 Support", "Flexible Cancellation"],
    hourlyRate: 800,
    projectRate: 75000,
    sqftRate: 0
  }
];

// Function to seed mock vendors
async function seedMockVendors() {
  try {
    const existingVendors = await storage.getAllVendors();
    if (existingVendors.length === 0) {
      console.log("Seeding mock vendors...");
      for (const vendor of mockVendors) {
        await storage.createVendor(vendor);
      }
      console.log("Mock vendors seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding mock vendors:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server | null> {
  // Auth middleware
  await setupAuth(app);
  
  // Seed mock vendors
  await seedMockVendors();

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Workspace routes
  app.post('/api/workspaces', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { name, description } = req.body;
      
      const workspace = await storage.createWorkspace({
        name,
        description,
        ownerId: userId,
      });
      
      res.json(workspace);
    } catch (error) {
      console.error("Error creating workspace:", error);
      res.status(500).json({ message: "Failed to create workspace" });
    }
  });

  app.get('/api/workspaces', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workspaces = await storage.getUserWorkspaces(userId);
      res.json(workspaces);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      res.status(500).json({ message: "Failed to fetch workspaces" });
    }
  });

  app.get('/api/workspaces/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const workspace = await storage.getWorkspace(id);
      
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }
      
      res.json(workspace);
    } catch (error) {
      console.error("Error fetching workspace:", error);
      res.status(500).json({ message: "Failed to fetch workspace" });
    }
  });

  // Project routes
  app.post('/api/workspaces/:workspaceId/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { workspaceId } = req.params;
      const { name, description, budget, currency, settings } = req.body;
      
      const project = await storage.createProject({
        workspaceId,
        name,
        description,
        budget,
        currency,
        settings,
        createdBy: userId,
      });
      
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.get('/api/workspaces/:workspaceId/projects', isAuthenticated, async (req: any, res) => {
    try {
      const { workspaceId } = req.params;
      const projects = await storage.getWorkspaceProjects(workspaceId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Calculator API endpoints
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get market data and pricing information
  app.get("/api/market-data", (req, res) => {
    const marketData = {
      currencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY", "INR", "SGD", "CHF"],
      marketLevels: ["low", "medium", "high", "premium"],
      eventTypes: ["trade", "consumer", "tech", "medical", "food", "automotive", "fashion", "industrial"],
      venueTypes: ["standard", "premium", "hotel", "outdoor"],
      boothTypes: ["shell", "custom", "modular", "premium"],
      accommodationLevels: ["budget", "business", "luxury"]
    };
    
    res.json(marketData);
  });

  // Calculate costs endpoint (for server-side validation/processing if needed)
  app.post("/api/calculate", async (req, res) => {
    try {
      const formData = req.body;
      
      // Basic cost calculation logic
      const boothSize = formData.boothSize || formData.customSize || 18;
      const teamSize = formData.teamSize || 4;
      const distance = formData.distance || 500;
      
      const costs = {
        booth: boothSize * 15000, // ₹15,000 per sqm
        travel: teamSize * distance * 2, // ₹2 per km per person
        accommodation: teamSize * 5000 * 3, // ₹5,000 per person per night for 3 nights
        total: 0
      };
      
      costs.total = costs.booth + costs.travel + costs.accommodation;
      
      res.json({
        success: true,
        costs,
        breakdown: {
          booth: costs.booth,
          travel: costs.travel,
          accommodation: costs.accommodation,
          total: costs.total
        }
      });
    } catch (error) {
      console.error("Calculation error:", error);
      res.status(500).json({ error: "Calculation failed" });
    }
  });

  // Hotel search endpoint
  app.post("/api/hotels/search", async (req, res) => {
    try {
      const { city, checkIn, checkOut, guests } = req.body;
      
      // Mock hotel search results
      const hotels = mockHotels.map(hotel => ({
        ...hotel,
        totalPrice: hotel.pricePerNight * 3, // 3 nights
        available: true
      }));
      
      res.json({
        success: true,
        hotels,
        total: hotels.length,
        searchParams: { city, checkIn, checkOut, guests }
      });
    } catch (error) {
      console.error("Hotel search error:", error);
      res.status(500).json({ error: "Hotel search failed" });
    }
  });

  // Flight search endpoint
  app.post("/api/flights/search", async (req, res) => {
    try {
      const { origin, destination, departureDate, passengers } = req.body;
      
      // Mock flight search results
      const flights = mockFlights.map(flight => ({
        ...flight,
        totalPrice: flight.price * passengers,
        available: true
      }));
      
      res.json({
        success: true,
        outbound: flights,
        return: flights, // For now, return same flights for return journey
        total: flights.length,
        searchParams: { origin, destination, departureDate, passengers }
      });
    } catch (error) {
      console.error("Flight search error:", error);
      res.status(500).json({ error: "Flight search failed" });
    }
  });

  // Logistics search endpoint
  app.post("/api/logistics/search", async (req, res) => {
    try {
      const { origin, destination, cargoType, weight, dimensions } = req.body;
      
      // Mock logistics providers
      const logisticsProviders = [
        {
          id: "logistics_1",
          provider: "FastTrack Logistics",
          service: "Exhibition Material Transport",
          estimatedDelivery: "3-5 days",
          price: 25000,
          currency: "INR",
          tracking: true,
          insurance: true,
          pickupAvailable: true,
          specialServices: ["White Glove Service", "Climate Control", "Real-time Tracking"],
          contact: {
            phone: "+91-98765-43213",
            email: "info@fasttrack.com"
          }
        },
        {
          id: "logistics_2",
          provider: "SecureMove Express",
          service: "Premium Exhibition Shipping",
          estimatedDelivery: "2-4 days",
          price: 35000,
          currency: "INR",
          tracking: true,
          insurance: true,
          pickupAvailable: true,
          specialServices: ["Same Day Pickup", "Fragile Handling", "Custom Packaging"],
          contact: {
            phone: "+91-98765-43214",
            email: "support@securemove.com"
          }
        },
        {
          id: "logistics_3",
          provider: "Budget Logistics Co",
          service: "Standard Exhibition Transport",
          estimatedDelivery: "5-7 days",
          price: 15000,
          currency: "INR",
          tracking: false,
          insurance: false,
          pickupAvailable: false,
          specialServices: ["Basic Transport", "Standard Packaging"],
          contact: {
            phone: "+91-98765-43215",
            email: "contact@budgetlogistics.com"
          }
        }
      ];
      
      res.json({
        success: true,
        logistics: logisticsProviders,
        total: logisticsProviders.length,
        searchParams: { origin, destination, cargoType, weight, dimensions }
      });
    } catch (error) {
      console.error("Logistics search error:", error);
      res.status(500).json({ error: "Logistics search failed" });
    }
  });

  // Smart vendor matching endpoint
  app.get("/api/smart-vendors", async (req, res) => {
    try {
      const { destinationCity, boothSize } = req.query;
      
      if (!destinationCity || !boothSize) {
        return res.json({
          success: true,
          vendors: [],
          total: 0,
          message: "Please provide destination city and booth size"
        });
      }
      
      // Get all active vendors from database
      const allVendors = await storage.getAllVendors();
      const activeVendors = allVendors.filter(vendor => vendor.isActive);
      
        // Generate smart vendor recommendations with match scores
        const smartVendors = activeVendors.map(vendor => ({
          id: vendor.id,
          name: vendor.name,
          category: vendor.category,
          location: vendor.location || vendor.city,
          specialties: Array.isArray(vendor.specialties) ? vendor.specialties : [],
          rating: parseFloat(vendor.rating || '4.0'),
          completedProjects: Math.floor(Math.random() * 100) + 10,
          avgCost: Math.floor(Math.random() * 50000) + 10000,
          matchScore: Math.floor(Math.random() * 30) + 70, // 70-100% match
          certifications: [],
          recentWork: [],
          contact: {
            phone: "+91-XXXX-XXXX",
            email: "contact@vendor.com"
          },
          advantages: [],
          pricing: {
            hourly: Math.floor(Math.random() * 2000) + 500,
            project: Math.floor(Math.random() * 100000) + 50000,
            sqft: Math.floor(Math.random() * 500) + 200
          }
        }));
      
      res.json(smartVendors);
    } catch (error) {
      console.error("Smart vendor search error:", error);
      res.status(500).json({ error: "Smart vendor search failed" });
    }
  });

  // Vendor search endpoint
  app.post("/api/vendors/search", async (req, res) => {
    try {
      const { query, location, category } = req.body;
      
      // Get all active vendors from database
      const allVendors = await storage.getAllVendors();
      const activeVendors = allVendors.filter(vendor => vendor.isActive);
      
      // Simple search logic
      let matchingVendors = activeVendors;
      
      if (query) {
        matchingVendors = matchingVendors.filter(vendor => 
          vendor.name.toLowerCase().includes(query.toLowerCase()) ||
          vendor.description?.toLowerCase().includes(query.toLowerCase()) ||
          (vendor.specialties as string[])?.some((specialty: string) => 
            specialty.toLowerCase().includes(query.toLowerCase())
          )
        );
      }
      
      if (location) {
        matchingVendors = matchingVendors.filter(vendor => 
          vendor.location?.toLowerCase().includes(location.toLowerCase()) ||
          vendor.city?.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      if (category) {
        matchingVendors = matchingVendors.filter(vendor => 
          vendor.category?.toLowerCase().includes(category.toLowerCase())
        );
      }
      
      res.json({
        success: true,
        vendors: matchingVendors,
        total: matchingVendors.length,
        searchParams: { query, location, category }
      });
    } catch (error) {
      console.error("Vendor search error:", error);
      res.status(500).json({ error: "Vendor search failed" });
    }
  });

  // Admin vendor management endpoints
  app.get("/api/admin/vendors", async (req, res) => {
    try {
      const vendors = await storage.getAllVendors();
      res.json(vendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      res.status(500).json({ error: "Failed to fetch vendors" });
    }
  });

  app.post("/api/admin/vendors", async (req, res) => {
    try {
      const vendorData = req.body;
      const newVendor = await storage.createVendor({
        ...vendorData,
        isActive: vendorData.isActive !== false
      });
      res.json(newVendor);
    } catch (error) {
      console.error("Error creating vendor:", error);
      res.status(500).json({ error: "Failed to create vendor" });
    }
  });

  app.put("/api/admin/vendors/:id", async (req, res) => {
    try {
      const vendorId = req.params.id;
      const vendorData = req.body;
      
      const updatedVendor = await storage.updateVendor(vendorId, vendorData);
      if (!updatedVendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      
      res.json(updatedVendor);
    } catch (error) {
      console.error("Error updating vendor:", error);
      res.status(500).json({ error: "Failed to update vendor" });
    }
  });

  app.delete("/api/admin/vendors/:id", async (req, res) => {
    try {
      const vendorId = req.params.id;
      
      const deleted = await storage.deleteVendor(vendorId);
      if (!deleted) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      
      res.json({ success: true, id: vendorId });
    } catch (error) {
      console.error("Error deleting vendor:", error);
      res.status(500).json({ error: "Failed to delete vendor" });
    }
  });

  // AI Chat endpoint for real-time assistance
  app.post("/api/ai-chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message || !message.trim()) {
        return res.status(400).json({ error: "Message is required" });
      }

      const { generateAIResponse, generateContextualSuggestions } = await import("./openai");
      
      // Generate AI response
      const response = await generateAIResponse(message, context || {});
      
      // Generate contextual suggestions for follow-up
      const suggestions = await generateContextualSuggestions(context || {});
      
      res.json({
        response,
        suggestions: suggestions.slice(0, 3), // Limit to 3 suggestions
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('AI Chat error:', error);
      res.status(500).json({ 
        error: "I'm experiencing technical difficulties. Please try again.",
        response: "I'm currently unable to process your request. Please try asking your question differently or contact support if the issue persists.",
        suggestions: ["How to optimize costs?", "Industry best practices?", "Next steps recommendations?"]
      });
    }
  });

  // AI-powered event recommendations endpoint  
  app.post("/api/recommendations/events", async (req: any, res: any) => {
    try {
      console.log("Event recommendation request:", req.body);
      
      // Validate request body
      const validatedRequest = eventRecommendationRequest.parse(req.body);
      
      // Get AI recommendations
      const recommendations = await aiEventRecommender.getEventRecommendations(validatedRequest);
      
      res.json({
        success: true,
        recommendations: recommendations.recommendations,
        reasoning: recommendations.reasoning,
        totalCount: recommendations.totalCount,
        confidence: recommendations.confidence
      });
    } catch (error) {
      console.error("Event recommendation error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to get recommendations",
        message: "Unable to process your request. Please try again."
      });
    }
  });

  app.get('/api/download-tips-pdf', async (req: any, res: any) => {
    try {
      const { TwoPagePDFGenerator } = await import('./two-page-pdf-generator');
      const generator = new TwoPagePDFGenerator();
      const pdfBuffer = await generator.generateQuotePDF({} as any);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="exhibition-tips.pdf"');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });

  app.get('/api/download-guide-pdf', async (req: any, res: any) => {
    try {
      const { ROIPlanningGuideGenerator } = await import('./two-page-pdf-generator');
      const generator = new ROIPlanningGuideGenerator();
      const pdfBuffer = await generator.generateROIPlanningGuide({} as any);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="roi-planning-guide.pdf"');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });

  app.post('/api/download-ai-analysis-pdf', async (req: any, res: any) => {
    try {
      const { generateAIAnalysisPDF } = await import('./ai-analysis-generator');
      const pdfBuffer = await generateAIAnalysisPDF(req.body);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="ai-analysis-report.pdf"');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });

  app.post('/api/download-roi-guide-pdf', async (req: any, res: any) => {
    try {
      const { ROIPlanningGuideGenerator } = await import('./two-page-pdf-generator');
      const generator = new ROIPlanningGuideGenerator();
      const pdfBuffer = await generator.generateROIPlanningGuide(req.body);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="roi-planning-guide.pdf"');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });

  // For Vercel serverless, we don't need to create a server
  // Return null to indicate this is serverless
  return null;
}
