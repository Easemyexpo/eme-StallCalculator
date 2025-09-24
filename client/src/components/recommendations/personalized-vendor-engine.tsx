import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, Star, Award, TrendingUp, Filter, Zap, Users, Clock } from "lucide-react";

interface VendorProfile {
  id: string;
  name: string;
  category: 'booth' | 'travel' | 'logistics' | 'hotel' | 'fullservice';
  location: string;
  specialties: string[];
  experience: number;
  rating: number;
  completedProjects: number;
  priceRange: 'budget' | 'mid' | 'premium';
  certifications: string[];
  responseTime: number; // hours
  reliability: number; // 1-10
  portfolioQuality: number; // 1-10
  clientSize: 'startup' | 'sme' | 'enterprise' | 'all';
  industries: string[];
  services: string[];
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  pastPerformance: {
    onTimeDelivery: number;
    budgetCompliance: number;
    qualityScore: number;
  };
}

interface RecommendationCriteria {
  budget: number;
  timeline: number; // days
  projectSize: 'small' | 'medium' | 'large';
  industry: string;
  priorityFactors: {
    price: number;
    quality: number;
    speed: number;
    reliability: number;
  };
  locationPreference: 'local' | 'regional' | 'national';
  previousVendors: string[];
  mustHaveCertifications: string[];
  preferredServices: string[];
}

interface PersonalizedVendorEngineProps {
  formData: any;
  onVendorSelect: (vendor: VendorProfile) => void;
  userPreferences?: any;
}

