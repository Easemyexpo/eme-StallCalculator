import { apiRequest } from "./queryClient";
import type { 
  Hotel, 
  Flight, 
  LogisticsQuote, 
  GeolocationData,
  HotelSearchRequest,
  FlightSearchRequest,
  LogisticsQuoteRequest 
} from "@shared/schema";

// External API client for real-time travel data
export class ExternalAPIClient {
  
  // Google Geocoding API
  async geocodeAddress(address: string): Promise<GeolocationData | null> {
    try {
      const response = await fetch('/api/geocode', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      return await response.json();
    } catch (error) {
      console.error("Geocoding failed:", error);
      return null;
    }
  }

  // Hotel Search - Real-time with city-based pricing
  async searchHotels(request: HotelSearchRequest): Promise<Hotel[]> {
    try {
      const response = await fetch('/api/hotels/search', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: request.city,
          checkIn: request.checkIn,
          checkOut: request.checkOut,
          guests: request.guests
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Hotel search failed:", error);
      return [];
    }
  }

  // Flight Search - Real-time with dynamic pricing
  async searchFlights(request: FlightSearchRequest): Promise<any> {
    try {
      const response = await fetch('/api/flights/search', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: request.originCity,
          destination: request.destinationCity,
          departureDate: request.departureDate,
          returnDate: request.returnDate,
          passengers: request.passengers
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Flight search failed:", error);
      return [];
    }
  }

  // Logistics Quotes - Real-time exhibition freight
  async getLogisticsQuotes(request: LogisticsQuoteRequest): Promise<LogisticsQuote[]> {
    try {
      const response = await fetch('/api/logistics/search', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: request.originCity,
          destination: request.destinationCity,
          weight: request.weight,
          dimensions: request.dimensions
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Logistics quote failed:", error);
      return [];
    }
  }

  // Distance Calculation - Google Distance Matrix
  async calculateDistance(origins: string[], destinations: string[]): Promise<any> {
    try {
      const response = await fetch('/api/distance', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origins, destinations }),
      });
      return await response.json();
    } catch (error) {
      console.error("Distance calculation failed:", error);
      return null;
    }
  }

  // Comprehensive Travel Data Search
  async searchComprehensiveTravel(params: {
    originCity: string;
    destinationCity: string;
    checkIn: string;
    checkOut: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    guests?: number;
    searchHotels?: boolean;
    searchFlights?: boolean;
    logistics?: LogisticsQuoteRequest;
  }): Promise<{
    hotels: Hotel[];
    flights: Flight[];
    logistics: LogisticsQuote[];
    distance: any;
    searchTimestamp: string;
  }> {
    try {
      const response = await fetch('/api/travel/comprehensive', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return await response.json();
    } catch (error) {
      console.error("Comprehensive travel search failed:", error);
      return {
        hotels: [],
        flights: [],
        logistics: [],
        distance: null,
        searchTimestamp: new Date().toISOString(),
      };
    }
  }
}

export const externalAPI = new ExternalAPIClient();

// Utility functions for external API integration
export const travelUtils = {
  // Format hotel data for display
  formatHotelPrice: (price: number, currency: string) => {
    const symbols: Record<string, string> = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
    };
    return `${symbols[currency] || currency} ${price.toLocaleString()}`;
  },

  // Format flight duration
  formatFlightDuration: (duration: string) => {
    if (duration.includes('H') && duration.includes('M')) {
      return duration.replace('PT', '').replace('H', 'h ').replace('M', 'm');
    }
    return duration;
  },

  // Calculate savings percentage
  calculateSavings: (originalPrice: number, currentPrice: number) => {
    const savings = ((originalPrice - currentPrice) / originalPrice) * 100;
    return Math.round(savings);
  },

  // Get airline logo URL (placeholder for now)
  getAirlineLogo: (airlineCode: string) => {
    const logos: Record<string, string> = {
      '6E': '/images/indigo-logo.png',
      'AI': '/images/airindia-logo.png',
      'SG': '/images/spicejet-logo.png',
      'UK': '/images/vistara-logo.png',
    };
    return logos[airlineCode] || '/images/default-airline.png';
  },

  // Validate date formats for API calls
  formatDateForAPI: (date: string) => {
    try {
      return new Date(date).toISOString().split('T')[0];
    } catch {
      return date;
    }
  },

  // Convert city names to standardized format
  standardizeCityName: (city: string) => {
    const cityMap: Record<string, string> = {
      'new delhi': 'New Delhi',
      'mumbai': 'Mumbai',
      'bangalore': 'Bangalore',
      'chennai': 'Chennai',
      'hyderabad': 'Hyderabad',
      'kolkata': 'Kolkata',
      'ahmedabad': 'Ahmedabad',
      'pune': 'Pune',
      'jaipur': 'Jaipur',
      'kochi': 'Kochi',
    };
    return cityMap[city.toLowerCase()] || city;
  },
};

// Error handling for external API failures
export const handleExternalAPIError = (error: any, apiName: string) => {
  console.error(`${apiName} API Error:`, error);
  
  if (error.message?.includes('401')) {
    return {
      error: `${apiName} authentication failed. Please check API credentials.`,
      code: 'AUTH_ERROR'
    };
  }
  
  if (error.message?.includes('429')) {
    return {
      error: `${apiName} rate limit exceeded. Please try again later.`,
      code: 'RATE_LIMIT'
    };
  }
  
  if (error.message?.includes('timeout')) {
    return {
      error: `${apiName} request timed out. Please try again.`,
      code: 'TIMEOUT'
    };
  }
  
  return {
    error: `${apiName} service temporarily unavailable.`,
    code: 'SERVICE_ERROR'
  };
};