import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
import type { FormData } from "@/lib/calculator";

interface AICostPredictionProps {
  formData: FormData;
}

interface CostPrediction {
  predictedCost: number;
  confidence: number;
  factors: Array<{
    factor: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
  }>;
  recommendations: string[];
  similarEvents: Array<{
    name: string;
    actualCost: number;
    variance: number;
  }>;
}

export default function AICostPrediction({ formData }: AICostPredictionProps) {
  const [showDetails, setShowDetails] = useState(false);

  const { data: prediction, isLoading } = useQuery({
    queryKey: ["/api/ai/cost-prediction", formData],
    enabled: !!(formData.destinationCity && formData.boothSize && formData.teamSize),
  });

  if (!formData.destinationCity || !formData.boothSize || !formData.teamSize) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-white">AI Cost Prediction</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Complete basic details to get AI-powered cost predictions
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
            <CardTitle className="text-white">AI Cost Prediction</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const typedPrediction = prediction as CostPrediction;
  const confidenceColor = typedPrediction?.confidence >= 80 ? 'text-green-400' : 
                          typedPrediction?.confidence >= 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-white">AI Cost Prediction</CardTitle>
          </div>
          {typedPrediction && (
            <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
              {typedPrediction.confidence}% confidence
            </Badge>
          )}
        </div>
        <CardDescription className="text-gray-400">
          Based on similar events and market analysis
        </CardDescription>
      </CardHeader>
      
      {typedPrediction && (
        <CardContent className="space-y-6">
          {/* Predicted Cost */}
          <div className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-700/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Predicted Total Cost</span>
              <span className={`text-sm ${confidenceColor}`}>
                {typedPrediction.confidence >= 80 ? <CheckCircle className="w-4 h-4 inline mr-1" /> : 
                 typedPrediction.confidence >= 60 ? <AlertTriangle className="w-4 h-4 inline mr-1" /> : 
                 <AlertTriangle className="w-4 h-4 inline mr-1" />}
                {typedPrediction.confidence >= 80 ? 'High' : 
                 typedPrediction.confidence >= 60 ? 'Medium' : 'Low'} Confidence
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              ₹{typedPrediction.predictedCost.toLocaleString()}
            </div>
          </div>

          {/* Key Factors */}
          <div>
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Key Cost Factors
            </h4>
            <div className="space-y-2">
              {typedPrediction.factors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-300">{factor.factor}</span>
                  <Badge 
                    variant={factor.impact === 'high' ? 'destructive' : 
                           factor.impact === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {factor.impact} impact
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div>
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              AI Recommendations
            </h4>
            <div className="space-y-2">
              {typedPrediction.recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                  <p className="text-green-200 text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Events */}
          {showDetails && typedPrediction.similarEvents.length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-3">Similar Events Analysis</h4>
              <div className="space-y-2">
                {typedPrediction.similarEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">{event.name}</span>
                    <div className="text-right">
                      <div className="text-white">₹{event.actualCost.toLocaleString()}</div>
                      <div className={`text-xs ${event.variance > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {event.variance > 0 ? '+' : ''}{event.variance}% variance
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            variant="outline" 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            data-testid="button-toggle-details"
          >
            {showDetails ? 'Hide Details' : 'Show Detailed Analysis'}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}