const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

const mockVendors = [
  {
    id: "vendor_1",
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
    id: "vendor_2",
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
    id: "vendor_3",
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
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

// Calculate costs endpoint
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
    
    // Generate smart vendor recommendations with match scores
    const smartVendors = mockVendors.map(vendor => ({
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
    
    // Simple search logic
    let matchingVendors = mockVendors;
    
    if (query) {
      matchingVendors = matchingVendors.filter(vendor => 
        vendor.name.toLowerCase().includes(query.toLowerCase()) ||
        vendor.description?.toLowerCase().includes(query.toLowerCase()) ||
        vendor.specialties?.some(specialty => 
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
    res.json(mockVendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

app.post("/api/admin/vendors", async (req, res) => {
  try {
    const vendorData = req.body;
    const newVendor = {
      id: `vendor_${Date.now()}`,
      ...vendorData,
      isActive: vendorData.isActive !== false
    };
    res.json(newVendor);
  } catch (error) {
    console.error("Error creating vendor:", error);
    res.status(500).json({ error: "Failed to create vendor" });
  }
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simple mock authentication
    if (email === 'admin@example.com' && password === 'admin123') {
      res.json({ 
        success: true, 
        user: {
          id: 'mock-user-123',
          email: 'admin@example.com',
          firstName: 'Demo',
          lastName: 'User',
          profileImageUrl: null
        },
        message: 'Login successful' 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logout successful' });
});

app.get('/api/auth/user', (req, res) => {
  try {
    // Return mock user for now
    res.json({
      id: 'mock-user-123',
      email: 'admin@example.com',
      firstName: 'Demo',
      lastName: 'User',
      profileImageUrl: null
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Workspace routes
app.post('/api/workspaces', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const workspace = {
      id: `workspace_${Date.now()}`,
      name,
      description,
      ownerId: 'mock-user-123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.json(workspace);
  } catch (error) {
    console.error("Error creating workspace:", error);
    res.status(500).json({ message: "Failed to create workspace" });
  }
});

app.get('/api/workspaces', async (req, res) => {
  try {
    // Mock workspaces
    const workspaces = [
      {
        id: 'workspace_1',
        name: 'Demo Workspace',
        description: 'Sample workspace for testing',
        ownerId: 'mock-user-123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    res.json(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    res.status(500).json({ message: "Failed to fetch workspaces" });
  }
});

// Project routes
app.post('/api/workspaces/:workspaceId/projects', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name, description, budget, currency, settings } = req.body;
    
    const project = {
      id: `project_${Date.now()}`,
      workspaceId,
      name,
      description,
      budget,
      currency,
      settings,
      createdBy: 'mock-user-123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
});

app.get('/api/workspaces/:workspaceId/projects', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    
    // Mock projects
    const projects = [
      {
        id: 'project_1',
        workspaceId,
        name: 'Sample Exhibition Project',
        description: 'A sample project for testing',
        budget: 500000,
        currency: 'INR',
        settings: {},
        createdBy: 'mock-user-123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

// Event recommendations endpoint
app.post("/api/recommendations/events", async (req, res) => {
  try {
    console.log("Event recommendation request:", req.body);
    
    // Mock event recommendations
    const recommendations = {
      recommendations: [
        {
          id: "event_1",
          name: "Tech Expo 2024",
          location: "Mumbai, India",
          date: "2024-12-15",
          industry: "Technology",
          estimatedCost: 500000,
          expectedROI: 300,
          matchScore: 95
        },
        {
          id: "event_2", 
          name: "Auto Trade Show",
          location: "Delhi, India",
          date: "2024-11-20",
          industry: "Automotive",
          estimatedCost: 750000,
          expectedROI: 250,
          matchScore: 88
        }
      ],
      reasoning: "Based on your industry and budget, these events show high potential for ROI",
      totalCount: 2,
      confidence: 0.85
    };
    
    res.json({
      success: true,
      ...recommendations
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

// AI Chat endpoint for real-time assistance
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Mock AI response
    const response = `Thank you for your message: "${message}". This is a mock AI response. In a real implementation, this would connect to OpenAI or another AI service.`;
    
    const suggestions = [
      "How to optimize costs?",
      "Industry best practices?", 
      "Next steps recommendations?"
    ];
    
    res.json({
      response,
      suggestions: suggestions.slice(0, 3),
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

// Serve static files from client build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// For Vercel, we need to export the app as default
module.exports = app;
