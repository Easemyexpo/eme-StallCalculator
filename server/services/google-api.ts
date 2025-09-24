import type { GeolocationData } from "@shared/schema";

// Google APIs integration
export class GoogleAPIService {
  private baseUrl = "https://maps.googleapis.com/maps/api";
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || "";
    if (!this.apiKey) {
      console.warn("Google Maps API key not found. Some features may not work.");
    }
  }

  // Geocoding API - Convert address to coordinates
  async geocodeAddress(address: string): Promise<GeolocationData | null> {
    if (!this.apiKey) {
      console.error("Google Maps API key required for geocoding");
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === "OK" && data.results.length > 0) {
        const result = data.results[0];
        const location = result.geometry.location;
        const components = result.address_components;
        
        return {
          latitude: location.lat,
          longitude: location.lng,
          address: result.formatted_address,
          city: this.extractComponent(components, "locality") || "",
          state: this.extractComponent(components, "administrative_area_level_1") || "",
          country: this.extractComponent(components, "country") || "",
          postalCode: this.extractComponent(components, "postal_code") || "",
        };
      }
      
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  }

  // Places API - Search for hotels near location
  async searchHotelsNear(latitude: number, longitude: number, radius = 5000) {
    if (!this.apiKey) {
      console.error("Google Maps API key required for places search");
      return [];
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=lodging&key=${this.apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === "OK") {
        return data.results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          rating: place.rating || 0,
          photos: place.photos?.map((photo: any) => 
            `${this.baseUrl}/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.apiKey}`
          ) || [],
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          priceLevel: place.price_level,
        }));
      }
      
      return [];
    } catch (error) {
      console.error("Places search error:", error);
      return [];
    }
  }

  // Distance Matrix API - Calculate travel distances
  async calculateDistance(origins: string[], destinations: string[]) {
    if (!this.apiKey) {
      console.error("Google Maps API key required for distance calculation");
      return null;
    }

    try {
      const originsStr = origins.join("|");
      const destinationsStr = destinations.join("|");
      
      const response = await fetch(
        `${this.baseUrl}/distancematrix/json?origins=${encodeURIComponent(originsStr)}&destinations=${encodeURIComponent(destinationsStr)}&key=${this.apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === "OK") {
        return data.rows.map((row: any) => 
          row.elements.map((element: any) => ({
            distance: element.distance?.value || 0,
            duration: element.duration?.value || 0,
            distanceText: element.distance?.text || "",
            durationText: element.duration?.text || "",
            status: element.status,
          }))
        );
      }
      
      return null;
    } catch (error) {
      console.error("Distance calculation error:", error);
      return null;
    }
  }

  private extractComponent(components: any[], type: string): string | null {
    const component = components.find(comp => comp.types.includes(type));
    return component ? component.long_name : null;
  }
}

export const googleAPI = new GoogleAPIService();