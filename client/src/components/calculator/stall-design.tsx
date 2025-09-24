import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Building2, Palette, Lightbulb, Users, Package, Zap, ChevronRight, Info, TrendingUp, PieChart, X } from "lucide-react";
import { StallCostPreview } from "./stall-cost-preview";
import { AITooltip } from "@/components/ui/ai-tooltip";


interface StallDesignData {
  // Booth Dimensions & Type
  area: number;
  areaUnit: 'sqm' | 'sqft';
  boothType: 'shell_scheme' | 'raw_space';
  boothPosition: 'inline' | 'corner' | 'island';

  // Structure & Build Materials
  wallType: 'octonorm' | 'mdf' | 'laminated_plywood' | 'modular_aluminum';
  flooring: 'carpeting' | 'raised_wooden' | 'vinyl_finish' | 'laminate' | 'marble' | 'ceramic';
  ceiling: 'open' | 'truss_lights' | 'branding_fascia';
  additionalRooms: string[];

  // Branding & Graphics
  printArea: number;
  brandingElements: string[];
  digitalDisplays: string[];

  // Furniture & Fixtures
  furnitureType: 'rental' | 'custom_build';
  furnitureItems: string[];

  // Lighting & Electricals
  lightingType: string[];
  powerRequirement: number;
  powerType: '1_phase' | '3_phase';

  // Manpower & Logistics
  installationDays: number;
  dismantlingDays: number;
  isOutstation: boolean;

  // Extras
  extras: string[];
}

interface StallDesignProps {
  data: StallDesignData;
  onUpdate: (data: Partial<StallDesignData>) => void;
}

const WALL_TYPES = [
  { value: 'octonorm', label: 'Octonorm System', description: 'Modular aluminum frame system', rate: 8500, premium: false },
  { value: 'mdf', label: 'MDF Panels', description: 'Medium density fiberboard', rate: 6000, premium: true },
  { value: 'laminated_plywood', label: 'Laminated Plywood', description: 'Premium wood finish', rate: 12000, premium: true },
  { value: 'modular_aluminum', label: 'Modular Aluminum', description: 'Lightweight modern system', rate: 15000, premium: true }
];

const FLOORING_OPTIONS = [
  { value: 'carpeting', label: 'Carpeting', rate: 450, premium: false },
  { value: 'raised_wooden', label: 'Raised Wooden Flooring', rate: 850, premium: true },
  { value: 'vinyl_finish', label: 'Vinyl Finish', rate: 650, premium: true },
  { value: 'laminate', label: 'Laminate Flooring', rate: 500, premium: true },
  { value: 'marble', label: 'Marble Finish', rate: 1200, premium: true },
  { value: 'ceramic', label: 'Ceramic Tiles', rate: 400, premium: true }
];

const BRANDING_ELEMENTS = [
  { id: 'flex_prints', label: 'Flex Prints', rate: 180, unit: 'sqm' },
  { id: 'vinyl_graphics', label: 'Vinyl Graphics', rate: 250, unit: 'sqm' },
  { id: 'fabric_prints', label: 'Fabric Prints', rate: 320, unit: 'sqm' },
  { id: '3d_logos', label: '3D Logos', rate: 8500, unit: 'piece' },
  { id: 'backlit_panels', label: 'Backlit Panels', rate: 1300, unit: 'sqm' },
  { id: 'led_walls', label: 'LED Video Walls', rate: 45000, unit: 'sqm' }
];

const FURNITURE_ITEMS = [
  { id: 'reception_counter', label: 'Reception Counter', rental: '₹2,500/event', custom: '₹15,000' },
  { id: 'meeting_table', label: 'Meeting Table', rental: '₹1,200/event', custom: '₹8,500' },
  { id: 'chairs_set', label: 'Chairs (Set of 4)', rental: '₹800/event', custom: '₹6,000' },
  { id: 'display_shelves', label: 'Display Shelves', rental: '₹1,500/event', custom: '₹12,000' },
  { id: 'brochure_stands', label: 'Brochure Stands', rental: '₹450/event', custom: '₹2,500' },
  { id: 'storage_cabinets', label: 'Storage Cabinets', rental: '₹1,800/event', custom: '₹15,000' }
];

