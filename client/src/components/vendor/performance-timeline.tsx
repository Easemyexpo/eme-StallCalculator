import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Star, 
  Calendar,
  Target,
  BarChart3,
  Activity,
  Users,
  Trophy,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

interface PerformanceDataPoint {
  date: string;
  rating: number;
  projectsCompleted: number;
  clientSatisfaction: number;
  responseTime: number; // in hours
  costEfficiency: number; // percentage
}

interface VendorPerformance {
  vendorId: string;
  vendorName: string;
  category: string;
  timeline: PerformanceDataPoint[];
  overallTrend: 'up' | 'down' | 'stable';
  currentRank: number;
  previousRank: number;
}

interface AnimatedVendorPerformanceTimelineProps {
  vendors: Array<{
    id: string;
    name: string;
    category: string;
    rating?: number;
    experience?: string;
  }>;
}

// Generate sample performance data with realistic trends
const generatePerformanceData = (vendors: any[]): VendorPerformance[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  
  return vendors.map((vendor, index) => {
    const baseRating = vendor.rating || 3.5 + Math.random() * 1.5;
    const experienceYears = vendor.experience ? parseInt(vendor.experience.replace(/\D/g, '')) || 5 : 5;
    
    // Create performance timeline with realistic variations
    const timeline: PerformanceDataPoint[] = months.map((month, monthIndex) => {
      const seasonalFactor = Math.sin((monthIndex / 12) * 2 * Math.PI) * 0.3 + 1;
      const experienceFactor = Math.min(experienceYears / 10, 1.2);
      const randomVariation = (Math.random() - 0.5) * 0.4;
      
      const rating = Math.max(1, Math.min(5, baseRating * seasonalFactor * experienceFactor + randomVariation));
      
      return {
        date: `${month} ${currentYear}`,
        rating: Math.round(rating * 10) / 10,
        projectsCompleted: Math.floor(Math.random() * 8) + 2,
        clientSatisfaction: Math.max(60, Math.min(100, rating * 18 + Math.random() * 15)),
        responseTime: Math.max(1, Math.floor(Math.random() * 24) + 2),
        costEfficiency: Math.max(70, Math.min(100, 75 + Math.random() * 20 + experienceYears * 2))
      };
    });
    
    // Calculate trend
    const firstHalf = timeline.slice(0, 6).reduce((sum, dp) => sum + dp.rating, 0) / 6;
    const secondHalf = timeline.slice(6).reduce((sum, dp) => sum + dp.rating, 0) / 6;
    const trend = secondHalf > firstHalf + 0.2 ? 'up' : secondHalf < firstHalf - 0.2 ? 'down' : 'stable';
    
    return {
      vendorId: vendor.id,
      vendorName: vendor.name,
      category: vendor.category,
      timeline,
      overallTrend: trend,
      currentRank: index + 1,
      previousRank: index + Math.floor(Math.random() * 3) - 1
    };
  });
};

