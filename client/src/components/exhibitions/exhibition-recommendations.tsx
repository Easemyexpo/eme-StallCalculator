import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Building, ExternalLink, TrendingUp, Target, DollarSign } from "lucide-react";
import { INDIAN_EXHIBITIONS, INDUSTRY_INSIGHTS, getExhibitionsByIndustry, getUpcomingExhibitions, Exhibition } from "@shared/exhibitions-data";

interface ExhibitionRecommendationsProps {
  selectedIndustry?: string;
  selectedCity?: string;
}

export function ExhibitionRecommendations({ selectedIndustry, selectedCity }: ExhibitionRecommendationsProps) {
  const [relevantExhibitions, setRelevantExhibitions] = useState<Exhibition[]>([]);
  const [showIndustryInsights, setShowIndustryInsights] = useState(false);

  useEffect(() => {
    let exhibitions = getUpcomingExhibitions();
    
    if (selectedIndustry) {
      exhibitions = getExhibitionsByIndustry(selectedIndustry);
    }
    
    if (selectedCity) {
      exhibitions = exhibitions.filter(expo => 
        expo.city.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    setRelevantExhibitions(exhibitions.slice(0, 6)); // Show top 6 relevant exhibitions
  }, [selectedIndustry, selectedCity]);

  const industryInsight = selectedIndustry ? INDUSTRY_INSIGHTS[selectedIndustry as keyof typeof INDUSTRY_INSIGHTS] : null;

  return (
    <div className="space-y-6">
      {/* Industry-Specific Insights */}
      {selectedIndustry && industryInsight && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              {selectedIndustry} Exhibition Insights
            </h3>
            <button
              onClick={() => setShowIndustryInsights(!showIndustryInsights)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showIndustryInsights ? 'Hide Details' : 'View Details'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Avg. Stall Cost</span>
              </div>
              <p className="text-lg font-bold text-green-600">{industryInsight.avgStallCost}</p>
            </div>
            
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Target className="w-4 h-4 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Expected ROI</span>
              </div>
              <p className="text-lg font-bold text-purple-600">{industryInsight.roiExpectation}</p>
            </div>
            
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Peak Season</span>
              </div>
              <p className="text-sm font-semibold text-blue-600">{industryInsight.seasonalTrends}</p>
            </div>
          </div>

          {showIndustryInsights && (
            <div className="space-y-4 border-t border-blue-200 pt-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Key Success Metrics</h4>
                <div className="flex flex-wrap gap-2">
                  {industryInsight.keyMetrics.map((metric, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Best Practices</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {industryInsight.bestPractices.map((practice, index) => (
                    <li key={index}>{practice}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Exhibition Recommendations */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {selectedIndustry ? `Recommended ${selectedIndustry} Exhibitions` : 'Upcoming Exhibitions'}
        </h3>
        
        {relevantExhibitions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Building className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">No exhibitions found</h4>
            <p className="text-sm text-gray-500">
              {selectedIndustry ? `No upcoming exhibitions found for ${selectedIndustry} industry` : 'No upcoming exhibitions available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relevantExhibitions.map((exhibition) => (
              <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExhibitionCard({ exhibition }: { exhibition: Exhibition }) {
  const nextDate = exhibition.dates.find(date => new Date(date.startDate) > new Date()) || exhibition.dates[0];
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-semibold text-gray-900 leading-tight">{exhibition.name}</h4>
        {exhibition.website && (
          <a
            href={exhibition.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span>{exhibition.venue}, {exhibition.city}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            {new Date(nextDate.startDate).toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })} - {new Date(nextDate.endDate).toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2 text-gray-400" />
          <span>{exhibition.expectedVisitors} visitors • {exhibition.exhibitorCount} exhibitors</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700 line-clamp-3">{exhibition.description}</p>
      </div>

      {/* Industry Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {exhibition.industry.slice(0, 3).map((industry, index) => (
          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
            {industry}
          </span>
        ))}
      </div>

      {/* Pricing Information */}
      <div className="bg-green-50 rounded-lg p-3">
        <h5 className="text-sm font-semibold text-green-800 mb-2">Stall Pricing</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-600">Shell Scheme:</span>
            <div className="font-semibold text-green-700">{exhibition.stallPricing.shellScheme}</div>
          </div>
          <div>
            <span className="text-gray-600">Raw Space:</span>
            <div className="font-semibold text-green-700">{exhibition.stallPricing.rawSpace}</div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      {exhibition.keyFeatures.length > 0 && (
        <div className="mt-4">
          <h5 className="text-sm font-semibold text-gray-800 mb-2">Key Features</h5>
          <ul className="text-xs text-gray-600 space-y-1">
            {exhibition.keyFeatures.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}