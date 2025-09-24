import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plane, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
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

interface ReturnFlightSelectionProps {
  formData: any;
  onFlightSelect: (flights: any) => void;
  selectedFlights: any;
  onBack: () => void;
}

export function ReturnFlightSelection({ formData, onFlightSelect, selectedFlights, onBack }: ReturnFlightSelectionProps) {
  const [searchTrigger, setSearchTrigger] = useState(0);

  const { data: flightData, isLoading } = useQuery({
    queryKey: ['return-flight-search', formData.destinationCity, formData.originCity, formData.teamSize, searchTrigger],
    queryFn: async () => {
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: formData.destinationCity, // Return journey
          destination: formData.originCity,
          departureDate: formData.departureDate,
          passengers: formData.teamSize
        })
      });
      return response.json();
    },
    enabled: !!(formData.destinationCity && formData.originCity && formData.departureDate)
  });

  const handleReturnFlightSelect = (flight: Flight) => {
    const updated = { ...selectedFlights };
    updated.return = flight;
    onFlightSelect(updated);
  };

  const removeReturnSelection = () => {
    const updated = { ...selectedFlights };
    delete updated.return;
    onFlightSelect(updated);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-600 mt-2">Searching return flights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Outbound</span>
        </Button>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Select Return Flight</h3>
          <p className="text-gray-600">{formData.destinationCity} → {formData.originCity}</p>
        </div>
      </div>

      {/* Selected Outbound Flight Summary */}
      {selectedFlights.outbound && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-green-800 mb-2">Selected Outbound Flight</h4>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{selectedFlights.outbound.airline} {selectedFlights.outbound.flightNumber}</p>
              <p className="text-sm text-gray-600">
                {selectedFlights.outbound.departure} - {selectedFlights.outbound.arrival} ({selectedFlights.outbound.duration})
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{selectedFlights.outbound.currency} {selectedFlights.outbound.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">per person</p>
            </div>
          </div>
        </div>
      )}

      {/* Return Flight Options */}
      {flightData?.outbound && flightData.outbound.length > 0 ? (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Available Return Flights</h4>
          {flightData.outbound.map((flight: Flight, index: number) => (
            <div 
              key={index}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedFlights.return?.flightNumber === flight.flightNumber
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleReturnFlightSelect(flight)}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Plane className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{flight.airline}</h4>
                      <p className="text-sm text-gray-600">{flight.flightNumber} • {flight.aircraft}</p>
                    </div>
                    {selectedFlights.return?.flightNumber === flight.flightNumber && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Departure</p>
                      <p className="font-medium">{flight.departure}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Duration</p>
                      <div className="flex items-center justify-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">{flight.duration}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Arrival</p>
                      <p className="font-medium">{flight.arrival}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        flight.stops === 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        flight.available 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {flight.available ? 'Available' : 'Limited'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">
                        {flight.currency} {flight.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per person</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Return Flights Found</h3>
          <p className="text-gray-600">Please check your return date and try again.</p>
        </div>
      )}

      {/* Selected Return Flight */}
      {selectedFlights.return && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Selected Return Flight</h4>
              <p className="font-medium">{selectedFlights.return.airline} {selectedFlights.return.flightNumber}</p>
              <p className="text-sm text-gray-600">
                {selectedFlights.return.departure} - {selectedFlights.return.arrival} ({selectedFlights.return.duration})
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-blue-800">
                {selectedFlights.return.currency} {selectedFlights.return.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">per person</p>
              <Button
                variant="outline" 
                size="sm"
                onClick={removeReturnSelection}
                className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Skip Return Flight Option */}
      <div className="border-t pt-4">
        <Button
          variant="outline"
          onClick={() => {
            const updated = { ...selectedFlights };
            updated.oneWay = true;
            onFlightSelect(updated);
          }}
          className="w-full"
        >
          Skip Return Flight (One-way only)
        </Button>
      </div>
    </div>
  );
}