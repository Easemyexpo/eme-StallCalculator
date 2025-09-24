import { useState } from "react";
import { Plane, Hotel, Truck, Users, Clock, DollarSign, Star } from "lucide-react";
import { getMarketData, FlightOption, HotelOption, LogisticsOption } from "@/lib/travel-data";

interface TravelOptionsProps {
  formData: {
    teamSize: number;
    originCity: string;
    originState: string;
    destinationCity: string;
    destinationState: string;
    currency: string;
    eventDuration: number;
    eventType: string;
    boothSize: number;
    customSize?: number;
    boothType: string;
    venueType: string;
    distance: number;
  };
}

export function TravelOptions({ formData }: TravelOptionsProps) {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'logistics'>('flights');
  
  const destination = formData.destinationCity && formData.destinationState ? 
    `${formData.destinationCity}, ${formData.destinationState}` : "Selected Destination";
  
  // Get market-specific data with distance and team size for accurate pricing
  const marketData = getMarketData(formData.destinationState, formData.currency, formData.distance, formData.teamSize);
  const { flights: flightOptions, hotels: hotelOptions, logistics: logisticsOptions } = marketData;
  
  const isIndianMarket = formData.destinationState?.startsWith('IN-') || formData.currency === 'INR';
  const currencySymbol = formData.currency === 'INR' ? '₹' : formData.currency === 'USD' ? '$' : '€';

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
      />
    ));
  };

  const formatPrice = (price: number) => {
    return `${currencySymbol}${price.toLocaleString()}`;
  };

  return (
    <div className="glass-effect rounded-2xl p-6 animate-slide-up" data-testid="card-travel-options">
      <div className="flex items-center space-x-3 mb-6">
        <Plane className="w-6 h-6 text-primary" data-testid="icon-travel-options" />
        <h2 className="text-2xl font-semibold text-white" data-testid="title-travel-options">
          Travel Options for {destination}
        </h2>
      </div>

      {!formData.destinationCity && (
        <div className="text-center py-8 text-gray-400" data-testid="message-no-destination">
          <Plane className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <p>Please select your exhibition destination in Global Settings to view travel options.</p>
        </div>
      )}

      {formData.destinationCity && (
        <>
          {/* Tab Navigation */}
          <div className="flex mb-6 bg-gray-800/50 rounded-xl p-1" data-testid="nav-travel-tabs">
            <button
              onClick={() => setActiveTab('flights')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'flights' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
              data-testid="tab-flights"
            >
              <Plane className="w-4 h-4 inline mr-2" />
              Flights
            </button>
            <button
              onClick={() => setActiveTab('hotels')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'hotels' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
              data-testid="tab-hotels"
            >
              <Hotel className="w-4 h-4 inline mr-2" />
              Hotels
            </button>
            <button
              onClick={() => setActiveTab('logistics')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'logistics' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
              data-testid="tab-logistics"
            >
              <Truck className="w-4 h-4 inline mr-2" />
              Logistics
            </button>
          </div>

          {/* Team Size Info */}
          <div className="bg-primary/20 border border-primary/30 rounded-xl p-4 mb-6" data-testid="info-team-size">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-primary/80">
                Pricing calculated for <strong>{formData.teamSize}</strong> team member(s) 
                for <strong>{formData.eventDuration}</strong> day(s)
              </span>
            </div>
          </div>

          {/* Flight Options */}
          {activeTab === 'flights' && (
            <div className="space-y-4" data-testid="section-flights">
              <h3 className="text-lg font-semibold text-white mb-4">Available Flights</h3>
              {flightOptions.map((flight, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50" data-testid={`flight-option-${index}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-semibold text-white text-lg">{flight.airline}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          flight.type === 'business' ? 'bg-purple-500/20 text-purple-300' :
                          flight.type === 'first' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {flight.type.charAt(0).toUpperCase() + flight.type.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Departure</span>
                          <p className="text-white font-medium">{flight.departure}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Arrival</span>
                          <p className="text-white font-medium">{flight.arrival}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Duration</span>
                          <p className="text-white font-medium">{flight.duration}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Stops</span>
                          <p className="text-white font-medium">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s)`}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">{formatPrice(flight.price)}</div>
                      <div className="text-sm text-gray-400">per person</div>
                      <div className="text-lg font-semibold text-white mt-1">
                        Total: {formatPrice(flight.price * formData.teamSize)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hotel Options */}
          {activeTab === 'hotels' && (
            <div className="space-y-4" data-testid="section-hotels">
              <h3 className="text-lg font-semibold text-white mb-4">Recommended Hotels</h3>
              {hotelOptions.map((hotel, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50" data-testid={`hotel-option-${index}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-white text-lg">{hotel.name}</h4>
                        <div className="flex space-x-1">
                          {renderStars(hotel.rating)}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-2">{hotel.location}</p>
                      <p className="text-sm text-primary mb-3">{hotel.distanceToVenue}</p>
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.map((amenity, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-700/50 rounded-lg text-xs text-gray-300">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">{formatPrice(hotel.pricePerNight)}</div>
                      <div className="text-sm text-gray-400">per night</div>
                      <div className="text-lg font-semibold text-white mt-1">
                        Total: {formatPrice(hotel.pricePerNight * formData.eventDuration)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Logistics Options */}
          {activeTab === 'logistics' && (
            <div className="space-y-4" data-testid="section-logistics">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Logistics & Freight Services</h3>
                <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                  🚛 Shipping Route: <span className="font-semibold">{formData.originCity || 'Your Location'}</span> → <span className="font-semibold">{formData.destinationCity || 'Exhibition City'}</span>
                  <br />📦 Booth materials and promotional items delivery for your exhibition
                </div>
              </div>
              {logisticsOptions.map((logistics, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50" data-testid={`logistics-option-${index}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-lg mb-1">{logistics.company}</h4>
                      <p className="text-primary mb-2">{logistics.service}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{logistics.deliveryTime}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Includes:</p>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {logistics.includes.map((item, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">{formatPrice(logistics.estimatedCost)}</div>
                      <div className="text-sm text-gray-400">estimated cost</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}