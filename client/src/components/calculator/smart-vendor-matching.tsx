import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Star, Award, TrendingUp, Users, CheckCircle, Phone, Mail } from "lucide-react";
import type { FormData } from "@/lib/calculator";

interface SmartVendor {
  id: string;
  name: string;
  category: string;
  location: string;
  specialties: string[];
  rating: number;
  completedProjects: number;
  avgCost: number;
  matchScore: number;
  certifications: string[];
  recentWork: string[];
  contact: {
    phone: string;
    email: string;
  };
  advantages: string[];
  pricing: {
    hourly?: number;
    project?: number;
    sqft?: number;
  };
}

interface SmartVendorMatchingProps {
  formData: FormData;
  selectedVendors: any[];
  setSelectedVendors: (vendors: any[]) => void;
}

export default function SmartVendorMatching({ formData, selectedVendors, setSelectedVendors }: SmartVendorMatchingProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedVendor, setSelectedVendor] = useState<SmartVendor | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const { data: smartVendors, isLoading } = useQuery({
    queryKey: ["/api/smart-vendors", formData],
    enabled: !!(formData.destinationCity && formData.boothSize),
  });

  const categories = ["all", "booth", "logistics", "travel", "catering", "technology", "security"];
  
  const filteredVendors = smartVendors ? 
    (smartVendors as SmartVendor[]).filter(vendor => 
      selectedCategory === "all" || vendor.category === selectedCategory
    ) : [];

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400 bg-green-900/30 border-green-700";
    if (score >= 80) return "text-blue-400 bg-blue-900/30 border-blue-700";
    if (score >= 70) return "text-yellow-400 bg-yellow-900/30 border-yellow-700";
    return "text-gray-400 bg-gray-900/30 border-gray-700";
  };

  const handleVendorClick = (vendor: SmartVendor) => {
    setSelectedVendor(vendor);
    setShowDetails(true);
  };

  if (!formData.destinationCity || !formData.boothSize) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <CardTitle className="text-white">Smart Vendor Matching</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Complete location and booth details for personalized vendor recommendations
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <CardTitle className="text-white">Smart Vendor Matching</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            AI-powered vendor recommendations based on your requirements
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 
                  "bg-yellow-600 hover:bg-yellow-700" : 
                  "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
                data-testid={`button-category-${category}`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {/* Vendor List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 bg-gray-700/30 rounded-lg animate-pulse">
                  <div className="h-5 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : filteredVendors.length > 0 ? (
            <div className="space-y-4">
              {filteredVendors.map((vendor) => (
                <div 
                  key={vendor.id}
                  className="p-4 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-yellow-500 transition-colors cursor-pointer"
                  onClick={() => handleVendorClick(vendor)}
                  data-testid={`card-smart-vendor-${vendor.id}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        {vendor.name}
                        {vendor.matchScore >= 90 && <Award className="w-4 h-4 text-yellow-400" />}
                      </h3>
                      <p className="text-gray-400 text-sm">{vendor.location}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getMatchScoreColor(vendor.matchScore)}`}>
                      {vendor.matchScore}% match
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white">{vendor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <CheckCircle className="w-4 h-4" />
                      {vendor.completedProjects} projects
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {vendor.category}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {vendor.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-yellow-600 text-yellow-300">
                        {specialty}
                      </Badge>
                    ))}
                    {vendor.specialties.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{vendor.specialties.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-green-400 font-medium">
                      {vendor.pricing.project && `₹${vendor.pricing.project.toLocaleString()}`}
                      {vendor.pricing.hourly && `₹${vendor.pricing.hourly}/hr`}
                      {vendor.pricing.sqft && `₹${vendor.pricing.sqft}/sqft`}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `tel:${vendor.contact.phone}`;
                        }}
                        data-testid={`button-call-vendor-${vendor.id}`}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVendorClick(vendor);
                        }}
                        data-testid={`button-view-vendor-${vendor.id}`}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p>No matching vendors found</p>
              <p className="text-sm">Try adjusting your category filter</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vendor Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedVendor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  {selectedVendor.name}
                  <div className={`px-2 py-1 rounded text-xs ${getMatchScoreColor(selectedVendor.matchScore)}`}>
                    {selectedVendor.matchScore}% match
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                    <div className="text-white font-medium">{selectedVendor.rating}/5</div>
                    <div className="text-gray-400 text-xs">Rating</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <div className="text-white font-medium">{selectedVendor.completedProjects}</div>
                    <div className="text-gray-400 text-xs">Projects</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-white font-medium">₹{selectedVendor.avgCost.toLocaleString()}</div>
                    <div className="text-gray-400 text-xs">Avg Cost</div>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h4 className="text-white font-medium mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVendor.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="border-yellow-600 text-yellow-300">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Advantages */}
                <div>
                  <h4 className="text-white font-medium mb-2">Why This Vendor Matches</h4>
                  <div className="space-y-2">
                    {selectedVendor.advantages.map((advantage, index) => (
                      <div key={index} className="flex items-start gap-2 text-green-200">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{advantage}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                {selectedVendor.certifications.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVendor.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Work */}
                <div>
                  <h4 className="text-white font-medium mb-2">Recent Projects</h4>
                  <div className="space-y-1">
                    {selectedVendor.recentWork.map((work, index) => (
                      <div key={index} className="text-gray-300 text-sm">• {work}</div>
                    ))}
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => window.location.href = `tel:${selectedVendor.contact.phone}`}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                    data-testid="button-call-vendor-modal"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call {selectedVendor.contact.phone}
                  </Button>
                  <Button 
                    onClick={() => window.location.href = `mailto:${selectedVendor.contact.email}`}
                    variant="outline"
                    className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white flex-1"
                    data-testid="button-email-vendor-modal"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
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