export function PersonalizedVendorEngine({ formData, onVendorSelect, userPreferences }: PersonalizedVendorEngineProps) {
  const [recommendations, setRecommendations] = useState<VendorProfile[]>([]);
  const [criteria, setCriteria] = useState<RecommendationCriteria>({
    budget: 100000,
    timeline: 30,
    projectSize: 'medium',
    industry: formData?.industry || 'general',
    priorityFactors: {
      price: 25,
      quality: 30,
      speed: 20,
      reliability: 25
    },
    locationPreference: 'regional',
    previousVendors: [],
    mustHaveCertifications: [],
    preferredServices: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  const mockVendorProfiles: VendorProfile[] = [
    {
      id: "vendor_premium_1",
      name: "Exhibition Excellence Pvt Ltd",
      category: "booth",
      location: "Mumbai, Maharashtra",
      specialties: ["Custom Booth Design", "3D Visualization", "Premium Fabrication"],
      experience: 15,
      rating: 4.8,
      completedProjects: 350,
      priceRange: "premium",
      certifications: ["ISO 9001", "Green Building", "Fire Safety"],
      responseTime: 2,
      reliability: 9,
      portfolioQuality: 9,
      clientSize: "enterprise",
      industries: ["Technology", "Pharmaceuticals", "Automotive"],
      services: ["Design", "Fabrication", "Installation", "Project Management"],
      contact: {
        phone: "+91-22-4567-8900",
        email: "info@exhibitionexcellence.com",
        website: "www.exhibitionexcellence.com"
      },
      pastPerformance: {
        onTimeDelivery: 95,
        budgetCompliance: 92,
        qualityScore: 96
      }
    },
    {
      id: "vendor_budget_1",
      name: "Quick Setup Solutions",
      category: "booth",
      location: "Delhi, Delhi",
      specialties: ["Shell Scheme", "Modular Systems", "Quick Installation"],
      experience: 8,
      rating: 4.2,
      completedProjects: 180,
      priceRange: "budget",
      certifications: ["Basic Safety"],
      responseTime: 6,
      reliability: 7,
      portfolioQuality: 6,
      clientSize: "sme",
      industries: ["Textiles", "Food", "General"],
      services: ["Basic Design", "Standard Fabrication", "Installation"],
      contact: {
        phone: "+91-11-9876-5432",
        email: "contact@quicksetup.in"
      },
      pastPerformance: {
        onTimeDelivery: 82,
        budgetCompliance: 88,
        qualityScore: 78
      }
    },
    {
      id: "vendor_travel_1",
      name: "Corporate Travel Experts",
      category: "travel",
      location: "Bangalore, Karnataka",
      specialties: ["Group Bookings", "Corporate Rates", "Visa Assistance"],
      experience: 12,
      rating: 4.6,
      completedProjects: 500,
      priceRange: "mid",
      certifications: ["IATA", "Corporate Travel"],
      responseTime: 1,
      reliability: 8,
      portfolioQuality: 8,
      clientSize: "all",
      industries: ["All Industries"],
      services: ["Flight Booking", "Hotel Booking", "Visa Support", "Travel Insurance"],
      contact: {
        phone: "+91-80-1234-5678",
        email: "corporate@travelexperts.in",
        website: "www.corporatetravelexperts.com"
      },
      pastPerformance: {
        onTimeDelivery: 98,
        budgetCompliance: 94,
        qualityScore: 90
      }
    },
    {
      id: "vendor_logistics_1",
      name: "Exhibition Logistics Pro",
      category: "logistics",
      location: "Chennai, Tamil Nadu",
      specialties: ["Exhibition Freight", "Customs Clearance", "Last Mile Delivery"],
      experience: 10,
      rating: 4.4,
      completedProjects: 280,
      priceRange: "mid",
      certifications: ["AEO", "Customs License"],
      responseTime: 4,
      reliability: 8,
      portfolioQuality: 7,
      clientSize: "all",
      industries: ["Manufacturing", "Electronics", "Automotive"],
      services: ["Freight", "Customs", "Warehousing", "Installation Support"],
      contact: {
        phone: "+91-44-8765-4321",
        email: "logistics@exhipro.com"
      },
      pastPerformance: {
        onTimeDelivery: 89,
        budgetCompliance: 91,
        qualityScore: 85
      }
    }
  ];

  const calculateVendorScore = (vendor: VendorProfile, criteria: RecommendationCriteria): number => {
    let score = 0;
    const weights = criteria.priorityFactors;
    
    // Price score (inverse - lower price = higher score)
    const priceScore = vendor.priceRange === 'budget' ? 10 : 
                      vendor.priceRange === 'mid' ? 7 : 4;
    score += (priceScore * weights.price) / 100;
    
    // Quality score
    score += (vendor.portfolioQuality * weights.quality) / 100;
    
    // Speed score (based on response time and reliability)
    const speedScore = Math.max(1, 10 - (vendor.responseTime / 2));
    score += (speedScore * weights.speed) / 100;
    
    // Reliability score
    score += (vendor.reliability * weights.reliability) / 100;
    
    // Bonus factors
    // Industry match
    if (vendor.industries.includes(criteria.industry) || vendor.industries.includes('All Industries')) {
      score += 1;
    }
    
    // Experience bonus
    if (vendor.experience > 10) score += 0.5;
    if (vendor.experience > 15) score += 0.5;
    
    // Certification bonus
    if (vendor.certifications.length > 2) score += 0.3;
    
    // Performance bonus
    const avgPerformance = (vendor.pastPerformance.onTimeDelivery + 
                           vendor.pastPerformance.budgetCompliance + 
                           vendor.pastPerformance.qualityScore) / 3;
    if (avgPerformance > 90) score += 0.5;
    
    return Math.min(10, score);
  };

  const generateRecommendations = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const scoredVendors = mockVendorProfiles
        .map(vendor => ({
          ...vendor,
          score: calculateVendorScore(vendor, criteria)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
      
      setRecommendations(scoredVendors);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    generateRecommendations();
  }, [criteria]);

  const handleVendorSelection = (vendor: VendorProfile) => {
    const vendorId = vendor.id;
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(prev => prev.filter(id => id !== vendorId));
    } else {
      setSelectedVendors(prev => [...prev, vendorId]);
      onVendorSelect(vendor);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'booth': return <Building2 className="w-4 h-4" />;
      case 'travel': return <Users className="w-4 h-4" />;
      case 'logistics': return <TrendingUp className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'booth': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'travel': return 'bg-green-100 text-green-700 border-green-200';
      case 'logistics': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-emerald-600" />
            Personalized Vendor Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Budget Range (₹)</Label>
              <Slider
                value={[criteria.budget]}
                onValueChange={(value) => setCriteria(prev => ({ ...prev, budget: value[0] }))}
                max={500000}
                min={25000}
                step={25000}
                className="mt-2"
              />
              <div className="text-sm text-gray-600 mt-1">₹{criteria.budget.toLocaleString()}</div>
            </div>
            
            <div>
              <Label>Timeline (Days)</Label>
              <Slider
                value={[criteria.timeline]}
                onValueChange={(value) => setCriteria(prev => ({ ...prev, timeline: value[0] }))}
                max={90}
                min={7}
                step={7}
                className="mt-2"
              />
              <div className="text-sm text-gray-600 mt-1">{criteria.timeline} days</div>
            </div>
            
            <div>
              <Label>Project Size</Label>
              <Select 
                value={criteria.projectSize} 
                onValueChange={(value: 'small' | 'medium' | 'large') => 
                  setCriteria(prev => ({ ...prev, projectSize: value }))
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (under 50 sqm)</SelectItem>
                  <SelectItem value="medium">Medium (50-200 sqm)</SelectItem>
                  <SelectItem value="large">Large (over 200 sqm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority Factors */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-semibold">Priority Factors</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(criteria.priorityFactors).map(([factor, value]) => (
                <div key={factor}>
                  <Label className="capitalize">{factor} ({value}%)</Label>
                  <Slider
                    value={[value]}
                    onValueChange={(newValue) => 
                      setCriteria(prev => ({
                        ...prev,
                        priorityFactors: { ...prev.priorityFactors, [factor]: newValue[0] }
                      }))
                    }
                    max={50}
                    min={10}
                    step={5}
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Location Preference</Label>
                  <Select 
                    value={criteria.locationPreference} 
                    onValueChange={(value: 'local' | 'regional' | 'national') => 
                      setCriteria(prev => ({ ...prev, locationPreference: value }))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Only</SelectItem>
                      <SelectItem value="regional">Regional</SelectItem>
                      <SelectItem value="national">National</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Industry Focus</Label>
                  <Select 
                    value={criteria.industry} 
                    onValueChange={(value) => setCriteria(prev => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="textiles">Textiles</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recommended Vendors</h3>
          <Button onClick={generateRecommendations} disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Refresh Recommendations'}
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((vendor: VendorProfile & { score?: number }) => {
              const isSelected = selectedVendors.includes(vendor.id);
              return (
                <Card 
                  key={vendor.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
                  }`}
                  onClick={() => handleVendorSelection(vendor)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(vendor.category)}
                          <h4 className="font-semibold text-gray-900">{vendor.name}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(vendor.category)}>
                            {vendor.category}
                          </Badge>
                          {isSelected && (
                            <Badge className="bg-emerald-100 text-emerald-700">
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Score and Rating */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{vendor.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-medium">Score: {vendor.score?.toFixed(1)}/10</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{vendor.completedProjects} projects</span>
                        </div>
                      </div>

                      {/* Location and Experience */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{vendor.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{vendor.experience}+ years</span>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1">
                        {vendor.specialties.slice(0, 3).map((specialty: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      {/* Performance Indicators */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium text-emerald-600">
                            {vendor.pastPerformance.onTimeDelivery}%
                          </div>
                          <div className="text-gray-500">On Time</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-blue-600">
                            {vendor.pastPerformance.budgetCompliance}%
                          </div>
                          <div className="text-gray-500">Budget</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-purple-600">
                            {vendor.pastPerformance.qualityScore}%
                          </div>
                          <div className="text-gray-500">Quality</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}