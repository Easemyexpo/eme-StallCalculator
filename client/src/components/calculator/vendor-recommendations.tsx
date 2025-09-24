import { useState } from "react";
import { Building2, MapPin, Phone, Mail, Star, ExternalLink, Sparkles, Plane, Hotel, Truck, Users } from "lucide-react";
import { Label } from "@/components/ui/label";

interface MappedVendor {
  id: string;
  name: string;
  location: string;
  specialties: string[];
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  description: string;
  rating: number;
  experience: string;
  category: 'booth' | 'travel' | 'logistics' | 'hotel';
  selectable: boolean;
  isAdminManaged: boolean;
}

interface VendorRecommendationsProps {
  formData: {
    currency: string;
    marketLevel: string;
    eventType: string;
    boothSize: number;
    customSize?: number;
    boothType: string;
    venueType: string;
    distance: number;
    destinationCity: string;
    destinationState: string;
    originCity?: string;
    originState?: string;
  };
  onVendorSelect?: (vendor: Vendor, selected: boolean) => void;
  selectedVendors?: string[];
}

interface Vendor {
  id?: string;
  name: string;
  location: string;
  specialties: string[];
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  description: string;
  rating?: number;
  experience?: string;
  category: 'booth' | 'travel' | 'logistics' | 'hotel';
  selectable?: boolean;
}

