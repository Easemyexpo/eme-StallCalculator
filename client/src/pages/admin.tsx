import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trash2, Edit, Plus, Search, Building, MapPin, Phone, Mail, Globe, Star, LogOut, Trophy, Award, Target, TrendingUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { VendorOnboardingWizard } from "@/components/vendor/onboarding-wizard";
import { AnimatedVendorPerformanceTimeline } from "@/components/vendor/performance-timeline";

interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  city: string;
  state: string;
  description: string;
  specialties: string[];
  services: string[];
  contact: {
    email?: string;
    phone?: string;
    website?: string;
  };
  rating?: number;
  experience?: string;
  priceRange: string;
  keywords: string[];
  logoUrl?: string;
  portfolioImages?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  const [showPerformanceTimeline, setShowPerformanceTimeline] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuth") === "true";
    const sessionTime = localStorage.getItem("adminSession");
    const currentTime = Date.now();
    const sessionExpiry = 24 * 60 * 60 * 1000; // 24 hours

    if (!isAuthenticated || !sessionTime || (currentTime - parseInt(sessionTime)) > sessionExpiry) {
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminSession");
      setLocation("/admin-login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminSession");
    setLocation("/");
  };

  // Fetch all vendors
  const { data: vendors = [], isLoading, refetch } = useQuery<Vendor[]>({
    queryKey: ["/api/admin/vendors"],
  });

  // Create/Update vendor mutation
  const vendorMutation = useMutation({
    mutationFn: async (vendor: Partial<Vendor>) => {
      const method = vendor.id ? "PUT" : "POST";
      const url = vendor.id ? `/api/admin/vendors/${vendor.id}` : "/api/admin/vendors";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendor),
      });
      
      if (!response.ok) throw new Error("Failed to save vendor");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vendors"] });
      refetch(); // Force refetch to ensure fresh data
      setIsDialogOpen(false);
      setSelectedVendor(null);
      setShowOnboardingWizard(false); // Also close wizard
      toast({
        title: "Success",
        description: "Vendor saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete vendor mutation
  const deleteMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      const response = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete vendor");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vendors"] });
      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveVendor = (formData: FormData) => {
    const specialties = (formData.get("specialties") as string) || "";
    const services = (formData.get("services") as string) || "";
    const keywords = (formData.get("keywords") as string) || "";
    const portfolioImages = (formData.get("portfolioImages") as string) || "";
    
    const vendor = {
      id: selectedVendor?.id,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      location: formData.get("location") as string || `${formData.get("city") as string}, ${formData.get("state") as string}`,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      description: formData.get("description") as string || "",
      specialties: specialties.split(",").map(s => s.trim()).filter(s => s),
      services: services.split(",").map(s => s.trim()).filter(s => s),
      contact: {
        email: formData.get("email") as string || "",
        phone: formData.get("phone") as string || "",
        website: formData.get("website") as string || "",
      },
      rating: parseFloat(formData.get("rating") as string) || undefined,
      experience: formData.get("experience") as string || "",
      priceRange: formData.get("priceRange") as string || "Standard",
      keywords: keywords ? keywords.split(",").map(k => k.trim()).filter(k => k) : 
                [formData.get("name") as string, formData.get("city") as string, formData.get("category") as string]
                .filter(Boolean).map(s => s.toLowerCase()),
      logoUrl: formData.get("logoUrl") as string || "",
      portfolioImages: portfolioImages ? portfolioImages.split(",").map(s => s.trim()).filter(s => s) : [],
      isActive: formData.get("isActive") !== "false", // Default to true
    };
    
    vendorMutation.mutate(vendor);
  };

  // Filter vendors (ensure vendors array exists and is valid)
  const filteredVendors = (vendors || []).filter(vendor => {
    const matchesSearch = !searchTerm || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !filterCategory || filterCategory === "all" || vendor.category === filterCategory;
    const matchesLocation = !filterLocation || filterLocation === "all" || vendor.state === filterLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const categories = Array.from(new Set(vendors.map(v => v.category))).filter(Boolean);
  const locations = Array.from(new Set(vendors.map(v => v.state))).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-green-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Vendor Management Dashboard</h1>
            <p className="text-gray-300">Gamified vendor management with intelligent client matching</p>
            <div className="flex items-center gap-4 mt-3">
              <Badge className="bg-green-600 text-white">
                <Trophy className="w-3 h-3 mr-1" />
                {vendors?.length || 0} Total Vendors
              </Badge>
              <Badge className="bg-blue-600 text-white">
                <TrendingUp className="w-3 h-3 mr-1" />
                Smart Matching Enabled
              </Badge>
              <Badge 
                className={`cursor-pointer transition-colors ${showPerformanceTimeline ? 'bg-purple-600 text-white' : 'bg-purple-600/20 text-purple-300 border-purple-600/30'}`}
                onClick={() => setShowPerformanceTimeline(!showPerformanceTimeline)}
              >
                <Award className="w-3 h-3 mr-1" />
                Performance Analytics
              </Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-2">
              <Button 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                onClick={() => setShowOnboardingWizard(true)}
                data-testid="button-guided-setup"
              >
                <Star className="w-4 h-4 mr-2" />
                Guided Setup
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                    onClick={() => setSelectedVendor(null)}
                    data-testid="button-quick-add"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Quick Add
                  </Button>
                </DialogTrigger>
                <VendorDialog 
                  vendor={selectedVendor} 
                  onSave={handleSaveVendor}
                  isLoading={vendorMutation.isPending}
                />
              </Dialog>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search" className="text-white mb-2 block">Search</Label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                    data-testid="input-search"
                  />
                </div>
              </div>
              <div>
                <Label className="text-white mb-2 block">Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white" data-testid="select-category">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white mb-2 block">Location</Label>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white" data-testid="select-location">
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <div className="text-white">
                  <span className="text-sm text-gray-400">Total: </span>
                  <span className="font-bold">{filteredVendors.length}</span>
                  <span className="text-gray-400"> vendors</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendors Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading vendors...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map(vendor => (
              <VendorCard 
                key={vendor.id} 
                vendor={vendor}
                onEdit={(vendor) => {
                  setSelectedVendor(vendor);
                  setIsDialogOpen(true);
                }}
                onDelete={(vendorId) => deleteMutation.mutate(vendorId)}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        )}

        {filteredVendors.length === 0 && !isLoading && (
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No vendors found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || filterCategory || filterLocation 
                  ? "Try adjusting your search filters"
                  : "Start by adding your first vendor"
                }
              </p>
              {!searchTerm && !filterCategory && !filterLocation && (
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setSelectedVendor(null);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Vendor
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Performance Timeline */}
        {showPerformanceTimeline && (
          <AnimatedVendorPerformanceTimeline vendors={vendors || []} />
        )}

        {/* Onboarding Wizard */}
        {showOnboardingWizard && (
          <VendorOnboardingWizard
            onComplete={(vendorData) => {
              vendorMutation.mutate(vendorData);
              setShowOnboardingWizard(false);
            }}
            onCancel={() => setShowOnboardingWizard(false)}
          />
        )}
      </div>
    </div>
  );
}

function VendorCard({ 
  vendor, 
  onEdit, 
  onDelete, 
  isDeleting 
}: { 
  vendor: Vendor; 
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendorId: string) => void;
  isDeleting: boolean;
}) {
  // Calculate performance metrics
  const performanceScore = vendor.rating ? Math.round(vendor.rating * 20) : 75; // Convert to percentage
  const experienceYears = vendor.experience ? parseInt(vendor.experience.replace(/\D/g, '')) || 5 : 5;
  
  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return { label: "Elite", color: "bg-purple-600", icon: "🏆" };
    if (score >= 80) return { label: "Expert", color: "bg-blue-600", icon: "⭐" };
    if (score >= 70) return { label: "Trusted", color: "bg-green-600", icon: "✅" };
    return { label: "Standard", color: "bg-gray-600", icon: "📋" };
  };
  
  const badge = getPerformanceBadge(performanceScore);

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors relative overflow-hidden">
      {/* Performance Badge */}
      <div className="absolute top-2 right-2 z-10">
        <Badge className={`${badge.color} text-white text-xs px-2 py-1`}>
          {badge.icon} {badge.label}
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start pr-16">
          {/* Logo Section */}
          <div className="flex items-start gap-3 flex-1">
            {vendor.logoUrl && (
              <div className="flex-shrink-0">
                <img 
                  src={vendor.logoUrl} 
                  alt={`${vendor.name} logo`}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-600"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-white text-lg mb-1">{vendor.name}</CardTitle>
              <CardDescription className="text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {vendor.city}, {vendor.state}
              </CardDescription>
            
            {/* Performance Metrics */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Performance</span>
                <span className="text-green-400">{performanceScore}%</span>
              </div>
              <Progress value={performanceScore} className="h-1 bg-gray-700" />
              
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {experienceYears}+ years
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {vendor.specialties.length} specialties
                </span>
              </div>
            </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 absolute top-8 right-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(vendor)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 p-1"
              data-testid={`button-edit-${vendor.id}`}
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(vendor.id)}
              disabled={isDeleting}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white p-1"
              data-testid={`button-delete-${vendor.id}`}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge variant="secondary" className="bg-emerald-600 text-white text-xs">
            {vendor.category}
          </Badge>
          {vendor.rating && (
            <div className="flex items-center gap-1 text-yellow-400 text-xs">
              <Star className="w-3 h-3 fill-current" />
              {vendor.rating}
            </div>
          )}
          <Badge 
            variant={vendor.isActive ? "default" : "secondary"}
            className={`text-xs ${vendor.isActive ? "bg-green-600" : "bg-gray-600"}`}
          >
            {vendor.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {vendor.description}
        </p>
        
        {vendor.specialties.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">Specialties:</p>
            <div className="flex flex-wrap gap-1">
              {vendor.specialties.slice(0, 3).map(specialty => (
                <Badge key={specialty} variant="outline" className="text-xs border-gray-600 text-gray-300">
                  {specialty}
                </Badge>
              ))}
              {vendor.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                  +{vendor.specialties.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Portfolio Images */}
        {vendor.portfolioImages && vendor.portfolioImages.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">Work Portfolio:</p>
            <div className="flex gap-2 overflow-x-auto">
              {vendor.portfolioImages.slice(0, 4).map((imageUrl, index) => (
                <img 
                  key={index}
                  src={imageUrl} 
                  alt={`${vendor.name} work ${index + 1}`}
                  className="w-16 h-12 rounded object-cover border border-gray-600 flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ))}
              {vendor.portfolioImages.length > 4 && (
                <div className="w-16 h-12 rounded bg-gray-700 border border-gray-600 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
                  +{vendor.portfolioImages.length - 4}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>Price: {vendor.priceRange}</span>
          {vendor.experience && <span>{vendor.experience}</span>}
        </div>
        
        <div className="flex gap-2 mt-3">
          {vendor.contact.phone && (
            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 p-2">
              <Phone className="w-3 h-3" />
            </Button>
          )}
          {vendor.contact.email && (
            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 p-2">
              <Mail className="w-3 h-3" />
            </Button>
          )}
          {vendor.contact.website && (
            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 p-2">
              <Globe className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        {/* Portfolio Gallery */}
        {vendor.portfolioImages && vendor.portfolioImages.length > 0 && (
          <div className="border-t border-gray-600 pt-3 mt-3">
            <p className="text-xs text-gray-400 mb-2">Work Portfolio</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {vendor.portfolioImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${vendor.name} work sample ${index + 1}`}
                  className="w-16 h-12 rounded object-cover flex-shrink-0 border border-gray-600 hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function VendorDialog({ 
  vendor, 
  onSave, 
  isLoading 
}: { 
  vendor: Vendor | null; 
  onSave: (formData: FormData) => void;
  isLoading: boolean;
}) {
  return (
    <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{vendor ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
        <DialogDescription className="text-gray-400">
          {vendor ? "Update vendor information" : "Add a new exhibition service provider"}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        onSave(formData);
      }} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-white">Vendor Name *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={vendor?.name}
              required
              className="bg-gray-700 border-gray-600 text-white"
              data-testid="input-vendor-name"
            />
          </div>
          <div>
            <Label htmlFor="category" className="text-white">Category *</Label>
            <Select name="category" defaultValue={vendor?.category}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Exhibition Services">Exhibition Services</SelectItem>
                <SelectItem value="Booth Construction">Booth Construction</SelectItem>
                <SelectItem value="Logistics & Freight">Logistics & Freight</SelectItem>
                <SelectItem value="Travel & Accommodation">Travel & Accommodation</SelectItem>
                <SelectItem value="Audio Visual">Audio Visual</SelectItem>
                <SelectItem value="Marketing & Branding">Marketing & Branding</SelectItem>
                <SelectItem value="Catering">Catering</SelectItem>
                <SelectItem value="Security Services">Security Services</SelectItem>
                <SelectItem value="Full Service">Full Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city" className="text-white">City *</Label>
            <Input
              id="city"
              name="city"
              defaultValue={vendor?.city}
              required
              className="bg-gray-700 border-gray-600 text-white"
              data-testid="input-city"
            />
          </div>
          <div>
            <Label htmlFor="state" className="text-white">State *</Label>
            <Select name="state" defaultValue={vendor?.state}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                <SelectItem value="West Bengal">West Bengal</SelectItem>
                <SelectItem value="Gujarat">Gujarat</SelectItem>
                <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                <SelectItem value="Punjab">Punjab</SelectItem>
                <SelectItem value="Kerala">Kerala</SelectItem>
                <SelectItem value="Odisha">Odisha</SelectItem>
                <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                <SelectItem value="Goa">Goa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="location" className="text-white">Full Address</Label>
          <Input
            id="location"
            name="location"
            defaultValue={vendor?.location}
            placeholder="Complete address"
            className="bg-gray-700 border-gray-600 text-white"
            data-testid="input-location"
          />
        </div>
        
        <div>
          <Label htmlFor="description" className="text-white">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={vendor?.description}
            rows={3}
            className="bg-gray-700 border-gray-600 text-white"
            data-testid="textarea-description"
          />
        </div>
        
        {/* Visual Assets Section */}
        <div className="border-t border-gray-600 pt-4">
          <h4 className="text-white text-sm font-medium mb-3">Visual Assets</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="logoUrl" className="text-white">Company Logo URL</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                type="url"
                defaultValue={vendor?.logoUrl}
                placeholder="https://example.com/logo.png"
                className="bg-gray-700 border-gray-600 text-white"
                data-testid="input-logo-url"
              />
              <p className="text-xs text-gray-400 mt-1">Direct link to company logo image</p>
            </div>
            <div>
              <Label htmlFor="portfolioImages" className="text-white">Portfolio Image URLs</Label>
              <Input
                id="portfolioImages"
                name="portfolioImages"
                defaultValue={vendor?.portfolioImages?.join(", ")}
                placeholder="https://example.com/work1.jpg, https://example.com/work2.jpg"
                className="bg-gray-700 border-gray-600 text-white"
                data-testid="input-portfolio-images"
              />
              <p className="text-xs text-gray-400 mt-1">Comma-separated URLs of work samples</p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="specialties" className="text-white">Specialties</Label>
            <Input
              id="specialties"
              name="specialties"
              defaultValue={vendor?.specialties.join(", ")}
              placeholder="Comma separated (e.g., Custom Booths, AV Setup)"
              className="bg-gray-700 border-gray-600 text-white"
              data-testid="input-specialties"
            />
          </div>
          <div>
            <Label htmlFor="services" className="text-white">Services</Label>
            <Input
              id="services"
              name="services"
              defaultValue={vendor?.services.join(", ")}
              placeholder="Comma separated services"
              className="bg-gray-700 border-gray-600 text-white"
              data-testid="input-services"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={vendor?.contact.email}
              className="bg-gray-700 border-gray-600 text-white"
              data-testid="input-email"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-white">Phone</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={vendor?.contact.phone}
              className="bg-gray-700 border-gray-600 text-white"
              data-testid="input-phone"
            />
          </div>
          <div>
            <Label htmlFor="website" className="text-white">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              defaultValue={vendor?.contact.website}
              className="bg-gray-700 border-gray-600 text-white"
              data-testid="input-website"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="rating" className="text-white">Rating (1-5)</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              min="1"
              max="5"
              step="0.1"
              defaultValue={vendor?.rating}
              className="bg-gray-700 border-gray-600 text-white"
              data-testid="input-rating"
            />
          </div>
          <div>
            <Label htmlFor="experience" className="text-white">Experience</Label>
            <Input
              id="experience"
              name="experience"
              defaultValue={vendor?.experience}
              placeholder="e.g., 10+ years"
              className="bg-gray-700 border-gray-600 text-white"
              data-testid="input-experience"
            />
          </div>
          <div>
            <Label htmlFor="priceRange" className="text-white">Price Range</Label>
            <Select name="priceRange" defaultValue={vendor?.priceRange}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Budget">Budget (₹)</SelectItem>
                <SelectItem value="Standard">Standard (₹₹)</SelectItem>
                <SelectItem value="Premium">Premium (₹₹₹)</SelectItem>
                <SelectItem value="Luxury">Luxury (₹₹₹₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="keywords" className="text-white">Search Keywords</Label>
          <Input
            id="keywords"
            name="keywords"
            defaultValue={vendor?.keywords.join(", ")}
            placeholder="Comma separated keywords for matching (e.g., booth, design, Mumbai)"
            className="bg-gray-700 border-gray-600 text-white"
            data-testid="input-keywords"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              value="true"
              defaultChecked={vendor?.isActive !== false}
              className="rounded border-gray-600 bg-gray-700"
              data-testid="checkbox-active"
            />
            <Label htmlFor="isActive" className="text-white">Active</Label>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
            data-testid="button-save-vendor"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              vendor ? "Update Vendor" : "Create Vendor"
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}