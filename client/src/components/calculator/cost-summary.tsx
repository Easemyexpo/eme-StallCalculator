import { Calculator, Download, RotateCcw, Lightbulb, Zap, Trophy, Star, TrendingUp, Target } from "lucide-react";
import { CostBreakdown, CURRENCY_SYMBOLS } from "@shared/schema";
import { useState, useEffect } from "react";

interface CostSummaryProps {
  costs: CostBreakdown;
  selectedFlights?: any;
  selectedHotel?: any;
  stallData?: any;
  currency: string;
  onReset?: () => void;
}

export function CostSummary({ costs, selectedFlights, selectedHotel, stallData, currency, onReset }: CostSummaryProps) {
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [savingsAlert, setSavingsAlert] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    // Always use Indian Rupees
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  };

  // Calculate stall selections cost first
  const getStallSelectionsCost = () => {
    if (!stallData) return 0;
    let total = 0;
    
    if (stallData.furniture) total += 15000;
    if (stallData.avEquipment) total += 25000;
    if (stallData.lighting) total += 12000;
    if (stallData.internet) total += 8000;
    if (stallData.storage) total += 5000;
    if (stallData.security) total += 10000;
    
    return total;
  };

  const stallSelectionsCost = getStallSelectionsCost();

  // Calculate total including selections
  const flightCost = Object.values(selectedFlights || {}).reduce((total: number, flight: any) => {
    return total + (flight?.price || 0);
  }, 0);
  
  const hotelCost = selectedHotel?.totalPrice || 0;
  const totalWithSelections = costs.total + flightCost + hotelCost + stallSelectionsCost;

  // Gamification: Animate total when it changes (every pricing change) - ALWAYS VISIBLE
  useEffect(() => {
    if (totalWithSelections !== animatedTotal) {
      setIsAnimating(true);
      
      const duration = 600; // Smooth animation
      const steps = 20;
      let currentValue = animatedTotal;
      
      const timer = setInterval(() => {
        const diff = totalWithSelections - currentValue;
        currentValue += diff / 8; // Smooth easing
        
        if (Math.abs(diff) < 50) {
          currentValue = totalWithSelections;
          clearInterval(timer);
          setIsAnimating(false);
          
          // Show celebration for major cost milestones
          if (totalWithSelections > 800000 && !showCelebration) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
          }
        }
        setAnimatedTotal(currentValue);
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [totalWithSelections]); // Simplified dependencies for better responsiveness

  // Gamification: Smart savings alerts
  useEffect(() => {
    if (totalWithSelections > 0) {
      const baselineExpensive = totalWithSelections * 1.3; // 30% more expensive baseline
      
      if (flightCost > 0 && hotelCost > 0) {
        const savings = baselineExpensive - totalWithSelections;
        if (savings > 50000) {
          setSavingsAlert(`🎉 Great choices! You're saving ₹${Math.round(savings).toLocaleString()} vs premium options!`);
          setTimeout(() => setSavingsAlert(null), 5000);
        }
      }
    }
  }, [totalWithSelections, flightCost, hotelCost]);


  const costItems = [
    { label: 'Booth Rental', amount: costs.boothCost, icon: '🏢' },
    { label: 'Construction', amount: costs.constructionCost, icon: '🔨' },
    ...(stallSelectionsCost > 0 ? [{ label: 'Stall Selections', amount: stallSelectionsCost, icon: '🎨' }] : []),
    { label: 'Travel Base', amount: costs.travelCost, icon: '✈️' },
    ...(flightCost > 0 ? [{ label: 'Selected Flights', amount: flightCost, icon: '🎫' }] : []),
    ...(hotelCost > 0 ? [{ label: 'Selected Hotel', amount: hotelCost, icon: '🏨' }] : []),
    { label: 'Logistics & Shipping', amount: costs.logisticsCost, icon: '🚛' },
    { label: 'Staff & Operations', amount: costs.staffCost, icon: '👥' },
    { label: 'Marketing', amount: costs.marketingCost, icon: '📢' },
    { label: 'Additional Services', amount: costs.servicesCost, icon: '🔧' }
  ];

  const getBudgetStatus = () => {
    if (totalWithSelections === 0) return { label: "Ready to Calculate", color: "text-gray-500", icon: Calculator };
    if (totalWithSelections < 200000) return { label: "Budget-Friendly", color: "text-green-600", icon: Target };
    if (totalWithSelections < 500000) return { label: "Standard Investment", color: "text-blue-600", icon: TrendingUp };
    if (totalWithSelections < 800000) return { label: "Premium Package", color: "text-orange-600", icon: Star };
    return { label: "Luxury Exhibition", color: "text-purple-600", icon: Trophy };
  };

  const budgetStatus = getBudgetStatus();
  const StatusIcon = budgetStatus.icon;

  return (
    <div className="space-y-4 cost-summary-detail" data-testid="card-cost-summary">
      {/* Real-time pricing indicator - ALWAYS VISIBLE */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
        <div className="flex items-center space-x-2">
          {isAnimating && (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Updating prices...</span>
            </>
          )}
          {!isAnimating && (
            <>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-600 font-medium">Live pricing active</span>
            </>
          )}
        </div>
        <div className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
          Smart Calculator 🎯
        </div>
      </div>
      {/* Savings Alert */}
      {savingsAlert && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center animate-pulse">
          <div className="text-sm text-green-700 font-medium">{savingsAlert}</div>
        </div>
      )}

      {/* Total Amount with Gamification */}
      <div className={`bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 text-center relative overflow-hidden hover-lift hover-glow transition-all duration-300 ${showCelebration ? 'bounce-elastic' : ''}`}>
        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-4xl animate-ping">🎉</div>
          </div>
        )}
        
        <div className="flex items-center justify-center space-x-2 mb-1">
          <StatusIcon className={`w-4 h-4 ${budgetStatus.color}`} />
          <div className={`text-sm font-medium ${budgetStatus.color}`}>{budgetStatus.label}</div>
        </div>
        
        <div className={`text-2xl font-bold ${isAnimating ? 'text-green-600 animate-pulse' : 'text-primary'} transition-colors duration-300`} data-testid="total-cost">
          {formatCurrency(animatedTotal)}
          {isAnimating && <span className="text-sm ml-2 text-green-600">✨</span>}
        </div>
        
        {totalWithSelections > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            Cost per sqm: {formatCurrency(totalWithSelections / ((costs as any).area || 18))}
          </div>
        )}
        
        {/* Progress Bar for Budget Ranges */}
        {totalWithSelections > 0 && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  totalWithSelections < 200000 ? 'bg-green-500' :
                  totalWithSelections < 500000 ? 'bg-blue-500' :
                  totalWithSelections < 800000 ? 'bg-orange-500' : 'bg-purple-500'
                }`}
                style={{ width: `${Math.min(100, (totalWithSelections / 1000000) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Budget</span>
              <span>Luxury</span>
            </div>
          </div>
        )}
      </div>

      {/* Simplified Calculation Breakdown - PRIORITY DISPLAY */}
      {(costs as any)?.simplifiedBreakdown && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-blue-900">Dynamic Pricing Calculation</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-semibold">Live Pricing</span>
              {(costs as any).fabricationRateUsed && (costs as any).fabricationRateUsed > 8000 && (
                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full font-semibold">
                  Premium Options Applied
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-white rounded border border-blue-200">
              <span className="text-blue-700">🏢 Space Cost (₹12k/sqm)</span>
              <span className="font-bold text-blue-900">{formatCurrency((costs as any).simplifiedBreakdown.space_cost)}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded border border-blue-200">
              <div className="flex flex-col">
                <span className="text-blue-700">🏗️ Stall Fabrication</span>
                <div className="text-xs text-blue-500 mt-1">
                  {(costs as any).fabricationRateUsed && (
                    <span>Rate: ₹{Math.round((costs as any).fabricationRateUsed).toLocaleString()}/sqm</span>
                  )}
                  {(costs as any).fabricationDetails && (costs as any).fabricationDetails !== 'Base package' && (
                    <span className="block">Upgrades: {(costs as any).fabricationDetails}</span>
                  )}
                </div>
              </div>
              <span className="font-bold text-blue-900">{formatCurrency((costs as any).simplifiedBreakdown.stall_fabrication_cost)}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded border border-blue-200">
              <span className="text-blue-700">✈️ Travel & Hotels</span>
              <span className="font-bold text-blue-900">{formatCurrency((costs as any).simplifiedBreakdown.travel_hotel)}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded border border-blue-200">
              <span className="text-blue-700">📢 Marketing</span>
              <span className="font-bold text-blue-900">{formatCurrency((costs as any).simplifiedBreakdown.marketing)}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded border border-blue-200">
              <span className="text-blue-700">🚚 Logistics</span>
              <span className="font-bold text-blue-900">{formatCurrency((costs as any).simplifiedBreakdown.logistics)}</span>
            </div>
          </div>
          
          {/* Premium Selections Summary */}
          {(costs as any).fabricationRateUsed && (costs as any).fabricationRateUsed > 8000 && (
            <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs">
              <span className="font-medium text-orange-800">Premium Selections Impact:</span>
              <span className="text-orange-700"> +₹{((costs as any).fabricationRateUsed - 8000).toLocaleString()}/sqm above base rate</span>
            </div>
          )}
        </div>
      )}

      {/* Cost Breakdown with Gamification */}
      <div className="space-y-2">
        {totalWithSelections === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <div className="text-sm font-medium mb-1">Ready to Calculate</div>
            <div className="text-xs">Fill in your exhibition details to see pricing</div>
          </div>
        ) : (
          costItems.map((item, index) => (
            item.amount >= 0 && (
              <div key={index} className={`flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0 transition-all duration-300 hover:bg-gray-50 rounded px-2 ${item.amount > 0 ? 'opacity-100' : 'opacity-60'}`}>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.amount > 100000 && <Zap className="w-3 h-3 text-yellow-500" />}
                </div>
                <span className={`text-sm font-medium ${item.amount > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                  {formatCurrency(item.amount)}
                  {item.amount === 0 && <span className="text-xs text-gray-400 ml-1">(pending)</span>}
                </span>
              </div>
            )
          ))
        )}
      </div>

      {/* All gamification completely removed */}

      {/* All achievement badges and gamification completely removed */}

      {/* Action Buttons */}
      <div className="pt-4 space-y-2">
        {totalWithSelections > 0 && (
          <button
            onClick={() => {
              const exportText = `Exhibition Cost Estimate\nGenerated: ${new Date().toLocaleDateString()}\n\nTotal: ${formatCurrency(totalWithSelections)}\n\n${costItems.map(item => `${item.label}: ${formatCurrency(item.amount)}`).join('\n')}\n\nGenerated by EaseMyExpo`;
              const blob = new Blob([exportText], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `exhibition-quote-${Date.now()}.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-sm"
            data-testid="button-export"
          >
            <Download className="w-4 h-4" />
            <span>Export Quote</span>
          </button>
        )}

        {totalWithSelections === 0 && (
          <div className="text-center py-2">
            <div className="text-xs text-gray-400">Complete your details to unlock export options</div>
          </div>
        )}

        {onReset && (
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
            data-testid="reset-button"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start New Quote</span>
          </button>
        )}
      </div>
    </div>
  );
}