export function AnimatedVendorPerformanceTimeline({ vendors }: AnimatedVendorPerformanceTimelineProps) {
  const [performanceData, setPerformanceData] = useState<VendorPerformance[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [selectedMetric, setSelectedMetric] = useState<string>("rating");
  const [animationIndex, setAnimationIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize performance data
  useEffect(() => {
    if (vendors.length > 0) {
      const data = generatePerformanceData(vendors);
      setPerformanceData(data);
      setSelectedVendor(data[0]?.vendorId || "");
    }
  }, [vendors]);

  // Animation control
  useEffect(() => {
    if (isAnimating && performanceData.length > 0) {
      intervalRef.current = setInterval(() => {
        setAnimationIndex(prev => (prev + 1) % 12);
      }, animationSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAnimating, animationSpeed, performanceData.length]);

  const selectedVendorData = performanceData.find(v => v.vendorId === selectedVendor);
  const currentDataPoint = selectedVendorData?.timeline[animationIndex];

  const getMetricValue = (dataPoint: PerformanceDataPoint, metric: string): number => {
    switch (metric) {
      case 'rating': return dataPoint.rating;
      case 'projects': return dataPoint.projectsCompleted;
      case 'satisfaction': return dataPoint.clientSatisfaction;
      case 'responseTime': return dataPoint.responseTime;
      case 'costEfficiency': return dataPoint.costEfficiency;
      default: return dataPoint.rating;
    }
  };

  const getMetricLabel = (metric: string): string => {
    switch (metric) {
      case 'rating': return 'Overall Rating';
      case 'projects': return 'Projects Completed';
      case 'satisfaction': return 'Client Satisfaction';
      case 'responseTime': return 'Response Time (hrs)';
      case 'costEfficiency': return 'Cost Efficiency';
      default: return 'Overall Rating';
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'rating': return <Star className="w-4 h-4" />;
      case 'projects': return <Target className="w-4 h-4" />;
      case 'satisfaction': return <Users className="w-4 h-4" />;
      case 'responseTime': return <Activity className="w-4 h-4" />;
      case 'costEfficiency': return <TrendingUp className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  if (performanceData.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-400">No vendor performance data available</p>
          <p className="text-sm text-gray-500 mt-2">Add vendors to see performance analytics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Animated Vendor Performance Timeline
              </CardTitle>
              <CardDescription className="text-gray-400">
                Track vendor performance metrics over time with interactive animations
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-600 text-white">
                <Trophy className="w-3 h-3 mr-1" />
                Analytics
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Controls */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Select Vendor</label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Choose vendor" />
                </SelectTrigger>
                <SelectContent>
                  {performanceData.map((vendor) => (
                    <SelectItem key={vendor.vendorId} value={vendor.vendorId}>
                      {vendor.vendorName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Performance Metric</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Choose metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Overall Rating</SelectItem>
                  <SelectItem value="projects">Projects Completed</SelectItem>
                  <SelectItem value="satisfaction">Client Satisfaction</SelectItem>
                  <SelectItem value="responseTime">Response Time</SelectItem>
                  <SelectItem value="costEfficiency">Cost Efficiency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Animation Speed</label>
              <Select value={animationSpeed.toString()} onValueChange={(value) => setAnimationSpeed(Number(value))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200">Fast (0.2s)</SelectItem>
                  <SelectItem value="500">Normal (0.5s)</SelectItem>
                  <SelectItem value="1000">Slow (1s)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Controls</label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAnimating(!isAnimating)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  data-testid="button-toggle-animation"
                >
                  {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setAnimationIndex(0);
                    setIsAnimating(false);
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  data-testid="button-reset-animation"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Timeline */}
      {selectedVendorData && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Vendor Summary */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                {selectedVendorData.vendorName}
                {getTrendIcon(selectedVendorData.overallTrend)}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {selectedVendorData.category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Current Rank</span>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      selectedVendorData.currentRank <= 3 ? 'bg-green-600' : 
                      selectedVendorData.currentRank <= 6 ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      #{selectedVendorData.currentRank}
                    </Badge>
                    {selectedVendorData.currentRank < selectedVendorData.previousRank && (
                      <span className="text-xs text-green-400">↗️ +{selectedVendorData.previousRank - selectedVendorData.currentRank}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Performance Trend</span>
                    <Badge variant="outline" className={`
                      ${selectedVendorData.overallTrend === 'up' ? 'border-green-500 text-green-400' : ''}
                      ${selectedVendorData.overallTrend === 'down' ? 'border-red-500 text-red-400' : ''}
                      ${selectedVendorData.overallTrend === 'stable' ? 'border-blue-500 text-blue-400' : ''}
                    `}>
                      {selectedVendorData.overallTrend.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">YTD Average</span>
                    <span className="text-white font-medium">
                      {selectedMetric === 'rating' && '⭐ '}
                      {(selectedVendorData.timeline.reduce((sum, dp) => sum + getMetricValue(dp, selectedMetric), 0) / 12).toFixed(1)}
                      {selectedMetric === 'satisfaction' && '%'}
                      {selectedMetric === 'costEfficiency' && '%'}
                      {selectedMetric === 'responseTime' && 'h'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Data Point */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                {getMetricIcon(selectedMetric)}
                {getMetricLabel(selectedMetric)}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {currentDataPoint?.date} Performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentDataPoint && (
                <div className="space-y-6">
                  {/* Main Metric */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">
                      {selectedMetric === 'rating' && '⭐ '}
                      {getMetricValue(currentDataPoint, selectedMetric)}
                      {selectedMetric === 'satisfaction' && '%'}
                      {selectedMetric === 'costEfficiency' && '%'}
                      {selectedMetric === 'responseTime' && 'h'}
                    </div>
                    <Progress 
                      value={
                        selectedMetric === 'rating' ? (getMetricValue(currentDataPoint, selectedMetric) / 5) * 100 :
                        selectedMetric === 'projects' ? Math.min((getMetricValue(currentDataPoint, selectedMetric) / 10) * 100, 100) :
                        selectedMetric === 'responseTime' ? Math.max(100 - (getMetricValue(currentDataPoint, selectedMetric) / 24) * 100, 0) :
                        getMetricValue(currentDataPoint, selectedMetric)
                      }
                      className="h-2 bg-gray-700"
                    />
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-gray-400">Projects</div>
                      <div className="text-white font-medium">{currentDataPoint.projectsCompleted}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Satisfaction</div>
                      <div className="text-white font-medium">{currentDataPoint.clientSatisfaction.toFixed(0)}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Response</div>
                      <div className="text-white font-medium">{currentDataPoint.responseTime}h</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Efficiency</div>
                      <div className="text-white font-medium">{currentDataPoint.costEfficiency.toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline Visual */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Timeline Progress
              </CardTitle>
              <CardDescription className="text-gray-400">
                Month {animationIndex + 1} of 12 • {isAnimating ? 'Playing' : 'Paused'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Timeline Progress Bar */}
                <div>
                  <Progress value={(animationIndex + 1) / 12 * 100} className="h-2 bg-gray-700" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Jan</span>
                    <span>Jun</span>
                    <span>Dec</span>
                  </div>
                </div>

                {/* Month Navigation */}
                <div className="grid grid-cols-6 gap-1">
                  {selectedVendorData.timeline.map((dataPoint, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setAnimationIndex(index);
                        setIsAnimating(false);
                      }}
                      className={`
                        p-2 text-xs rounded transition-all duration-200
                        ${index === animationIndex 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }
                      `}
                      data-testid={`timeline-month-${index}`}
                    >
                      {dataPoint.date.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="pt-2 border-t border-gray-600">
                  <div className="text-xs text-gray-400 mb-2">Quick Insights</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Best Month:</span>
                      <span className="text-green-400">
                        {selectedVendorData.timeline.reduce((best, current, index) => 
                          getMetricValue(current, selectedMetric) > getMetricValue(selectedVendorData.timeline[best], selectedMetric) 
                            ? index : best, 0
                        ) === animationIndex ? 'Current' : 
                        selectedVendorData.timeline[selectedVendorData.timeline.reduce((best, current, index) => 
                          getMetricValue(current, selectedMetric) > getMetricValue(selectedVendorData.timeline[best], selectedMetric) 
                            ? index : best, 0
                        )].date.split(' ')[0]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Consistency:</span>
                      <span className="text-blue-400">
                        {selectedVendorData.overallTrend === 'stable' ? 'High' : 'Variable'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}