const LIGHTING_OPTIONS = [
  { id: 'basic', label: 'Basic Lighting', rate: 0, premium: false },
  { id: 'led', label: 'LED Lighting', rate: 300, premium: true },
  { id: 'premium', label: 'Premium Lighting', rate: 600, premium: true },
  { id: 'designer', label: 'Designer Lighting', rate: 1000, premium: true },
  { id: 'smart', label: 'Smart Lighting System', rate: 1200, premium: true }
];

const EXTRA_OPTIONS = [
  { id: 'pantry_fitout', label: 'Pantry Fit-out', cost: '₹25,000' },
  { id: 'meeting_room', label: 'Glass Meeting Room', cost: '₹35,000' },
  { id: 'hanging_structures', label: 'Hanging Structures', cost: '₹18,000' },
  { id: 'greenery_decor', label: 'Greenery & Decor', cost: '₹8,500' },
  { id: 'branded_flooring', label: 'Branded Flooring Inlays', cost: '₹450/sqm' }
];

const FABRICATION_VENDORS = [
  {
    id: 'stall_vendor_1',
    name: 'Premium Stall Designers',
    location: 'Mumbai, Maharashtra',
    specialties: ['Custom Fabrication', 'Premium Materials', '3D Visualization', 'Project Management'],
    rating: 4.8,
    completedProjects: 200,
    priceRange: '₹12,000-18,000/sqm',
    portfolio: ['Tech Exhibitions', 'Luxury Brands', 'Automotive Shows'],
    certifications: ['ISO 9001', 'Fire Safety Certified'],
    turnaroundTime: '15-20 days',
    contact: { phone: '+91-22-2847-5555', email: 'design@premiumstall.com' }
  },
  {
    id: 'stall_vendor_2',
    name: 'Modular Booth Systems',
    location: 'Delhi, Delhi',
    specialties: ['Modular Systems', 'Quick Setup', 'Cost Effective', 'Sustainable Materials'],
    rating: 4.6,
    completedProjects: 350,
    priceRange: '₹8,000-12,000/sqm',
    portfolio: ['Trade Shows', 'B2B Exhibitions', 'Government Events'],
    certifications: ['Green Building', 'Quality Assured'],
    turnaroundTime: '10-15 days',
    contact: { phone: '+91-11-4567-8900', email: 'projects@modularbooth.com' }
  },
  {
    id: 'stall_vendor_3',
    name: 'Creative Exhibition Solutions',
    location: 'Bangalore, Karnataka',
    specialties: ['Creative Design', 'Interactive Elements', 'Technology Integration', 'Brand Activation'],
    rating: 4.9,
    completedProjects: 180,
    priceRange: '₹15,000-25,000/sqm',
    portfolio: ['IT Exhibitions', 'Startups', 'Innovation Showcases'],
    certifications: ['Tech Partner', 'Innovation Award'],
    turnaroundTime: '20-25 days',
    contact: { phone: '+91-80-9876-5432', email: 'creative@exhisolutions.com' }
  }
];

// Helper function to calculate actual cost based on area
const calculateActualCost = (rate: number, area: number, unit: 'sqm' | 'piece' = 'sqm'): string => {
  if (unit === 'piece') {
    return `₹${rate.toLocaleString()}`;
  }
  const totalCost = rate * area;
  return `₹${totalCost.toLocaleString()}`;
};

// Helper function to format cost display
const formatCostDisplay = (rate: number, area: number, unit: 'sqm' | 'piece' = 'sqm'): string => {
  if (unit === 'piece') {
    return `₹${rate.toLocaleString()}/piece`;
  }
  if (area > 0) {
    const totalCost = rate * area;
    return `₹${totalCost.toLocaleString()} (₹${rate}/sqm × ${area} sqm)`;
  }
  return `₹${rate}/sqm`;
};

