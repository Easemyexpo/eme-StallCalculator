import React, { useState, useEffect } from 'react';
import { TrendingUp, Brain, Target, AlertTriangle, CheckCircle, BarChart3, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessPredictorProps {
  formData: any;
  costs: any;
  selectedFlights?: any;
  selectedHotel?: any;
}

interface SuccessPrediction {
  overallScore: number;
  level: 'High' | 'Medium' | 'Low';
  factors: {
    category: string;
    score: number;
    impact: string;
    recommendations: string[];
  }[];
  insights: string[];
  riskFactors: string[];
  recommendations: string[];
}

export function SuccessPredictor({ formData, costs, selectedFlights, selectedHotel }: SuccessPredictorProps) {
  const [prediction, setPrediction] = useState<SuccessPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const analyzePrediction = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/success-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          costs,
          selectedFlights,
          selectedHotel
        })
      });

      if (response.ok) {
        const result = await response.json();
        setPrediction(result);
      } else {
        // Fallback to client-side analysis if API fails
        const clientAnalysis = generateClientPrediction();
        setPrediction(clientAnalysis);
      }
    } catch (error) {
      console.error('Success prediction error:', error);
      // Generate client-side prediction as fallback
      const clientAnalysis = generateClientPrediction();
      setPrediction(clientAnalysis);
    } finally {
      setIsLoading(false);
    }
  };

  const generateClientPrediction = (): SuccessPrediction => {
    const factors: SuccessPrediction['factors'] = [];
    let totalScore = 0;
    const insights: string[] = [];
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    // Booth Size Analysis (20% weight)
    const boothSize = formData.customSize || formData.boothSize || 18;
    let boothScore = 0;
    if (boothSize >= 50) {
      boothScore = 95;
      insights.push("Large booth size provides excellent visitor attraction potential");
    } else if (boothSize >= 25) {
      boothScore = 80;
      insights.push("Medium booth size offers good visibility and space for demonstrations");
    } else {
      boothScore = 60;
      riskFactors.push("Small booth size may limit visitor engagement");
      recommendations.push("Consider upgrading to a larger booth for better impact");
    }
    factors.push({
      category: "Booth Size & Layout",
      score: boothScore,
      impact: "High",
      recommendations: boothSize < 25 ? ["Upgrade to minimum 25 sqm", "Focus on vertical displays"] : ["Optimize space utilization", "Create engaging zones"]
    });
    totalScore += boothScore * 0.2;

    // Budget Analysis (25% weight)
    const totalBudget = costs?.total || 0;
    const budgetPerSqm = totalBudget / boothSize;
    let budgetScore = 0;
    if (budgetPerSqm >= 25000) {
      budgetScore = 90;
      insights.push("Premium budget allocation enables high-quality exhibition setup");
    } else if (budgetPerSqm >= 15000) {
      budgetScore = 75;
      insights.push("Adequate budget for professional exhibition presence");
    } else {
      budgetScore = 50;
      riskFactors.push("Limited budget may restrict exhibition quality");
      recommendations.push("Optimize spending on high-impact elements");
    }
    factors.push({
      category: "Budget Allocation",
      score: budgetScore,
      impact: "High",
      recommendations: budgetScore < 70 ? ["Prioritize booth design over extras", "Negotiate vendor packages"] : ["Invest in premium finishes", "Add interactive elements"]
    });
    totalScore += budgetScore * 0.25;

    // Team Size Analysis (15% weight)
    const teamSize = formData.teamSize || 4;
    let teamScore = 0;
    if (teamSize >= 8) {
      teamScore = 85;
      insights.push("Large team enables comprehensive visitor engagement");
    } else if (teamSize >= 4) {
      teamScore = 75;
    } else {
      teamScore = 55;
      riskFactors.push("Small team may struggle with visitor coverage");
      recommendations.push("Plan shifts efficiently or hire local support");
    }
    factors.push({
      category: "Team Readiness",
      score: teamScore,
      impact: "Medium",
      recommendations: teamSize < 4 ? ["Hire local representatives", "Plan shift rotations"] : ["Assign specialized roles", "Prepare team training"]
    });
    totalScore += teamScore * 0.15;

    // Location & Market Analysis (20% weight)
    const isMetroCity = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'].includes(formData.destinationCity);
    const isPremiumMarket = formData.marketLevel === 'premium' || formData.marketLevel === 'high';
    let locationScore = 0;
    if (isMetroCity && isPremiumMarket) {
      locationScore = 90;
      insights.push("Premium metro location offers excellent business opportunities");
    } else if (isMetroCity) {
      locationScore = 75;
      insights.push("Metro city location provides good market access");
    } else {
      locationScore = 60;
      recommendations.push("Focus on regional market specialization");
    }
    factors.push({
      category: "Market Location",
      score: locationScore,
      impact: "High",
      recommendations: locationScore < 70 ? ["Research local market preferences", "Partner with regional distributors"] : ["Leverage metro market opportunities", "Network with key industry players"]
    });
    totalScore += locationScore * 0.2;

    // Industry Alignment (10% weight)
    const industryScore = formData.industry ? 80 : 60;
    if (formData.industry) {
      insights.push(`Targeted ${formData.industry} industry focus enhances visitor relevance`);
    } else {
      riskFactors.push("Unclear industry targeting may reduce visitor quality");
    }
    factors.push({
      category: "Industry Focus",
      score: industryScore,
      impact: "Medium",
      recommendations: industryScore < 70 ? ["Define clear target industry", "Tailor messaging accordingly"] : ["Leverage industry expertise", "Connect with sector associations"]
    });
    totalScore += industryScore * 0.1;

    // Timing Analysis (10% weight)
    const eventDate = new Date(formData.exhibitionStartDate || formData.eventStartDate);
    const month = eventDate.getMonth() + 1;
    const isPeakSeason = month >= 10 || month <= 3;
    let timingScore = isPeakSeason ? 85 : 70;
    if (isPeakSeason) {
      insights.push("Peak exhibition season timing maximizes industry participation");
    } else {
      recommendations.push("Compensate for off-peak timing with enhanced marketing");
    }
    factors.push({
      category: "Event Timing",
      score: timingScore,
      impact: "Low",
      recommendations: timingScore < 75 ? ["Increase pre-event promotion", "Offer special incentives"] : ["Leverage peak season momentum", "Network aggressively"]
    });
    totalScore += timingScore * 0.1;

    // Determine overall level
    let level: SuccessPrediction['level'];
    if (totalScore >= 80) {
      level = 'High';
      insights.push("Excellent foundation for exhibition success with multiple positive factors");
    } else if (totalScore >= 65) {
      level = 'Medium';
      insights.push("Good potential with room for strategic improvements");
    } else {
      level = 'Low';
      riskFactors.push("Several challenges need addressing for optimal success");
    }

    // General recommendations based on overall score
    if (totalScore < 65) {
      recommendations.push("Consider postponing if possible to address key risk factors");
      recommendations.push("Focus budget on highest-impact improvements");
    } else if (totalScore < 80) {
      recommendations.push("Address medium-priority improvements for better ROI");
      recommendations.push("Develop contingency plans for identified risks");
    } else {
      recommendations.push("Maintain current strategy and focus on execution excellence");
      recommendations.push("Plan for follow-up opportunities and lead nurturing");
    }

    return {
      overallScore: Math.round(totalScore),
      level,
      factors,
      insights,
      riskFactors,
      recommendations
    };
  };

  useEffect(() => {
    if (formData.destinationCity && costs) {
      analyzePrediction();
    }
  }, [formData.destinationCity, costs?.total]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!formData.destinationCity || !costs) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <p className="text-blue-800 font-medium">AI Success Predictor</p>
        </div>
        <p className="text-blue-700 text-sm mt-2">
          Complete your exhibition details to get AI-powered success predictions and recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">AI Success Predictor</h3>
        </div>
        <Button
          onClick={analyzePrediction}
          disabled={isLoading}
          className="text-xs sm:text-sm w-full sm:w-auto"
          data-testid="button-analyze-success"
        >
          {isLoading ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 mr-2" />
              Refresh Analysis
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Analyzing exhibition success factors...</span>
        </div>
      ) : prediction ? (
        <div className="space-y-6">
          {/* Overall Score - Mobile Responsive */}
          <div className="text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold mb-2">
              <span className={getScoreColor(prediction.overallScore)}>
                {prediction.overallScore}%
              </span>
            </div>
            <div className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getLevelColor(prediction.level)}`}>
              {prediction.level} Success Probability
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">
              Based on {prediction.factors.length} key success factors
            </p>
          </div>

          {/* Key Insights - Mobile Responsive */}
          {prediction.insights.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <h4 className="font-semibold text-green-800 text-sm sm:text-base">Key Strengths</h4>
              </div>
              <ul className="space-y-1">
                {prediction.insights.map((insight, index) => (
                  <li key={index} className="text-green-700 text-xs sm:text-sm flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk Factors - Mobile Responsive */}
          {prediction.riskFactors.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                <h4 className="font-semibold text-orange-800 text-sm sm:text-base">Risk Factors</h4>
              </div>
              <ul className="space-y-1">
                {prediction.riskFactors.map((risk, index) => (
                  <li key={index} className="text-orange-700 text-xs sm:text-sm flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Factor Breakdown */}
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-between w-full text-left mb-4"
            >
              <h4 className="font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Success Factor Breakdown
              </h4>
              <span className="text-gray-500">
                {showDetails ? '−' : '+'}
              </span>
            </button>

            {showDetails && (
              <div className="space-y-4">
                {prediction.factors.map((factor, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-gray-900">{factor.category}</h5>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getScoreColor(factor.score)}`}>
                          {factor.score}%
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          factor.impact === 'High' ? 'bg-red-100 text-red-800' :
                          factor.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {factor.impact} Impact
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full ${
                          factor.score >= 80 ? 'bg-green-500' :
                          factor.score >= 65 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      ></div>
                    </div>
                    {factor.recommendations.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Recommendations:</p>
                        <ul className="space-y-1">
                          {factor.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <span className="text-gray-400 mr-2">→</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overall Recommendations */}
          {prediction.recommendations.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Target className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Strategic Recommendations</h4>
              </div>
              <ul className="space-y-1">
                {prediction.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-blue-700 text-sm flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Click "Refresh Analysis" to get AI-powered success predictions</p>
        </div>
      )}
    </div>
  );
}