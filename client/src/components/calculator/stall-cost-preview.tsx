import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp } from "lucide-react";
import { calculateStallCosts, type StallCostBreakdown } from "@/lib/stall-calculator";

interface StallCostPreviewProps {
  stallData: any;
  currency?: string;
  className?: string;
}

export function StallCostPreview({ stallData, currency = "INR", className }: StallCostPreviewProps) {
  // Safe defaults for stallData
  const safeStallData = stallData || {
    area: 20,
    wallType: 'octonorm',
    flooring: 'carpeting',
    brandingElements: [],
    furnitureItems: [],
    lightingType: [],
    extras: [],
    additionalRooms: []
  };

  const area = safeStallData.area || 20;

  if (area === 0) {
    return (
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardContent className="p-6">
          <div className="text-center text-gray-600">
            <Calculator className="w-12 h-12 mx-auto mb-3 text-orange-400" />
            <p className="text-lg font-medium text-gray-800 mb-2">Enter Booth Area</p>
            <p className="text-sm">Add your booth size to see detailed cost breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    const symbols: Record<string, string> = { INR: "₹", USD: "$", EUR: "€" };
    return `${symbols[currency] || "₹"}${amount.toLocaleString()}`;
  };

  const getCostPerSqm = (cost: number) => {
    return area > 0 ? Math.round(cost / area) : 0;
  };

  const handleBudgetAllocation = () => {
    // Budget allocation functionality would go here
    console.log('Budget allocation requested for:', costs?.totalCost || 0);
  };

  // Calculate enhanced costs with more detailed breakdown
  const costs = useMemo(() => {
    const result = calculateStallCosts(safeStallData);
    console.log('Stall Calculator Debug:', result);
    return result;
  }, [safeStallData, currency]);

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-green-600" />
            <span className="text-green-800">Live Cost Calculation</span>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
            {area} sqm
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Cost Display */}
        <div className="bg-white/70 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-gray-800">Total Stall Cost</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {formatCurrency(costs.totalCost)}
          </div>
          <div className="text-sm text-gray-600">
            {formatCurrency(getCostPerSqm(costs.totalCost))}/sqm average
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-3">
          {/* Structural Costs */}
          {(costs.structuralCosts.wallCost > 0 || costs.structuralCosts.flooringCost > 0) && (
            <div className="bg-white/50 rounded-lg p-3">
              <h4 className="font-medium text-gray-800 mb-2">Structure & Build</h4>
              <div className="space-y-1 text-sm">
                {costs.structuralCosts.wallCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wall System ({safeStallData.wallType})</span>
                    <span className="font-medium">{formatCurrency(costs.structuralCosts.wallCost)}</span>
                  </div>
                )}
                {costs.structuralCosts.flooringCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flooring ({safeStallData.flooring})</span>
                    <span className="font-medium">{formatCurrency(costs.structuralCosts.flooringCost)}</span>
                  </div>
                )}
                {costs.structuralCosts.ceilingCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ceiling ({safeStallData.ceiling})</span>
                    <span className="font-medium">{formatCurrency(costs.structuralCosts.ceilingCost)}</span>
                  </div>
                )}
                {costs.structuralCosts.additionalRoomsCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Additional Rooms ({safeStallData.additionalRooms?.length || 0})</span>
                    <span className="font-medium">{formatCurrency(costs.structuralCosts.additionalRoomsCost)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Branding Costs */}
          {(costs.brandingCosts.printAreaCost > 0 || costs.brandingCosts.brandingElementsCost > 0) && (
            <div className="bg-white/50 rounded-lg p-3">
              <h4 className="font-medium text-gray-800 mb-2">Branding & Graphics</h4>
              <div className="space-y-1 text-sm">
                {costs.brandingCosts.printAreaCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Print Area ({safeStallData.printArea} sqm)</span>
                    <span className="font-medium">{formatCurrency(costs.brandingCosts.printAreaCost)}</span>
                  </div>
                )}
                {costs.brandingCosts.brandingElementsCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Branding Elements ({safeStallData.brandingElements?.length || 0})</span>
                    <span className="font-medium">{formatCurrency(costs.brandingCosts.brandingElementsCost)}</span>
                  </div>
                )}
                {costs.brandingCosts.digitalDisplaysCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Digital Displays</span>
                    <span className="font-medium">{formatCurrency(costs.brandingCosts.digitalDisplaysCost)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Furniture Costs */}
          {(costs.furnitureCosts.rentalCost > 0 || costs.furnitureCosts.customBuildCost > 0) && (
            <div className="bg-white/50 rounded-lg p-3">
              <h4 className="font-medium text-gray-800 mb-2">Furniture & Fixtures</h4>
              <div className="space-y-1 text-sm">
                {costs.furnitureCosts.rentalCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rental Furniture ({safeStallData.furnitureItems?.length || 0} items)</span>
                    <span className="font-medium">{formatCurrency(costs.furnitureCosts.rentalCost)}</span>
                  </div>
                )}
                {costs.furnitureCosts.customBuildCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Custom Build Furniture</span>
                    <span className="font-medium">{formatCurrency(costs.furnitureCosts.customBuildCost)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Technical Costs */}
          {(costs.technicalCosts.lightingCost > 0 || costs.technicalCosts.powerCost > 0) && (
            <div className="bg-white/50 rounded-lg p-3">
              <h4 className="font-medium text-gray-800 mb-2">Technical & Electrical</h4>
              <div className="space-y-1 text-sm">
                {costs.technicalCosts.lightingCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lighting ({safeStallData.lightingType?.length || 0} types)</span>
                    <span className="font-medium">{formatCurrency(costs.technicalCosts.lightingCost)}</span>
                  </div>
                )}
                {costs.technicalCosts.powerCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Power ({safeStallData.powerRequirement || 5}kW)</span>
                    <span className="font-medium">{formatCurrency(costs.technicalCosts.powerCost)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Labor Costs */}
          {(costs.laborCosts.installationCost > 0 || costs.laborCosts.dismantlingCost > 0) && (
            <div className="bg-white/50 rounded-lg p-3">
              <h4 className="font-medium text-gray-800 mb-2">Installation & Labor</h4>
              <div className="space-y-1 text-sm">
                {costs.laborCosts.installationCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Installation ({safeStallData.installationDays || 3} days)</span>
                    <span className="font-medium">{formatCurrency(costs.laborCosts.installationCost)}</span>
                  </div>
                )}
                {costs.laborCosts.dismantlingCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dismantling ({safeStallData.dismantlingDays || 1} day)</span>
                    <span className="font-medium">{formatCurrency(costs.laborCosts.dismantlingCost)}</span>
                  </div>
                )}
                {costs.laborCosts.outstationCharges > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Outstation Charges</span>
                    <span className="font-medium">{formatCurrency(costs.laborCosts.outstationCharges)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Position Premium */}
        {safeStallData.boothPosition !== 'inline' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {safeStallData.boothPosition === 'corner' ? 'Corner Position (+10%)' : 'Island Position (+25%)'}
              </span>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                Premium Location
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}