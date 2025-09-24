import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Hotel, Star, CheckCircle, Plus, Minus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HotelOption {
  id: string;
  name: string;
  location?: string;
  address?: string;
  rating: number;
  price?: number;
  pricePerNight?: number;
  currency: string;
  amenities: string[];
  distanceToVenue?: string;
  distanceFromVenue?: number;
  available: boolean;
  cancellationPolicy?: string;
}

interface HotelSelectionProps {
  formData: any;
  onHotelSelect: (hotel: HotelOption | null) => void;
  selectedHotel: HotelOption | null;
}

export function HotelSelection({ formData, onHotelSelect, selectedHotel }: HotelSelectionProps) {
  const [searchTrigger, setSearchTrigger] = useState(0);

  const { data: hotelData, isLoading, refetch } = useQuery({
    queryKey: ['hotel-search', formData.destinationCity, formData.teamSize, formData.arrivalDate, searchTrigger],
    queryFn: async () => {
      const response = await fetch('/api/hotels/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: formData.destinationCity,
          checkIn: formData.arrivalDate,
          checkOut: formData.departureDate,
          rooms: Math.ceil(formData.teamSize / 2),
          guests: formData.teamSize
        })
      });
      const data = await response.json();
      console.log('Hotel API Response:', data);
      return data;
    },
    enabled: !!(formData.destinationCity && formData.arrivalDate)
  });

  const handleHotelSelect = (hotel: HotelOption) => {
    console.log('Selecting hotel:', hotel);
    // Calculate total price for the stay
    const totalPrice = hotel.pricePerNight ? (hotel.pricePerNight * nights * rooms) : hotel.price || 0;
    const hotelWithTotal = { ...hotel, totalPrice };
    console.log('Hotel with calculated total:', hotelWithTotal);
    onHotelSelect(hotelWithTotal);
  };

  const removeHotelSelection = () => {
    console.log('Removing hotel selection');
    onHotelSelect(null);
  };

  const searchHotels = () => {
    setSearchTrigger(prev => prev + 1);
  };

  const calculateNights = () => {
    if (formData.arrivalDate && formData.departureDate) {
      const arrival = new Date(formData.arrivalDate);
      const departure = new Date(formData.departureDate);
      const diffTime = Math.abs(departure.getTime() - arrival.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 1;
  };

  const nights = calculateNights();
  const rooms = Math.ceil(formData.teamSize / 2);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-600 mt-2">Searching hotels...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="card-hotel-selection">
      {/* Redesigned Header */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hotel Selection</h2>
              <p className="text-gray-600 text-sm">Choose accommodation for your team</p>
            </div>
          </div>
          <Button 
            onClick={searchHotels}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            <Hotel className="w-4 h-4 mr-2" />
            Refresh Hotels
          </Button>
        </div>
        
        {/* Trip Summary */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-600 mb-1">Destination</div>
              <div className="font-semibold text-blue-600">{formData.destinationCity}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 mb-1">Team Size</div>
              <div className="font-semibold">{formData.teamSize} guests</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 mb-1">Duration</div>
              <div className="font-semibold">{nights} {nights === 1 ? 'night' : 'nights'}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 mb-1">Rooms Required</div>
              <div className="font-semibold">{rooms} {rooms === 1 ? 'room' : 'rooms'}</div>
            </div>
          </div>
          {formData.arrivalDate && formData.departureDate && (
            <div className="mt-3 pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
              Check-in: {new Date(formData.arrivalDate).toLocaleDateString('en-IN')} • 
              Check-out: {new Date(formData.departureDate).toLocaleDateString('en-IN')}
            </div>
          )}
        </div>
      </div>

      {/* Selected Hotel Summary */}
      {selectedHotel && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-green-600 rounded-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-green-800 font-bold text-lg mb-1">Selected Hotel</h4>
                <div className="text-gray-900 font-semibold text-xl">{selectedHotel.name}</div>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < selectedHotel.rating ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedHotel.location || selectedHotel.address}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-700 font-bold text-2xl">
                ₹{((selectedHotel.pricePerNight || selectedHotel.price || 0) * nights * rooms).toLocaleString('en-IN')}
              </div>
              <div className="text-gray-600 text-sm">{nights} nights • {rooms} rooms</div>
              <div className="text-gray-500 text-xs mt-1">
                ₹{(selectedHotel.pricePerNight || selectedHotel.price || 0).toLocaleString('en-IN')} per night per room
              </div>
              <button 
                onClick={removeHotelSelection}
                className="mt-2 px-3 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded text-xs font-medium transition-colors"
              >
                Change Hotel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Available Hotels */}
      {hotelData && hotelData.hotels && hotelData.hotels.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-gray-400 mb-4">
            Showing hotels for {nights} night{nights > 1 ? 's' : ''}, {rooms} room{rooms > 1 ? 's' : ''}
          </div>
          
          {hotelData.hotels.map((hotel: HotelOption) => (
            <div 
              key={hotel.id} 
              className={`p-6 rounded-xl border transition-all cursor-pointer ${
                selectedHotel?.id === hotel.id
                  ? 'bg-blue-50 border-blue-400 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
              onClick={() => handleHotelSelect(hotel)}
            >
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <h4 className="font-bold text-gray-900 text-xl">{hotel.name}</h4>
                    {selectedHotel?.id === hotel.id && (
                      <div className="p-1 bg-blue-600 rounded-full">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < hotel.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="ml-1 text-gray-600 text-sm">({hotel.rating})</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{hotel.location || hotel.address}</span>
                    </div>
                    {hotel.distanceFromVenue && (
                      <div className="text-sm text-blue-600">
                        {hotel.distanceFromVenue}km from venue
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 5).map((amenity, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 5 && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                        +{hotel.amenities.length - 5} more
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-400">
                    {hotel.distanceFromVenue ? `${hotel.distanceFromVenue}km from venue` : hotel.distanceToVenue || ''} 
                    {hotel.cancellationPolicy && (
                      <> • {hotel.cancellationPolicy}</>
                    )}
                  </div>
                </div>

                <div className="text-right mt-4 lg:mt-0 lg:ml-4">
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{((hotel.pricePerNight || hotel.price || 0) * nights * rooms).toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm text-gray-500">
                    Total for {nights} nights • {rooms} rooms
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    ₹{(hotel.pricePerNight || hotel.price || 0).toLocaleString('en-IN')}/night per room
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Total for {nights} nights, {rooms} rooms
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onHotelSelect(hotel);
                    }}
                    className="mt-2 px-4 py-1 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors"
                  >
                    {selectedHotel?.id === hotel.id ? 'Selected' : 'Select Hotel'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No hotels available message */}
      {hotelData && (!hotelData.hotels || hotelData.hotels.length === 0) && (
        <div className="text-center py-8">
          <Hotel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hotels available</h3>
          <p className="text-gray-600 mb-4">No hotels found for the selected destination and dates.</p>
          <Button variant="outline" onClick={searchHotels}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}