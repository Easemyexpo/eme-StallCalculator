import { useState } from "react";
import { Plane, Hotel, Truck, Clock, Star, MapPin, Phone, Mail, RefreshCw, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface RealTimeTravelProps {
  formData: {
    originCity: string;
    originState: string;
    destinationCity: string;
    destinationState: string;
    teamSize: number;
    eventDuration: number;
    arrivalDate?: string;
    departureDate?: string;
  };
  selectedFlights?: any;
  setSelectedFlights?: (flights: any) => void;
  showReturnFlights?: boolean;
  setShowReturnFlights?: (show: boolean) => void;
}

interface Flight {
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  currency: string;
  stops: number;
  aircraft: string;
  available: boolean;
}

interface Hotel {
  name: string;
  location: string;
  rating: number;
  price: number;
  currency: string;
  amenities: string[];
  distanceToVenue: string;
  available: boolean;
  cancellationPolicy: string;
}

interface Logistics {
  provider: string;
  service: string;
  estimatedDelivery: string;
  price: number;
  currency: string;
  tracking: boolean;
  insurance: boolean;
  pickupAvailable: boolean;
  specialServices: string[];
  contact: {
    phone: string;
    email: string;
  };
}

export function RealTimeTravel({ formData }: RealTimeTravelProps) {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'logistics'>('flights');

  // Real-time flight search
  const { data: flightData, isLoading: flightsLoading, refetch: refetchFlights } = useQuery({
    queryKey: ['flights', formData.originCity, formData.destinationCity, formData.teamSize],
    queryFn: async () => {
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: `${formData.originCity}, ${formData.originState}`,
          destination: `${formData.destinationCity}, ${formData.destinationState}`,
          departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          returnDate: new Date(Date.now() + (7 + formData.eventDuration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          passengers: formData.teamSize
        })
      });
      return response.json();
    },
    enabled: !!formData.originCity && !!formData.destinationCity && formData.teamSize > 0
  });

  // Real-time hotel search
  const { data: hotelData, isLoading: hotelsLoading, refetch: refetchHotels } = useQuery({
    queryKey: ['hotels', formData.destinationCity, formData.teamSize, formData.eventDuration],
    queryFn: async () => {
      const response = await fetch('/api/hotels/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: `${formData.destinationCity}, ${formData.destinationState}`,
          checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          checkOut: new Date(Date.now() + (7 + formData.eventDuration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          rooms: Math.ceil(formData.teamSize / 2),
          guests: formData.teamSize
        })
      });
      return response.json();
    },
    enabled: !!formData.destinationCity && formData.teamSize > 0
  });

  // Real-time logistics search
  const { data: logisticsData, isLoading: logisticsLoading, refetch: refetchLogistics } = useQuery({
    queryKey: ['logistics', formData.originCity, formData.destinationCity],
    queryFn: async () => {
      const response = await fetch('/api/logistics/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: `${formData.originCity}, ${formData.originState}`,
          destination: `${formData.destinationCity}, ${formData.destinationState}`,
          cargoType: 'exhibition_materials',
          weight: 500, // kg
          dimensions: { length: 200, width: 100, height: 150 }
        })
      });
      return response.json();
    },
    enabled: !!formData.originCity && !!formData.destinationCity
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  if (!formData.originCity || !formData.destinationCity) {
    return (
      <div className="glass-effect rounded-2xl p-8 text-center">
        <div className="bg-emerald-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Plane className="w-10 h-10 text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">Real-Time Travel Data</h3>
        <p className="text-gray-300 leading-relaxed">Please select origin and destination cities to see live flight tickets, hotel rates, and logistics options</p>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-2xl p-6 animate-slide-up" data-testid="real-time-travel">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/20 rounded-full p-2">
            <Plane className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Real-Time Travel Options</h2>
            <p className="text-emerald-400 text-sm font-medium">Live pricing & availability</p>
          </div>
        </div>
        <div className="bg-emerald-500/10 px-3 py-2 rounded-full">
          <div className="text-sm text-emerald-300 flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>Updated {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="flex mb-8 bg-slate-800/60 backdrop-blur-sm rounded-2xl p-2 border border-emerald-500/20">
        <button
          onClick={() => setActiveTab('flights')}
          className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'flights' 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
              : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <Plane className="w-5 h-5 inline mr-3" />
          <span className="text-base">Flights</span>
        </button>
        <button
          onClick={() => setActiveTab('hotels')}
          className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'hotels' 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
              : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <Hotel className="w-5 h-5 inline mr-3" />
          <span className="text-base">Hotels</span>
        </button>
        <button
          onClick={() => setActiveTab('logistics')}
          className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'logistics' 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
              : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <Truck className="w-5 h-5 inline mr-3" />
          <span className="text-base">Logistics</span>
        </button>
      </div>

      {/* Flight Results */}
      {activeTab === 'flights' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Available Flights</h3>
            <button
              onClick={() => refetchFlights()}
              className="flex items-center space-x-2 px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
          
          {flightsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
              <span className="text-gray-300">Searching flights...</span>
            </div>
          ) : flightData?.outbound && flightData.outbound.length > 0 ? (
            <div className="space-y-4">
              {flightData.outbound.map((flight: Flight, index: number) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-white text-lg">{flight.airline}</span>
                        <span className="text-sm text-gray-400">{flight.flightNumber}</span>
                        <span className="text-sm text-gray-400">{flight.aircraft}</span>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{flight.departure} - {flight.arrival}</span>
                        </div>
                        <span>{flight.duration}</span>
                        <span>{flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s)`}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ₹{(flight.price * (formData?.teamSize || 1)).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">for {formData?.teamSize || 1} people</div>
                      <div className="text-xs text-gray-500">₹{flight.price.toLocaleString()} per person</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Plane className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No flights available for the selected route</p>
              <button 
                onClick={() => refetchFlights()}
                className="mt-3 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hotel Results */}
      {activeTab === 'hotels' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Available Hotels</h3>
            <button
              onClick={() => refetchHotels()}
              className="flex items-center space-x-2 px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
          
          {hotelsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
              <span className="text-gray-300">Searching hotels...</span>
            </div>
          ) : hotelData && hotelData.length > 0 ? (
            <div className="space-y-4">
              {hotelData.map((hotel: Hotel, index: number) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-white text-lg">{hotel.name}</h4>
                        <div className="flex items-center space-x-1">
                          {renderStars(hotel.rating)}
                          <span className="text-sm text-gray-400 ml-1">{hotel.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{hotel.location}</span>
                      </div>
                      <p className="text-sm text-primary mb-3">{hotel.distanceToVenue}</p>
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.slice(0, 4).map((amenity, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-700/50 rounded-lg text-xs text-gray-300">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ₹{(hotel.price * Math.ceil((formData?.teamSize || 1) / 2) * (() => {
                          if (formData?.arrivalDate && formData?.departureDate) {
                            const arrival = new Date(formData.arrivalDate);
                            const departure = new Date(formData.departureDate);
                            const diffTime = Math.abs(departure.getTime() - arrival.getTime());
                            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          }
                          return formData?.eventDuration || 3;
                        })()).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">{Math.ceil((formData?.teamSize || 1) / 2)} rooms • {(() => {
                        if (formData?.arrivalDate && formData?.departureDate) {
                          const arrival = new Date(formData.arrivalDate);
                          const departure = new Date(formData.departureDate);
                          const diffTime = Math.abs(departure.getTime() - arrival.getTime());
                          return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        }
                        return formData?.eventDuration || 3;
                      })()} nights</div>
                      <div className="text-xs text-gray-500">₹{hotel.price.toLocaleString()} per room/night</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Hotel className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No hotels available for the selected destination</p>
              <button 
                onClick={() => refetchHotels()}
                className="mt-3 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Logistics Results */}
      {activeTab === 'logistics' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Logistics Providers</h3>
            <button
              onClick={() => refetchLogistics()}
              className="flex items-center space-x-2 px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
          
          {logisticsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
              <span className="text-gray-300">Finding logistics providers...</span>
            </div>
          ) : logisticsData && logisticsData.length > 0 ? (
            <div className="space-y-4">
              {logisticsData.map((logistics: Logistics, index: number) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-lg mb-1">{logistics.provider}</h4>
                      <p className="text-primary mb-2">{logistics.service}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{logistics.estimatedDelivery}</span>
                        </div>
                        <span>{logistics.tracking ? '✓ Tracking' : ''}</span>
                        <span>{logistics.insurance ? '✓ Insurance' : ''}</span>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-400 mb-2">Services:</p>
                        <div className="flex flex-wrap gap-1">
                          {logistics.specialServices.map((service, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-700/50 rounded-lg text-xs text-gray-300">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{logistics.contact.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{logistics.contact.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ₹{logistics.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">estimated cost</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Truck className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No logistics providers available for this route</p>
              <button 
                onClick={() => refetchLogistics()}
                className="mt-3 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}