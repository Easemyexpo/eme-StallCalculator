import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plane, Hotel, Truck, MapPin, Loader2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { externalAPI, travelUtils, handleExternalAPIError } from '@/lib/external-api';
import type { Hotel as HotelType, Flight, LogisticsQuote } from '@shared/schema';

interface ExternalDataPanelProps {
  formData: any;
  isVisible: boolean;
  onToggle: () => void;
}

export default function ExternalDataPanel({ formData, isVisible, onToggle }: ExternalDataPanelProps) {
  const [activeTab, setActiveTab] = useState<'hotels' | 'flights' | 'logistics'>('hotels');
  const queryClient = useQueryClient();
  
  // Real-time hotel search
  const {
    data: hotels,
    isLoading: hotelsLoading,
    error: hotelsError,
    refetch: refetchHotels,
  } = useQuery({
    queryKey: ['external-hotels', formData.destinationCity, formData.arrivalDate, formData.departureDate, formData.teamSize],
    queryFn: () => externalAPI.searchHotels({
      city: travelUtils.standardizeCityName(formData.destinationCity || ''),
      checkIn: travelUtils.formatDateForAPI(formData.arrivalDate || ''),
      checkOut: travelUtils.formatDateForAPI(formData.departureDate || ''),
      guests: formData.teamSize || 4,
    }),
    enabled: !!(formData.destinationCity && formData.arrivalDate && formData.departureDate && isVisible),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Real-time flight search
  const {
    data: flights,
    isLoading: flightsLoading,
    error: flightsError,
    refetch: refetchFlights,
  } = useQuery({
    queryKey: ['external-flights', formData.originCity, formData.destinationCity, formData.exhibitionStartDate, formData.teamSize],
    queryFn: () => externalAPI.searchFlights({
      originCity: travelUtils.standardizeCityName(formData.originCity || ''),
      destinationCity: travelUtils.standardizeCityName(formData.destinationCity || ''),
      departureDate: travelUtils.formatDateForAPI(formData.exhibitionStartDate || ''),
      returnDate: travelUtils.formatDateForAPI(formData.departureDate || ''),
      passengers: formData.teamSize || 4,
      class: 'economy',
    }),
    enabled: !!(formData.originCity && formData.destinationCity && formData.exhibitionStartDate && isVisible),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });

  // Real-time logistics quotes
  const {
    data: logistics,
    isLoading: logisticsLoading,
    error: logisticsError,
    refetch: refetchLogistics,
  } = useQuery({
    queryKey: ['external-logistics', formData.originCity, formData.destinationCity, formData.boothSize],
    queryFn: () => externalAPI.getLogisticsQuotes({
      originCity: travelUtils.standardizeCityName(formData.originCity || ''),
      destinationCity: travelUtils.standardizeCityName(formData.destinationCity || ''),
      weight: (formData.boothSize || 18) * 25, // Estimate 25kg per sqm
      dimensions: {
        length: 200,
        width: 100,
        height: 150,
      },
      serviceType: 'ground',
    }),
    enabled: !!(formData.originCity && formData.destinationCity && formData.boothSize && isVisible),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  if (!isVisible) {
    return (
      <div className="mb-6">
        <button
          onClick={onToggle}
          className="w-full glass-effect rounded-xl p-4 text-white hover:bg-emerald-500/10 transition-all duration-300"
          data-testid="button-show-external-data"
        >
          <div className="flex items-center justify-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Show Live Travel Data</span>
            <span className="text-emerald-400">(Hotels • Flights • Logistics)</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 glass-effect rounded-xl p-6" data-testid="panel-external-data">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Live Travel Data</h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors"
          data-testid="button-hide-external-data"
        >
          ✕
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        {[
          { key: 'hotels', label: 'Hotels', icon: Hotel, count: hotels?.length },
          { key: 'flights', label: 'Flights', icon: Plane, count: flights?.length },
          { key: 'logistics', label: 'Logistics', icon: Truck, count: logistics?.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.key
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            data-testid={`tab-${tab.key}`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="bg-emerald-500/30 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Hotels Tab */}
      {activeTab === 'hotels' && (
        <div data-testid="content-hotels">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Available Hotels</h4>
            <button
              onClick={() => refetchHotels()}
              disabled={hotelsLoading}
              className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-all disabled:opacity-50"
              data-testid="button-refresh-hotels"
            >
              <RefreshCw className={`w-4 h-4 ${hotelsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          
          {hotelsLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="ml-2 text-gray-400">Searching hotels...</span>
            </div>
          )}
          
          {hotelsError && (
            <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">
                {handleExternalAPIError(hotelsError, 'Hotel').error}
              </span>
            </div>
          )}

          {hotels && hotels.length > 0 && (
            <div className="space-y-3">
              {hotels.slice(0, 5).map((hotel: HotelType) => (
                <div key={hotel.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-white">{hotel.name}</h4>
                      <p className="text-sm text-gray-400">{hotel.address}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(Math.floor(hotel.rating))}
                        </div>
                        <span className="text-sm text-gray-400">{hotel.rating}/5</span>
                        <span className="text-sm text-emerald-400">
                          {hotel.distanceFromVenue}km from venue
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">
                        {travelUtils.formatHotelPrice(hotel.pricePerNight, hotel.currency)}
                      </div>
                      <div className="text-sm text-gray-400">per night</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Flights Tab */}
      {activeTab === 'flights' && (
        <div data-testid="content-flights">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Available Flights</h4>
            <button
              onClick={() => refetchFlights()}
              disabled={flightsLoading}
              className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-all disabled:opacity-50"
              data-testid="button-refresh-flights"
            >
              <RefreshCw className={`w-4 h-4 ${flightsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          
          {flightsLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="ml-2 text-gray-400">Searching flights...</span>
            </div>
          )}
          
          {flightsError && (
            <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">
                {handleExternalAPIError(flightsError, 'Flight').error}
              </span>
            </div>
          )}

          {flights && (flights.outbound || flights.length > 0) && (
            <div className="space-y-4">
              {/* Outbound flights */}
              {flights.outbound && (
                <div>
                  <h4 className="text-white font-semibold mb-3">Outbound Flights</h4>
                  <div className="space-y-3">
                    {flights.outbound.slice(0, 3).map((flight: any, index: number) => (
                      <div key={`outbound-${index}`} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-white">{flight.airline}</h4>
                              <span className="text-sm text-gray-400">{flight.flightNumber}</span>
                            </div>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-emerald-400">{flight.departure}</span>
                              <span className="text-gray-400">→</span>
                              <span className="text-emerald-400">{flight.arrival}</span>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              {flight.duration} • {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`} • {flight.aircraft}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-400">
                              ₹{flight.price?.toLocaleString() || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-400">per person</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Return flights */}
              {flights.return && flights.return.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-3">Return Flights</h4>
                  <div className="space-y-3">
                    {flights.return.slice(0, 2).map((flight: any, index: number) => (
                      <div key={`return-${index}`} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-white">{flight.airline}</h4>
                              <span className="text-sm text-gray-400">{flight.flightNumber}</span>
                            </div>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-emerald-400">{flight.departure}</span>
                              <span className="text-gray-400">→</span>
                              <span className="text-emerald-400">{flight.arrival}</span>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              {flight.duration} • {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`} • {flight.aircraft}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-400">
                              ₹{flight.price?.toLocaleString() || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-400">per person</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Logistics Tab */}
      {activeTab === 'logistics' && (
        <div data-testid="content-logistics">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Logistics Providers</h4>
            <button
              onClick={() => refetchLogistics()}
              disabled={logisticsLoading}
              className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-all disabled:opacity-50"
              data-testid="button-refresh-logistics"
            >
              <RefreshCw className={`w-4 h-4 ${logisticsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          
          {logisticsLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="ml-2 text-gray-400">Getting logistics quotes...</span>
            </div>
          )}
          
          {logisticsError && (
            <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">
                {handleExternalAPIError(logisticsError, 'Logistics').error}
              </span>
            </div>
          )}

          {logistics && logistics.length > 0 && (
            <div className="space-y-3">
              {logistics.map((quote: LogisticsQuote) => (
                <div key={quote.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-white">{quote.provider}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded capitalize">
                          {quote.serviceType}
                        </span>
                        {quote.trackingAvailable && (
                          <span className="text-sm bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                            Tracking
                          </span>
                        )}
                        {quote.insurance && (
                          <span className="text-sm bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                            Insured
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 mt-2">
                        {quote.estimatedDays ? `${quote.estimatedDays} days` : 'Delivery time on request'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">
                        ₹{quote.estimatedCost?.toLocaleString() || 'Quote on request'}
                      </div>
                      <div className="text-sm text-gray-400">per shipment</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Data Source Attribution */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <CheckCircle className="w-3 h-3" />
          <span>Live data from Google Places, Amadeus, TravelPayouts, and ShipEngine APIs</span>
        </div>
      </div>
    </div>
  );
}