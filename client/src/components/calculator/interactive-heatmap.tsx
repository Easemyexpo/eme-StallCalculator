import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, TrendingUp, Calendar, DollarSign, Users } from "lucide-react";

interface HeatmapData {
  city: string;
  state: string;
  avgCost: number;
  eventCount: number;
  seasonality: {
    peak: string[];
    low: string[];
  };
  priceLevel: 'low' | 'medium' | 'high' | 'premium';
  venues: number;
  coordinates: [number, number];
}

interface InteractiveHeatmapProps {
  onCitySelect: (city: string, state: string) => void;
}

export default function InteractiveHeatmap({ onCitySelect }: InteractiveHeatmapProps) {
  const [selectedMetric, setSelectedMetric] = useState<'cost' | 'events' | 'venues'>('cost');
  const [selectedCity, setSelectedCity] = useState<HeatmapData | null>(null);

  const { data: heatmapData, isLoading } = useQuery({
    queryKey: ["/api/heatmap", selectedMetric],
  });

  const getColorIntensity = (data: HeatmapData, metric: string) => {
    switch (metric) {
      case 'cost':
        if (data.priceLevel === 'premium') return 'bg-red-600';
        if (data.priceLevel === 'high') return 'bg-orange-500';
        if (data.priceLevel === 'medium') return 'bg-yellow-500';
        return 'bg-green-500';
      case 'events':
        if (data.eventCount > 50) return 'bg-purple-600';
        if (data.eventCount > 30) return 'bg-purple-500';
        if (data.eventCount > 15) return 'bg-purple-400';
        return 'bg-purple-300';
      case 'venues':
        if (data.venues > 20) return 'bg-blue-600';
        if (data.venues > 10) return 'bg-blue-500';
        if (data.venues > 5) return 'bg-blue-400';
        return 'bg-blue-300';
      default:
        return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-red-400" />
            <CardTitle className="text-white">Interactive Cost Heatmap</CardTitle>
          </div>
          <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
            <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="cost">Average Cost</SelectItem>
              <SelectItem value="events">Event Count</SelectItem>
              <SelectItem value="venues">Venue Count</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription className="text-gray-400">
          Explore cost trends across major Indian exhibition cities
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Legend */}
        <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
          <span className="text-gray-300 text-sm">
            {selectedMetric === 'cost' && 'Cost Level:'}
            {selectedMetric === 'events' && 'Event Activity:'}
            {selectedMetric === 'venues' && 'Venue Density:'}
          </span>
          <div className="flex items-center gap-2">
            {selectedMetric === 'cost' && (
              <>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-xs text-gray-400">Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-xs text-gray-400">Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-xs text-gray-400">High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-600 rounded"></div>
                  <span className="text-xs text-gray-400">Premium</span>
                </div>
              </>
            )}
            {selectedMetric === 'events' && (
              <>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-300 rounded"></div>
                  <span className="text-xs text-gray-400">Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-600 rounded"></div>
                  <span className="text-xs text-gray-400">High</span>
                </div>
              </>
            )}
            {selectedMetric === 'venues' && (
              <>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-300 rounded"></div>
                  <span className="text-xs text-gray-400">Few</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span className="text-xs text-gray-400">Many</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Heatmap Grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        ) : heatmapData ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {(heatmapData as HeatmapData[]).map((data, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${getColorIntensity(data, selectedMetric)} ${
                  selectedCity?.city === data.city ? 'ring-2 ring-white' : ''
                }`}
                onClick={() => {
                  setSelectedCity(data);
                  onCitySelect(data.city, data.state);
                }}
                data-testid={`heatmap-city-${data.city.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="text-white font-medium text-sm">{data.city}</div>
                <div className="text-white/80 text-xs">{data.state}</div>
                <div className="text-white text-xs mt-1">
                  {selectedMetric === 'cost' && formatCurrency(data.avgCost)}
                  {selectedMetric === 'events' && `${data.eventCount} events`}
                  {selectedMetric === 'venues' && `${data.venues} venues`}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>Unable to load heatmap data</p>
          </div>
        )}

        {/* Selected City Details */}
        {selectedCity && (
          <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/30">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-semibold text-lg">{selectedCity.city}</h3>
                  <p className="text-gray-300">{selectedCity.state}</p>
                </div>
                <Badge 
                  variant={selectedCity.priceLevel === 'premium' ? 'destructive' : 
                          selectedCity.priceLevel === 'high' ? 'default' : 'secondary'}
                >
                  {selectedCity.priceLevel} cost
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <div className="text-white font-medium">{formatCurrency(selectedCity.avgCost)}</div>
                  <div className="text-gray-400 text-xs">Avg Cost</div>
                </div>
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-white font-medium">{selectedCity.eventCount}</div>
                  <div className="text-gray-400 text-xs">Events/Year</div>
                </div>
                <div className="text-center">
                  <MapPin className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-white font-medium">{selectedCity.venues}</div>
                  <div className="text-gray-400 text-xs">Venues</div>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <div className="text-white font-medium">Peak</div>
                  <div className="text-gray-400 text-xs">{selectedCity.seasonality.peak.join(', ')}</div>
                </div>
              </div>

              <Button 
                onClick={() => onCitySelect(selectedCity.city, selectedCity.state)}
                className="w-full bg-blue-600 hover:bg-blue-700"
                data-testid="button-select-heatmap-city"
              >
                Calculate Costs for {selectedCity.city}
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}