export function StallDesign({ data, onUpdate }: StallDesignProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Safe onUpdate function to prevent errors
  const safeOnUpdate = onUpdate || (() => {});

  // Use a safe version of data to prevent errors when data is not fully loaded
  const safeData = data || {
    area: 0,
    areaUnit: 'sqm' as 'sqm' | 'sqft',
    boothType: 'shell_scheme' as 'shell_scheme' | 'raw_space',
    boothPosition: 'inline' as 'inline' | 'corner' | 'island',
    wallType: 'octonorm' as 'octonorm' | 'mdf' | 'laminated_plywood' | 'modular_aluminum',
    flooring: 'carpeting' as 'carpeting' | 'raised_wooden' | 'vinyl_finish' | 'laminate' | 'marble' | 'ceramic',
    ceiling: 'open' as 'open' | 'truss_lights' | 'branding_fascia',
    additionalRooms: [] as string[],
    printArea: 0,
    brandingElements: [] as string[],
    digitalDisplays: [] as string[],
    furnitureType: 'rental' as 'rental' | 'custom_build',
    furnitureItems: [] as string[],
    lightingType: [] as string[],
    powerRequirement: 0,
    powerType: '1_phase' as '1_phase' | '3_phase',
    installationDays: 3,
    dismantlingDays: 1,
    isOutstation: false,
    extras: [] as string[]
  } as StallDesignData;


  // Listen for budget wizard events
  useEffect(() => {
    const handleCloseBudgetWizard = () => {
      // Budget wizard closed via event
      console.log('Budget wizard closed');
    };

    const handleBudgetAllocationUpdated = (event: any) => {
      // Force re-render of stall design components to reflect new budget-based pricing
      console.log('Budget allocation updated, refreshing stall design pricing');
      // Force re-render by updating the data object completely
      const updatedData = { ...data };
      safeOnUpdate(updatedData);

      // Also force a re-render by updating a state variable that triggers recalculation
      setShowAdvanced(prev => !prev);
      setTimeout(() => setShowAdvanced(prev => !prev), 10);
    };

    window.addEventListener('closeBudgetWizard', handleCloseBudgetWizard);
    window.addEventListener('budgetAllocationUpdated', handleBudgetAllocationUpdated);

    return () => {
      window.removeEventListener('closeBudgetWizard', handleCloseBudgetWizard);
      window.removeEventListener('budgetAllocationUpdated', handleBudgetAllocationUpdated);
    };
  }, [data, onUpdate]);

  const handleCheckboxChange = (field: keyof StallDesignData, value: string, checked: boolean) => {
    const currentArray = (safeData[field] as string[]) || [];
    if (checked) {
      safeOnUpdate({ [field]: [...currentArray, value] });
    } else {
      safeOnUpdate({ [field]: currentArray.filter(item => item !== value) });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-8">
        <Building2 className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-2 sm:mb-4" />
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Stall Design & Fabrication</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Configure your booth specifications, materials, and design preferences
        </p>
      </div>

      {/* Booth Dimensions & Type */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Booth Dimensions & Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="area">Booth Area</Label>
                <AITooltip 
                  context="booth-design"
                  fieldName="area"
                  currentValue={safeData?.area}
                  formData={safeData}
                  position="top"
                />
              </div>
              <Input
                id="area"
                type="text"
                value={safeData?.area || ''}
                onChange={(e) => safeOnUpdate({ area: parseInt(e.target.value) || 0 })}
                placeholder="e.g., 36"
                pattern="[0-9]*"
                inputMode="numeric"
              />
            </div>
            <div>
              <Label htmlFor="areaUnit">Unit</Label>
              <Select value={safeData?.areaUnit || 'sqm'} onValueChange={(value: 'sqm' | 'sqft') => safeOnUpdate({ areaUnit: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sqm">Square Meters (sqm)</SelectItem>
                  <SelectItem value="sqft">Square Feet (sq.ft.)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="boothPosition">Position</Label>
              <Select value={safeData?.boothPosition || 'inline'} onValueChange={(value: 'inline' | 'corner' | 'island') => safeOnUpdate({ boothPosition: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inline">Inline (Standard)</SelectItem>
                  <SelectItem value="corner">Corner (+10% visibility)</SelectItem>
                  <SelectItem value="island">Island (+25% visibility)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="boothType">Booth Type</Label>
              <Select value={safeData?.boothType || 'shell_scheme'} onValueChange={(value: 'shell_scheme' | 'raw_space') => safeOnUpdate({ boothType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select booth type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shell_scheme">Shell Scheme (Basic panels provided)</SelectItem>
                  <SelectItem value="raw_space">Raw Space (Build everything)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Structure & Build Materials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Structure & Build Materials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label>Wall Type</Label>
              <AITooltip 
                context="booth-design"
                fieldName="wallType"
                currentValue={safeData?.wallType}
                formData={safeData}
                position="top"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {WALL_TYPES.map((wall) => (
                <div
                  key={wall.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-300 hover-lift hover-glow group ${
                    safeData.wallType === wall.value ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                  onClick={() => safeOnUpdate({ wallType: wall.value as any })}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium group-hover:text-blue-600 transition-colors duration-200">{wall.label}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="group-hover:border-blue-400 transition-colors duration-200">
                        {formatCostDisplay(wall.rate, safeData.area || 0)}
                      </Badge>
                      {wall.premium && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium hover-scale">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{wall.description}</p>
                  {wall.premium && safeData.wallType === wall.value && (
                    <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm fade-in">
                      <span className="text-orange-700 font-medium">Premium Upgrade Applied:</span>
                      <span className="text-orange-600"> This selection increases fabrication cost</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Flooring</Label>
            <div className="grid grid-cols-1 gap-3 mt-2">
              {FLOORING_OPTIONS.map((option) => (
                <label key={option.value} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 ${
                  safeData.flooring === option.value ? 'border-primary bg-primary/10' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="flooring"
                      value={option.value}
                      checked={safeData.flooring === option.value}
                      onChange={(e) => safeOnUpdate({ flooring: e.target.value as any })}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{option.label}</span>
                      {option.premium && (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {formatCostDisplay(option.rate, safeData.area || 0)}
                  </Badge>
                </label>
              ))}
            </div>
            {safeData?.flooring && FLOORING_OPTIONS.find(opt => opt.value === safeData.flooring)?.premium && (
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm fade-in">
                <span className="text-orange-700 font-medium">Premium Upgrade Applied:</span>
                <span className="text-orange-600"> {FLOORING_OPTIONS.find(opt => opt.value === safeData.flooring)?.label} increases cost</span>
              </div>
            )}
          </div>

          <div>
            <Label>Ceiling Type</Label>
            <Select value={safeData?.ceiling} onValueChange={(value: 'open' | 'truss_lights' | 'branding_fascia') => safeOnUpdate({ ceiling: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select ceiling" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open Ceiling - ₹0</SelectItem>
                <SelectItem value="truss_lights">Truss with Lights - {formatCostDisplay(2500, safeData.area || 0)}</SelectItem>
                <SelectItem value="branding_fascia">Branding Fascia - {formatCostDisplay(4500, safeData.area || 0)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Additional Rooms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Additional Rooms & Spaces
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Additional Rooms</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {['Storage Room', 'Meeting Room', 'Pantry', 'Reception Area'].map((room) => {
                const isSelected = safeData.additionalRooms?.includes(room) || false;
                return (
                  <div 
                    key={room} 
                    className={`checkbox-container ${isSelected ? 'selected' : ''} border rounded-lg`}
                    onClick={() => handleCheckboxChange('additionalRooms', room, !isSelected)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckboxChange('additionalRooms', room, !isSelected)}
                      className="checkbox-input"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="flex-1 font-medium">{room}</span>
                    {isSelected && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium ml-2">
                        Selected
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branding & Graphics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Branding & Graphics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="printArea">Print Area (sqm)</Label>
            <Input
              id="printArea"
              type="text"
              value={safeData?.printArea || ''}
              onChange={(e) => safeOnUpdate({ printArea: parseInt(e.target.value) || 0 })}
              placeholder="Graphics and print area in sqm"
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </div>

          <div>
            <Label>Branding Elements</Label>
            <div className="grid grid-cols-1 gap-3 mt-2">
              {BRANDING_ELEMENTS.map((element) => {
                const isSelected = safeData.brandingElements?.includes(element.id) || false;
                return (
                  <div 
                    key={element.id} 
                    className={`checkbox-container ${isSelected ? 'selected' : ''} border rounded-lg justify-between`}
                    onClick={() => handleCheckboxChange('brandingElements', element.id, !isSelected)}
                  >
                    <div className="flex items-center flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange('brandingElements', element.id, !isSelected)}
                        className="checkbox-input"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="font-medium">{element.label}</span>
                      {isSelected && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium ml-2">
                          Selected
                        </span>
                      )}
                    </div>
                    <Badge variant="outline" className={`ml-2 ${isSelected ? 'border-emerald-400 text-emerald-600' : ''}`}>
                      {element.unit === 'sqm' ? formatCostDisplay(element.rate, safeData.printArea || 0, element.unit as 'sqm' | 'piece') : formatCostDisplay(element.rate, 1, element.unit as 'sqm' | 'piece')}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Options Toggle */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2"
        >
          <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Options</span>
          <ChevronRight className={`w-4 h-4 transform ${showAdvanced ? 'rotate-90' : ''}`} />
        </Button>
      </div>

      {showAdvanced && (
        <>
          {/* Furniture & Fixtures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Furniture & Fixtures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Furniture Type</Label>
                <Select value={safeData?.furnitureType} onValueChange={(value: 'rental' | 'custom_build') => safeOnUpdate({ furnitureType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select furniture type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rental">Rental (Cost Effective)</SelectItem>
                    <SelectItem value="custom_build">Custom Build (Premium)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Furniture Items</Label>
                <div className="space-y-2 mt-2">
                  {FURNITURE_ITEMS.map((item) => (
                    <label key={item.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-300 hover-lift group ${
                      safeData.furnitureItems?.includes(item.id) ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={safeData?.furnitureItems?.includes(item.id) || false}
                          onCheckedChange={(checked) => handleCheckboxChange('furnitureItems', item.id, checked as boolean)}
                          className="hover-scale"
                        />
                        <span className="group-hover:text-blue-600 transition-colors duration-200">{item.label}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium hover-scale">
                          +₹2.5k cost
                        </span>
                      </div>
                      <div className="text-right text-sm">
                        <div>Rental: {item.rental}</div>
                        <div>Custom: {item.custom}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lighting & Electricals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Lighting & Electricals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Lighting Options</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {LIGHTING_OPTIONS.map((light) => (
                    <label key={light.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-300 hover-lift group ${
                      safeData.lightingType?.includes(light.id) ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={safeData?.lightingType?.includes(light.id) || false}
                          onCheckedChange={(checked) => handleCheckboxChange('lightingType', light.id, checked as boolean)}
                          className="hover-scale"
                        />
                        <span className="group-hover:text-blue-600 transition-colors duration-200">{light.label}</span>
                        {light.premium && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium hover-scale">
                            Premium
                          </span>
                        )}
                      </div>
                      <Badge variant="outline" className="group-hover:border-blue-400 transition-colors duration-200">
                        {light.rate === 0 ? 'Base rate' : formatCostDisplay(light.rate, safeData.area || 0)}
                      </Badge>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="powerRequirement">Power Requirement (kW)</Label>
                  <Input
                    id="powerRequirement"
                    type="text"
                    value={safeData?.powerRequirement || ''}
                    onChange={(e) => safeOnUpdate({ powerRequirement: parseInt(e.target.value) || 0 })}
                    placeholder="e.g., 5"
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <Label>Power Type</Label>
                  <Select value={safeData?.powerType} onValueChange={(value: '1_phase' | '3_phase') => safeOnUpdate({ powerType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select power type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1_phase">Single Phase</SelectItem>
                      <SelectItem value="3_phase">3-Phase Supply</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extras */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Premium Extras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {EXTRA_OPTIONS.map((extra) => {
                  const isSelected = safeData.extras?.includes(extra.id) || false;
                  return (
                    <label key={extra.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-300 hover-lift group ${
                      isSelected ? 'border-primary bg-primary/10 shadow-md' : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                    }`}>
                      <div className="flex items-center space-x-3 flex-1">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleCheckboxChange('extras', extra.id, checked as boolean)}
                          className="hover-scale w-5 h-5 sm:w-4 sm:h-4"
                        />
                        <span className={`font-medium transition-colors duration-200 ${
                          isSelected ? 'text-primary' : 'text-gray-900 group-hover:text-primary'
                        }`}>{extra.label}</span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                          Premium Extra
                        </span>
                        {isSelected && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                              ✓ Selected
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className={`${isSelected ? 'border-primary text-primary' : ''}`}>{extra.cost}</Badge>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Cost Preview */}
      <div className="space-y-4">
        <StallCostPreview stallData={safeData} currency="INR" />
      </div>
    </div>
  );
}