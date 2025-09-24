import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plane, Clock, CheckCircle, Plus, Minus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface FlightSelectionProps {
  formData: any;
  onFlightSelect: (flights: any) => void;
  selectedFlights: any;
}

export function FlightSelection({ formData, onFlightSelect, selectedFlights }: FlightSelectionProps) {
  const [searchTrigger, setSearchTrigger] = useState(0);

  const { data: flightData, isLoading, refetch } = useQuery({
    queryKey: ['flight-search', formData.originCity, formData.destinationCity, formData.teamSize, searchTrigger],
    queryFn: async () => {
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: formData.originCity,
          destination: formData.destinationCity,
          departureDate: formData.arrivalDate,
          returnDate: formData.departureDate,
          passengers: formData.teamSize
        })
      });
      const data = await response.json();
      console.log('Flight API Response:', data);
      return data;
    },
    enabled: !!(formData.originCity && formData.destinationCity && formData.arrivalDate)
  });

  const handleFlightSelect = (flight: Flight, type: 'outbound' | 'return') => {
    console.log('Selecting flight:', flight, 'type:', type);
    const updated = { ...selectedFlights };
    updated[type] = flight;
    console.log('Updated flights object:', updated);
    onFlightSelect(updated);
  };

  const removeFlightSelection = (type: 'outbound' | 'return') => {
    const updated = { ...selectedFlights };
    delete updated[type];
    onFlightSelect(updated);
  };

  const searchFlights = () => {
    setSearchTrigger(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-600 mt-2">Searching flights...</p>
      </div>
    );
  }

  // Check if required data is available
  if (!formData.originCity || !formData.destinationCity) {
    return (
      <div className="text-center py-8">
        <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Flight Selection</h3>
        <p className="text-gray-600 mb-4">Please go back and complete your departure and arrival cities to search for flights.</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Complete Location Details
        </Button>
      </div>
    );
  }

  if (!formData.arrivalDate || !formData.departureDate) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Travel Dates Required</h3>
        <p className="text-gray-600 mb-4">Please go back to the "Dates & Duration" tab and set your travel dates to search for flights.</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Set Travel Dates
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selected Flights Summary */}
      {(selectedFlights.outbound || selectedFlights.return) && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            Selected Flights
          </h3>
          <div className="space-y-2">
            {selectedFlights.outbound && (
              <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-100">
                <div className="flex items-center space-x-3">
                  <Plane className="w-4 h-4 text-green-600" />
                  <div>
                    <span className="font-medium text-gray-900">
                      {selectedFlights.outbound.airline} {selectedFlights.outbound.flightNumber}
                    </span>
                    <div className="text-sm text-gray-600">
                      {selectedFlights.outbound.departure} → {selectedFlights.outbound.arrival}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    ₹{(selectedFlights.outbound.price * formData.teamSize).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">total for {formData.teamSize} people</div>
                </div>
              </div>
            )}
            {selectedFlights.return && (
              <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-100">
                <div className="flex items-center space-x-3">
                  <Plane className="w-4 h-4 text-green-600 transform rotate-180" />
                  <div>
                    <span className="font-medium text-gray-900">
                      {selectedFlights.return.airline} {selectedFlights.return.flightNumber}
                    </span>
                    <div className="text-sm text-gray-600">
                      {selectedFlights.return.departure} → {selectedFlights.return.arrival}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    ₹{(selectedFlights.return.price * formData.teamSize).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">total for {formData.teamSize} people</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Available Flights</h3>
        <Button 
          onClick={searchFlights}
          variant="outline" 
          className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
        >
          <Plane className="w-4 h-4 mr-2" />
          Search Flights
        </Button>
      </div>



      {/* Available Flights */}
      {flightData && (
        <div className="space-y-6">
          {/* Outbound Flights */}
          {(flightData.outbound || flightData.flights) && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Outbound Flights</h4>
              <div className="space-y-3">
                {(flightData.outbound || flightData.flights).map((flight: Flight, index: number) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedFlights?.outbound?.flightNumber === flight.flightNumber
                        ? 'bg-green-50 border-green-500 shadow-lg'
                        : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
                    }`}
                    onClick={() => handleFlightSelect(flight, 'outbound')}
                    data-testid={`flight-outbound-${index}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-900">{flight.airline}</span>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{flight.flightNumber}</span>
                          {selectedFlights?.outbound?.flightNumber === flight.flightNumber && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-600 font-medium">{flight.departure} → {flight.arrival}</span>
                          <span className="text-gray-600 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {flight.duration}
                          </span>
                          <span className="text-gray-600">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">₹{(flight.price * formData.teamSize).toLocaleString()}</div>
                        <div className="text-sm text-gray-500">total for {formData.teamSize} people</div>
                        <div className="text-xs text-gray-400">₹{flight.price?.toLocaleString()} per person</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Return Flights */}
          {flightData.return && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Return Flights</h4>
              <div className="space-y-3">
                {flightData.return.map((flight: Flight, index: number) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedFlights?.return?.flightNumber === flight.flightNumber
                        ? 'bg-green-50 border-green-500 shadow-lg'
                        : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
                    }`}
                    onClick={() => handleFlightSelect(flight, 'return')}
                    data-testid={`flight-return-${index}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-900">{flight.airline}</span>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{flight.flightNumber}</span>
                          {selectedFlights?.return?.flightNumber === flight.flightNumber && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-600 font-medium">{flight.departure} → {flight.arrival}</span>
                          <span className="text-gray-600 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {flight.duration}
                          </span>
                          <span className="text-gray-600">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">₹{(flight.price * formData.teamSize).toLocaleString()}</div>
                        <div className="text-sm text-gray-500">total for {formData.teamSize} people</div>
                        <div className="text-xs text-gray-400">₹{flight.price?.toLocaleString()} per person</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No flights available message */}
      {flightData && !flightData.outbound && !flightData.flights && (
        <div className="text-center py-8">
          <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No flights available</h3>
          <p className="text-gray-600 mb-4">No flights found for the selected route and dates.</p>
          <Button variant="outline" onClick={searchFlights}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}