export function VendorRecommendations({ formData, onVendorSelect, selectedVendors = [] }: VendorRecommendationsProps) {
  const [vendors, setVendors] = useState<MappedVendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchVendors = async () => {
    setLoading(true);
    setSearched(true);
    setError(null);
    setVendors([]); // Clear previous results
    
    try {
      const actualBoothSize = formData.customSize || formData.boothSize;
      const isIndianLocation = formData.destinationState?.startsWith('IN-');
      const locationInfo = formData.destinationCity && formData.destinationState ? 
        `in ${formData.destinationCity}, ${formData.destinationState}` : 
        `in ${formData.marketLevel} cost markets`;
      
      const searchQuery = isIndianLocation 
        ? `Find real exhibition stall designing and fabrication companies specifically in ${formData.destinationCity}, India for ${formData.eventType} exhibitions:

STALL DESIGNERS & FABRICATORS in ${formData.destinationCity}:
- Companies specializing in ${formData.boothType} booth construction around ${actualBoothSize}m²
- Local fabricators with experience in major ${formData.destinationCity} venues
- Stall design agencies offering custom exhibition stands
- Booth builders with 3D design capabilities and project management
- Exhibition contractors familiar with local venue regulations

LOGISTICS PARTNERS in ${formData.destinationCity}:
- Local logistics companies for exhibition freight and material transportation
- Booth setup and dismantling services
- Equipment rental companies for AV, furniture, lighting

Include real company names with physical addresses in ${formData.destinationCity}, contact details (phone, email, website), specialties in stall design/fabrication, years of experience, and portfolio examples.`
        : `Find comprehensive exhibition service providers for ${formData.eventType} events ${locationInfo}:

1. BOOTH BUILDERS: Companies specializing in ${formData.boothType} booths around ${actualBoothSize}m² for ${formData.venueType} venues
2. TRAVEL AGENCIES: Corporate travel services for exhibition teams with flight bookings and group rates
3. HOTELS: Business hotels near major convention centers with conference rates and shuttle services
4. LOGISTICS PROVIDERS: Exhibition freight forwarding, booth material shipping, and on-site logistics coordination
5. FULL-SERVICE COMPANIES: Complete exhibition management including booth design, travel, and logistics

Include real company names, locations, contact information (website, phone, email), specialties, and services offered.`;
      
      const response = await fetch('/api/vendor-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          formData: formData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to search vendors');
      }

      const data = await response.json();
      
      // Show vendors from API response
      console.log('Vendor API response:', data);
      if (data.vendors && data.vendors.length > 0) {
        // Map the API response to our vendor interface
        const mappedVendors = data.vendors.map((vendor: any, index: number) => ({
          id: vendor.id || `vendor_${index}`,
          name: vendor.name || `Vendor ${index + 1}`,
          location: vendor.location || formData.destinationCity || 'Location TBD',
          specialties: vendor.specialties || vendor.services || ['General Exhibition Services'],
          contact: {
            phone: vendor.contact?.phone || vendor.phone || '',
            email: vendor.contact?.email || vendor.email || '',
            website: vendor.contact?.website || vendor.website || ''
          },
          description: vendor.description || vendor.summary || 'Professional exhibition service provider',
          rating: vendor.rating || 4.5,
          experience: vendor.experience || '5+ years',
          category: vendor.category || 'booth',
          selectable: true,
          isAdminManaged: vendor.isActive || false // Pass through active flag
        }));
        setVendors(mappedVendors);
      } else {
        setError('No vendor data available. Please check your API connection or try again later.');
        setVendors([]);
      }
    } catch (error) {
      console.error('Error searching vendors:', error);
      setError('Failed to load vendor recommendations. Please try again or check your internet connection.');
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="vendor-recommendations">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>AI Vendor Recommendations</span>
        </h3>
        
        <p className="text-gray-600 text-sm">
          Get personalized vendor recommendations based on your exhibition requirements
        </p>
        
        <div className="flex justify-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Building2 className="w-3 h-3 text-indigo-500" />
            <span>Booth Builders</span>
          </div>
          <div className="flex items-center space-x-2">
            <Plane className="w-3 h-3 text-blue-500" />
            <span>Travel</span>
          </div>
          <div className="flex items-center space-x-2">
            <Hotel className="w-3 h-3 text-green-500" />
            <span>Hotels</span>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="w-3 h-3 text-orange-500" />
            <span>Logistics</span>
          </div>
        </div>
        
        {!searched ? (
          <button
            onClick={searchVendors}
            disabled={loading}
            className="px-6 py-3 primary-gradient text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            data-testid="search-vendors-button"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 inline mr-2 animate-spin" />
                AI Searching Vendors...
              </>
            ) : (
              <>
                <Building2 className="w-4 h-4 inline mr-2" />
                Find Exhibition Partners
              </>
            )}
          </button>
        ) : (
          <button
            onClick={searchVendors}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-medium rounded-lg transition-all duration-300"
            data-testid="refresh-vendors-button"
          >
            {loading ? (
              <>
                <Sparkles className="w-3 h-3 inline mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              'Refresh Search'
            )}
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4" data-testid="vendor-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 p-4 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-2 font-semibold">Unable to Load Vendors</div>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Vendor Results - Only show if we have authentic data */}
      {!loading && !error && vendors.length > 0 && (
        <div className="space-y-4" data-testid="vendor-results">
          {vendors.map((vendor, index) => {
            const getCategoryIcon = (category: string) => {
              switch (category) {
                case 'booth': return <Building2 className="w-4 h-4 text-indigo-400" />;
                case 'travel': return <Plane className="w-4 h-4 text-blue-400" />;
                case 'hotel': return <Hotel className="w-4 h-4 text-green-400" />;
                case 'logistics': return <Truck className="w-4 h-4 text-orange-400" />;
                default: return <Users className="w-4 h-4 text-emerald-400" />;
              }
            };

            const getCategoryColor = (category: string) => {
              switch (category) {
                case 'booth': return 'border-indigo-500/30 bg-indigo-500/10';
                case 'travel': return 'border-blue-500/30 bg-blue-500/10';
                case 'hotel': return 'border-green-500/30 bg-green-500/10';
                case 'logistics': return 'border-orange-500/30 bg-orange-500/10';
                default: return 'border-emerald-500/30 bg-emerald-500/10';
              }
            };

            const vendorId = vendor.id || `vendor_${index}`;
            const isSelected = selectedVendors.includes(vendorId);

            const handleVendorToggle = () => {
              console.log('Vendor toggle clicked:', vendor.name, 'Current selected:', isSelected);
              console.log('onVendorSelect function:', typeof onVendorSelect);
              console.log('vendor.selectable:', vendor.selectable);
              if (onVendorSelect && vendor.selectable !== false) {
                onVendorSelect(vendor, !isSelected);
                console.log('Vendor selection sent to parent');
              } else {
                console.log('Vendor selection blocked - missing onVendorSelect or not selectable');
              }
            };

            return (
              <div 
                key={index} 
                className={`bg-white border card-hover p-3 sm:p-4 rounded-lg transition-all ${getCategoryColor(vendor.category)} ${
                  isSelected ? 'ring-2 ring-primary ring-opacity-50 border-primary/50' : ''
                } ${
                  vendor.isAdminManaged ? 'border-l-4 border-l-green-500' : ''
                }`}
                data-testid={`vendor-card-${index}`}
              >
                {/* Mobile-First Layout */}
                <div className="space-y-3">
                  {/* Header with checkbox and pricing */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {/* Professional selection checkbox */}
                      {vendor.selectable !== false && onVendorSelect && (
                        <div className="flex items-center mt-1">
                          <input
                            type="checkbox"
                            id={`vendor-${vendorId}`}
                            checked={isSelected}
                            onChange={handleVendorToggle}
                            className="w-5 h-5 text-emerald-600 bg-white border-2 border-emerald-400 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer stall-checkbox"
                            data-testid={`vendor-select-${index}`}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start space-x-2 mb-1">
                          {getCategoryIcon(vendor.category)}
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight" data-testid={`vendor-name-${index}`}>
                            {vendor.name}
                          </h3>
                          {vendor.isAdminManaged && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        {vendor.rating && (
                          <div className="flex items-center space-x-1 mb-1" data-testid={`vendor-rating-${index}`}>
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-yellow-600 text-xs">{vendor.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Enhanced pricing and selection indicator */}
                    <div className="flex flex-col items-end space-y-1">
                      {isSelected && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap font-medium">
                            Selected
                          </span>
                        </div>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${
                        isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        +₹12,500
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    {vendor.location && (
                      <div className="flex items-center space-x-2" data-testid={`vendor-location-${index}`}>
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600 text-xs">{vendor.location}</span>
                      </div>
                    )}

                    <p className="text-gray-700 text-xs sm:text-sm" data-testid={`vendor-description-${index}`}>
                      {vendor.description}
                    </p>

                    {vendor.specialties && vendor.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1" data-testid={`vendor-specialties-${index}`}>
                        {vendor.specialties.slice(0, 3).map((specialty, i) => (
                          <span 
                            key={i} 
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20" 
                            data-testid={`vendor-specialty-${index}-${i}`}
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}

                    {vendor.experience && (
                      <p className="text-amber-600 text-xs" data-testid={`vendor-experience-${index}`}>
                        Experience: {vendor.experience}
                      </p>
                    )}

                    {/* Additional Services for Mobile */}
                    <div className="sm:hidden mt-3 pt-3 border-t border-gray-100">
                      <Label className="text-xs font-medium text-gray-700 mb-2 block">Additional Services</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="checkbox-label flex items-center space-x-2 p-2 border rounded text-xs cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-emerald-600 stall-checkbox" />
                          <span>Audio Visual</span>
                          <span className="text-gray-500">+₹18.5k</span>
                        </label>
                        <label className="checkbox-label flex items-center space-x-2 p-2 border rounded text-xs cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-emerald-600 stall-checkbox" />
                          <span>Furniture</span>
                          <span className="text-gray-500">+₹25k</span>
                        </label>
                        <label className="checkbox-label flex items-center space-x-2 p-2 border rounded text-xs cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-emerald-600 stall-checkbox" />
                          <span>Lighting</span>
                          <span className="text-gray-500">+₹15k</span>
                        </label>
                        <label className="checkbox-label flex items-center space-x-2 p-2 border rounded text-xs cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-emerald-600 stall-checkbox" />
                          <span>Internet</span>
                          <span className="text-gray-500">+₹8k</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State - Only show after search with no results */}
      {searched && !loading && !error && vendors.length === 0 && (
        <div className="text-center py-8">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Vendors Found</h3>
          <p className="text-gray-500 text-sm">
            Unable to find vendor recommendations at this time. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}