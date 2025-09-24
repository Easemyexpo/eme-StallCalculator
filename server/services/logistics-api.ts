import type { LogisticsQuote, LogisticsQuoteRequest } from "@shared/schema";

// ShipEngine API for logistics quotes
export class ShipEngineService {
  private baseUrl = "https://api.shipengine.com/v1";
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.SHIPENGINE_API_KEY || "";
  }

  async getShippingRates(request: LogisticsQuoteRequest): Promise<LogisticsQuote[]> {
    if (!this.apiKey) {
      console.error("ShipEngine API key not found");
      return this.getFallbackQuotes(request);
    }

    try {
      const requestBody = {
        rate_options: {
          carrier_ids: ["se-123456"], // Example carrier ID
        },
        shipment: {
          validate_address: "no_validation",
          ship_to: {
            name: "Exhibition Venue",
            address_line1: "123 Exhibition Center",
            city_locality: request.destinationCity,
            state_province: "State",
            postal_code: "400001",
            country_code: "IN",
          },
          ship_from: {
            name: "Company",
            address_line1: "456 Business Center", 
            city_locality: request.originCity,
            state_province: "State",
            postal_code: "110001",
            country_code: "IN",
          },
          packages: [
            {
              weight: {
                value: request.weight,
                unit: "kilogram",
              },
              dimensions: {
                unit: "centimeter",
                length: request.dimensions.length,
                width: request.dimensions.width,
                height: request.dimensions.height,
              },
            },
          ],
        },
      };

      const response = await fetch(`${this.baseUrl}/rates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": this.apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.rate_response?.rates) {
        return data.rate_response.rates.map((rate: any) => ({
          id: rate.rate_id,
          provider: rate.carrier_friendly_name || "ShipEngine",
          serviceType: this.mapServiceType(rate.service_type),
          estimatedCost: parseFloat(rate.shipping_amount.amount),
          currency: rate.shipping_amount.currency,
          estimatedDays: rate.estimated_delivery_date ? 
            Math.ceil((new Date(rate.estimated_delivery_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 5,
          trackingAvailable: true,
          insurance: rate.insurance_amount?.amount > 0,
          weight: request.weight,
          dimensions: request.dimensions,
        }));
      }

      return this.getFallbackQuotes(request);
    } catch (error) {
      console.error("ShipEngine API error:", error);
      return this.getFallbackQuotes(request);
    }
  }

  private mapServiceType(serviceType: string): 'ground' | 'air' | 'express' {
    if (serviceType?.toLowerCase().includes('express')) return 'express';
    if (serviceType?.toLowerCase().includes('air')) return 'air';
    return 'ground';
  }

  private getFallbackQuotes(request: LogisticsQuoteRequest): LogisticsQuote[] {
    // Fallback with realistic Indian logistics pricing
    const baseRate = request.weight * 50; // ₹50 per kg base rate
    const distanceMultiplier = this.calculateDistanceMultiplier(request.originCity, request.destinationCity);
    
    return [
      {
        id: `ground_${Date.now()}`,
        provider: "Blue Dart Express",
        serviceType: "ground",
        estimatedCost: Math.round(baseRate * distanceMultiplier * 1.2),
        currency: "INR",
        estimatedDays: 3,
        trackingAvailable: true,
        insurance: true,
        weight: request.weight,
        dimensions: request.dimensions,
      },
      {
        id: `air_${Date.now()}`,
        provider: "Gati KWE",
        serviceType: "air",
        estimatedCost: Math.round(baseRate * distanceMultiplier * 2.5),
        currency: "INR",
        estimatedDays: 1,
        trackingAvailable: true,
        insurance: true,
        weight: request.weight,
        dimensions: request.dimensions,
      },
      {
        id: `express_${Date.now()}`,
        provider: "All Cargo Logistics",
        serviceType: "express",
        estimatedCost: Math.round(baseRate * distanceMultiplier * 3.2),
        currency: "INR",
        estimatedDays: 1,
        trackingAvailable: true,
        insurance: true,
        weight: request.weight,
        dimensions: request.dimensions,
      },
    ];
  }

  private calculateDistanceMultiplier(originCity: string, destinationCity: string): number {
    // Simplified distance calculation based on major Indian cities
    const distances: Record<string, Record<string, number>> = {
      "Mumbai": { "Delhi": 1.8, "Bangalore": 1.5, "Chennai": 1.6, "Kolkata": 2.0 },
      "Delhi": { "Mumbai": 1.8, "Bangalore": 2.1, "Chennai": 2.2, "Kolkata": 1.7 },
      "Bangalore": { "Mumbai": 1.5, "Delhi": 2.1, "Chennai": 1.2, "Kolkata": 2.3 },
      "Chennai": { "Mumbai": 1.6, "Delhi": 2.2, "Bangalore": 1.2, "Kolkata": 1.9 },
      "Kolkata": { "Mumbai": 2.0, "Delhi": 1.7, "Bangalore": 2.3, "Chennai": 1.9 },
    };

    return distances[originCity]?.[destinationCity] || 1.5;
  }
}

// EasyPost API as alternative
export class EasyPostService {
  private baseUrl = "https://api.easypost.com/v2";
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.EASYPOST_API_KEY || "";
  }

  async createShipment(request: LogisticsQuoteRequest): Promise<LogisticsQuote[]> {
    if (!this.apiKey) {
      console.error("EasyPost API key not found");
      return [];
    }

    try {
      const requestBody = {
        shipment: {
          to_address: {
            name: "Exhibition Venue",
            street1: "123 Exhibition Center",
            city: request.destinationCity,
            state: "State",
            zip: "400001",
            country: "IN",
          },
          from_address: {
            name: "Company",
            street1: "456 Business Center",
            city: request.originCity,
            state: "State", 
            zip: "110001",
            country: "IN",
          },
          parcel: {
            length: request.dimensions.length,
            width: request.dimensions.width,
            height: request.dimensions.height,
            weight: request.weight * 1000, // Convert to grams
          },
        },
      };

      const response = await fetch(`${this.baseUrl}/shipments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.rates) {
        return data.rates.slice(0, 3).map((rate: any) => ({
          id: rate.id,
          provider: rate.carrier || "EasyPost",
          serviceType: this.mapServiceType(rate.service),
          estimatedCost: parseFloat(rate.rate) * 83, // Convert USD to INR (approximate)
          currency: "INR",
          estimatedDays: rate.delivery_days || 5,
          trackingAvailable: true,
          insurance: false,
          weight: request.weight,
          dimensions: request.dimensions,
        }));
      }

      return [];
    } catch (error) {
      console.error("EasyPost API error:", error);
      return [];
    }
  }

  private mapServiceType(service: string): 'ground' | 'air' | 'express' {
    if (service?.toLowerCase().includes('express')) return 'express';
    if (service?.toLowerCase().includes('priority')) return 'air';
    return 'ground';
  }
}

export const shipEngineAPI = new ShipEngineService();
export const easyPostAPI = new EasyPostService();