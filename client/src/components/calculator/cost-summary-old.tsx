import { Calculator, Download, Share2, RotateCcw, Lightbulb, Zap, Trophy, Star, TrendingUp, Target } from "lucide-react";
import { CostBreakdown, CURRENCY_SYMBOLS } from "@shared/schema";
import { useState, useEffect } from "react";

interface CostSummaryProps {
  costs: CostBreakdown;
  selectedFlights?: any;
  selectedHotel?: any;
  currency: string;
  onReset?: () => void;
}

export function CostSummary({ costs, selectedFlights, selectedHotel, currency, onReset }: CostSummaryProps) {
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [savingsAlert, setSavingsAlert] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    const symbol = CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] || '$';
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  };

  // Calculate total including selections
  const flightCost = Object.values(selectedFlights || {}).reduce((total: number, flight: any) => {
    return total + (flight?.price || 0);
  }, 0);
  
  const hotelCost = selectedHotel?.totalPrice || 0;
  const totalWithSelections = costs.total + flightCost + hotelCost;

  // Gamification: Animate total when it changes
  useEffect(() => {
    if (totalWithSelections > 0 && totalWithSelections !== animatedTotal) {
      setIsAnimating(true);
      
      // Animate counter
      const duration = 1000; // 1 second
      const steps = 30;
      const increment = totalWithSelections / steps;
      let currentValue = 0;
      
      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= totalWithSelections) {
          currentValue = totalWithSelections;
          clearInterval(timer);
          setIsAnimating(false);
          
          // Show celebration for significant milestones
          if (totalWithSelections > 500000) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 2000);
          }
        }
        setAnimatedTotal(currentValue);
      }, duration / steps);
      
      return () => clearInterval(timer);
    } else if (totalWithSelections === 0) {
      setAnimatedTotal(0);
    }
  }, [totalWithSelections]);

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
    <div className="space-y-4" data-testid="card-cost-summary">
      {/* Savings Alert */}
      {savingsAlert && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center animate-pulse">
          <div className="text-sm text-green-700 font-medium">{savingsAlert}</div>
        </div>
      )}

      {/* Total Amount with Gamification */}
      <div className={`bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 text-center relative overflow-hidden ${showCelebration ? 'animate-bounce' : ''}`}>
        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-4xl animate-ping">🎉</div>
          </div>
        )}
        
        <div className="flex items-center justify-center space-x-2 mb-1">
          <StatusIcon className={`w-4 h-4 ${budgetStatus.color}`} />
          <div className={`text-sm font-medium ${budgetStatus.color}`}>{budgetStatus.label}</div>
        </div>
        
        <div className={`text-2xl font-bold ${isAnimating ? 'text-blue-600 animate-pulse' : 'text-primary'} transition-colors duration-300`} data-testid="total-cost">
          {formatCurrency(animatedTotal)}
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

      {/* Gamified Insights */}
      {totalWithSelections > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Smart Insights</span>
          </div>
          <div className="text-xs text-blue-700 space-y-1">
            {costs.boothCost > costs.constructionCost && (
              <div>• Space rental (₹{Math.round(costs.boothCost / ((costs as any).area || 18)).toLocaleString()}/sqm) is your largest cost</div>
            )}
            {(flightCost + hotelCost) > costs.boothCost && (
              <div>• Travel costs exceed booth expenses - consider local options</div>
            )}
            {totalWithSelections < 300000 && (
              <div>• Excellent value! You're in the budget-friendly range</div>
            )}
            {totalWithSelections > 700000 && (
              <div>• Premium setup - ensure ROI planning with marketing team</div>
            )}
          </div>
        </div>
      )}

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