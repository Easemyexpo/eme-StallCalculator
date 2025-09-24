import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, MapPin, Star, Users, Car, Wifi, Search, ExternalLink } from "lucide-react";

interface Venue {
  id: string;
  name: string;
  city: string;
  state: string;
  capacity: number;
  hallCount: number;
  totalArea: number;
  parking: number;
  rating: number;
  priceRange: string;
  facilities: string[];
  recentEvents: string[];
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  images: string[];
  description: string;
}

interface VenueDatabaseProps {
  selectedCity?: string;
  selectedState?: string;
  onVenueSelect: (venue: Venue) => void;
}

export default function VenueDatabase({ selectedCity, selectedState, onVenueSelect }: VenueDatabaseProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const { data: venues, isLoading } = useQuery({
    queryKey: ["/api/venues", selectedCity, selectedState, searchTerm],
  });

  const filteredVenues = Array.isArray(venues) ? venues : [];

  const handleVenueClick = (venue: Venue) => {
    setSelectedVenue(venue);
    setShowDetails(true);
  };

  const handleSelectVenue = (venue: Venue) => {
    onVenueSelect(venue);
    setShowDetails(false);
  };

  return (
    <>
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-white">Venue Database</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Browse exhibition venues with real pricing data
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search venues by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
              data-testid="input-venue-search"
            />
          </div>

          {/* Venue List */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 bg-gray-700/30 rounded-lg animate-pulse">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredVenues.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredVenues.map((venue: Venue) => (
                <div 
                  key={venue.id} 
                  className="p-4 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => handleVenueClick(venue)}
                  data-testid={`card-venue-${venue.id}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-medium">{venue.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 text-sm">{venue.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {venue.city}, {venue.state}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {venue.capacity.toLocaleString()} capacity
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="w-4 h-4" />
                      {venue.parking} parking
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {venue.facilities.slice(0, 3).map((facility, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {facility}
                      </Badge>
                    ))}
                    {venue.facilities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{venue.facilities.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-green-400 font-medium">{venue.priceRange}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectVenue(venue);
                      }}
                      data-testid={`button-select-venue-${venue.id}`}
                    >
                      Select Venue
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p>No venues found</p>
              <p className="text-sm">Try adjusting your search or location filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Venue Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedVenue && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  {selectedVenue.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 block text-sm">Location</span>
                    <span className="text-white">{selectedVenue.city}, {selectedVenue.state}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-sm">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white">{selectedVenue.rating}/5</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-sm">Capacity</span>
                    <span className="text-white">{selectedVenue.capacity.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-sm">Price Range</span>
                    <span className="text-green-400">{selectedVenue.priceRange}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-white font-medium mb-2">Description</h4>
                  <p className="text-gray-300 text-sm">{selectedVenue.description}</p>
                </div>

                {/* Facilities */}
                <div>
                  <h4 className="text-white font-medium mb-2">Facilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVenue.facilities.map((facility, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Recent Events */}
                <div>
                  <h4 className="text-white font-medium mb-2">Recent Events</h4>
                  <div className="space-y-1">
                    {selectedVenue.recentEvents.map((event, index) => (
                      <div key={index} className="text-gray-300 text-sm">• {event}</div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h4 className="text-white font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-300">Phone: {selectedVenue.contact.phone}</div>
                    <div className="text-gray-300">Email: {selectedVenue.contact.email}</div>
                    {selectedVenue.contact.website && (
                      <div className="flex items-center gap-1 text-blue-400">
                        <ExternalLink className="w-4 h-4" />
                        <a href={selectedVenue.contact.website} target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => handleSelectVenue(selectedVenue)}
                    className="bg-blue-600 hover:bg-blue-700 flex-1"
                    data-testid="button-select-venue-modal"
                  >
                    Select This Venue
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDetails(false)}
                    className="border-gray-600 text-gray-300"
                    data-testid="button-close-venue-modal"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}