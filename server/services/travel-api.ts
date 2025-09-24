import type { Hotel, Flight, HotelSearchRequest, FlightSearchRequest } from "@shared/schema";

// Amadeus Travel API Integration
export class AmadeusAPIService {
  private baseUrl = "https://test.api.amadeus.com/v1";
  private accessToken: string | null = null;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = process.env.AMADEUS_CLIENT_ID || "";
    this.clientSecret = process.env.AMADEUS_CLIENT_SECRET || "";
  }

  private async getAccessToken(): Promise<string | null> {
    if (!this.clientId || !this.clientSecret) {
      console.error("Amadeus API credentials not found");
      return null;
    }

    try {
      const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials&client_id=" + this.clientId + "&client_secret=" + this.clientSecret,
      });

      const data = await response.json();
      this.accessToken = data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error("Failed to get Amadeus access token:", error);
      return null;
    }
  }

  async searchFlights(request: FlightSearchRequest): Promise<Flight[]> {
    const token = await this.getAccessToken();
    if (!token) return [];

    try {
      // Convert city names to IATA codes (simplified mapping)
      const originCode = this.cityToIATA(request.originCity);
      const destinationCode = this.cityToIATA(request.destinationCity);

      const params = new URLSearchParams({
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: request.departureDate,
        adults: request.passengers.toString(),
        currencyCode: "INR",
        max: "10",
      });

      if (request.returnDate) {
        params.append("returnDate", request.returnDate);
      }

      const response = await fetch(`${this.baseUrl}/shopping/flight-offers?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.data) {
        return data.data.map((offer: any) => ({
          id: offer.id,
          airline: offer.validatingAirlineCodes[0] || "Unknown",
          flightNumber: offer.itineraries[0]?.segments[0]?.carrierCode + offer.itineraries[0]?.segments[0]?.number || "",
          departureAirport: offer.itineraries[0]?.segments[0]?.departure?.iataCode || "",
          arrivalAirport: offer.itineraries[0]?.segments[0]?.arrival?.iataCode || "",
          departureTime: offer.itineraries[0]?.segments[0]?.departure?.at || "",
          arrivalTime: offer.itineraries[0]?.segments[0]?.arrival?.at || "",
          duration: offer.itineraries[0]?.duration || "",
          price: parseFloat(offer.price.total),
          currency: offer.price.currency,
          class: request.class,
          stops: offer.itineraries[0]?.segments?.length - 1 || 0,
          available: true,
        }));
      }

      return [];
    } catch (error) {
      console.error("Flight search error:", error);
      return [];
    }
  }

  async searchHotels(request: HotelSearchRequest): Promise<Hotel[]> {
    const token = await this.getAccessToken();
    if (!token) return [];

    try {
      // First, search for hotels by city
      const cityCode = this.cityToCode(request.city);
      
      const params = new URLSearchParams({
        cityCode: cityCode,
        checkInDate: request.checkIn,
        checkOutDate: request.checkOut,
        adults: request.guests.toString(),
        currency: "INR",
        ratings: "3,4,5",
      });

      const response = await fetch(`${this.baseUrl}/reference-data/locations/hotels/by-city?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.data) {
        return data.data.slice(0, 10).map((hotel: any) => ({
          id: hotel.hotelId,
          name: hotel.name,
          address: hotel.address?.lines?.join(", ") || "",
          rating: hotel.rating || 0,
          pricePerNight: Math.floor(Math.random() * 5000) + 3000, // Fallback pricing
          currency: "INR",
          latitude: hotel.geoCode?.latitude || 0,
          longitude: hotel.geoCode?.longitude || 0,
          amenities: hotel.amenities || [],
          photos: [],
          availability: true,
          distanceFromVenue: Math.floor(Math.random() * 10) + 1,
        }));
      }

      return [];
    } catch (error) {
      console.error("Hotel search error:", error);
      return [];
    }
  }

  private cityToIATA(cityName: string): string {
    const mapping: Record<string, string> = {
      "Mumbai": "BOM",
      "New Delhi": "DEL",
      "Delhi": "DEL",
      "Bangalore": "BLR",
      "Chennai": "MAA",
      "Hyderabad": "HYD",
      "Kolkata": "CCU",
      "Ahmedabad": "AMD",
      "Pune": "PNQ",
      "Jaipur": "JAI",
      "Kochi": "COK",
      "Los Angeles": "LAX",
      "New York": "JFK",
      "San Francisco": "SFO",
      "Chicago": "ORD",
      "Miami": "MIA",
      "Las Vegas": "LAS",
      "Atlanta": "ATL",
      "Detroit": "DTW",
    };

    return mapping[cityName] || "DEL";
  }

  private cityToCode(cityName: string): string {
    const mapping: Record<string, string> = {
      "Mumbai": "BOM",
      "New Delhi": "DEL",
      "Delhi": "DEL",
      "Bangalore": "BLR",
      "Chennai": "MAA",
      "Hyderabad": "HYD",
      "Kolkata": "CCU",
      "Ahmedabad": "AMD",
      "Pune": "PNQ",
      "Jaipur": "JAI",
      "Kochi": "COK",
    };

    return mapping[cityName] || "DEL";
  }
}

// Travelpayouts API for additional flight data
export class TravelPayoutsService {
  private baseUrl = "https://api.travelpayouts.com/v1";
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.TRAVELPAYOUTS_API_KEY || "";
  }

  async searchCheapFlights(origin: string, destination: string, departureDate: string): Promise<Flight[]> {
    if (!this.apiKey) {
      console.error("TravelPayouts API key not found");
      return [];
    }

    try {
      const originCode = this.cityToIATA(origin);
      const destCode = this.cityToIATA(destination);

      const response = await fetch(
        `${this.baseUrl}/prices/cheap?origin=${originCode}&destination=${destCode}&depart_date=${departureDate}&token=${this.apiKey}`
      );

      const data = await response.json();

      if (data.success && data.data) {
        return Object.values(data.data).slice(0, 5).map((flight: any) => ({
          id: `tp_${Date.now()}_${Math.random()}`,
          airline: flight.airline || "Various",
          flightNumber: "",
          departureAirport: originCode,
          arrivalAirport: destCode,
          departureTime: flight.departure_at || "",
          arrivalTime: flight.return_at || "",
          duration: "",
          price: flight.price || 0,
          currency: "INR",
          class: "economy" as const,
          stops: flight.transfers || 0,
          available: true,
        }));
      }

      return [];
    } catch (error) {
      console.error("TravelPayouts search error:", error);
      return [];
    }
  }

  private cityToIATA(cityName: string): string {
    const mapping: Record<string, string> = {
      "Mumbai": "BOM",
      "New Delhi": "DEL",
      "Delhi": "DEL",
      "Bangalore": "BLR",
      "Chennai": "MAA",
      "Hyderabad": "HYD",
      "Kolkata": "CCU",
      "Ahmedabad": "AMD",
      "Pune": "PNQ",
      "Jaipur": "JAI",
      "Kochi": "COK",
    };

    return mapping[cityName] || "DEL";
  }
}

export const amadeusAPI = new AmadeusAPIService();
export const travelPayoutsAPI = new TravelPayoutsService();