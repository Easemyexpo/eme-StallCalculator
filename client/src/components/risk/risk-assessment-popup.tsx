import React from 'react';
import { X, AlertTriangle, Shield, Clock, DollarSign, Users, Building, TrendingDown, Info, RefreshCw } from 'lucide-react';

interface RiskAssessmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: any;
}

export function RiskAssessmentPopup({ isOpen, onClose, assessment }: RiskAssessmentPopupProps) {
  if (!isOpen || !assessment) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'medium': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'low': return <Shield className="w-5 h-5 text-green-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Risk Assessment Analysis</h2>
                <p className="text-gray-600">Comprehensive exhibition risk evaluation and mitigation strategies</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Overall Risk Score */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold mb-4 ${
                assessment.risk_level === 'Low' ? 'bg-green-100 text-green-600' :
                assessment.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                {assessment.overall_risk_score}%
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {assessment.risk_level} Risk Level
              </h3>
              <p className="text-gray-600">
                {assessment.total_factors} risk factors analyzed across multiple categories
              </p>
            </div>
          </div>

          {/* Risk Summary */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">{assessment.critical_risks || 0}</div>
              <div className="text-sm text-red-700">Critical Risks</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{assessment.high_risks || 0}</div>
              <div className="text-sm text-orange-700">High Risks</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{assessment.medium_risks || 0}</div>
              <div className="text-sm text-yellow-700">Medium Risks</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{assessment.low_risks || 0}</div>
              <div className="text-sm text-green-700">Low Risks</div>
            </div>
          </div>

          {/* Risk Factors */}
          {assessment.risk_factors && assessment.risk_factors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Identified Risk Factors</h3>
              <div className="space-y-4">
                {assessment.risk_factors.map((risk: any, index: number) => (
                  <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(risk.severity)}`}>
                    <div className="flex items-start space-x-3">
                      {getSeverityIcon(risk.severity)}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{risk.title}</h4>
                          <span className="text-xs px-2 py-1 bg-white rounded-full font-medium">
                            {risk.category}
                          </span>
                        </div>
                        <p className="text-sm mb-3">{risk.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium">Probability:</span>
                            <div className="flex-1 bg-white rounded-full h-2">
                              <div 
                                className="h-2 bg-current rounded-full opacity-70"
                                style={{ width: `${risk.probability}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{risk.probability}%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium">Impact:</span>
                            <div className="flex-1 bg-white rounded-full h-2">
                              <div 
                                className="h-2 bg-current rounded-full opacity-70"
                                style={{ width: `${risk.impact}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{risk.impact}%</span>
                          </div>
                        </div>

                        {risk.cost_impact && (
                          <div className="mb-2 text-sm">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            <strong>Cost Impact:</strong> {risk.cost_impact}
                          </div>
                        )}

                        {risk.timeline_impact && (
                          <div className="mb-3 text-sm">
                            <Clock className="w-4 h-4 inline mr-1" />
                            <strong>Timeline Impact:</strong> {risk.timeline_impact}
                          </div>
                        )}

                        {risk.mitigation && risk.mitigation.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Mitigation Strategies:</p>
                            <ul className="text-sm space-y-1">
                              {risk.mitigation.map((strategy: string, strategyIndex: number) => (
                                <li key={strategyIndex} className="flex items-start space-x-2">
                                  <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0"></span>
                                  <span>{strategy}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Budget Variance */}
          {assessment.budget_variance && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Risk Analysis</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Expected Variance Range</span>
                    </div>
                    <p className="text-blue-700 text-sm mb-2">
                      Budget may vary between <strong>{assessment.budget_variance.min}%</strong> below 
                      and <strong>{assessment.budget_variance.max}%</strong> above initial estimates.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Contributing Factors:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {assessment.budget_variance.factors?.map((factor: string, index: number) => (
                        <li key={index}>• {factor}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Risks */}
          {assessment.timeline_risks && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Risk Assessment</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Setup Delays</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    {assessment.timeline_risks.setup_delays}%
                  </div>
                  <p className="text-xs text-yellow-700">Risk probability</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-800">Permit Issues</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {assessment.timeline_risks.permit_issues}%
                  </div>
                  <p className="text-xs text-orange-700">Risk probability</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">Vendor Delays</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {assessment.timeline_risks.vendor_delays}%
                  </div>
                  <p className="text-xs text-red-700">Risk probability</p>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {assessment.recommendations && assessment.recommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Mitigation Recommendations</h3>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="space-y-3">
                  {assessment.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Shield className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* How It Works */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How Our Risk Assessment Works</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Assessment Categories</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Financial and budget risks</li>
                  <li>• Timeline and scheduling risks</li>
                  <li>• Vendor and logistics risks</li>
                  <li>• Market and location risks</li>
                  <li>• Technical and operational risks</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Analysis Methodology</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Probability × Impact scoring</li>
                  <li>• Historical data pattern analysis</li>
                  <li>• Industry-specific risk factors</li>
                  <li>• Real-time market conditions</li>
                  <li>• Automated mitigation suggestions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Close Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}