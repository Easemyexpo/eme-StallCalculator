import React from 'react';
import { X, TrendingUp, Brain, Target, BarChart3, Lightbulb, Zap } from 'lucide-react';

interface SuccessPredictorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: any;
}

export function SuccessPredictorPopup({ isOpen, onClose, prediction }: SuccessPredictorPopupProps) {
  if (!isOpen || !prediction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">AI Success Predictor Analysis</h2>
                <p className="text-gray-600">Comprehensive exhibition success analysis using AI algorithms</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Overall Score */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold mb-4 ${
                prediction.level === 'High' ? 'bg-green-100 text-green-600' :
                prediction.level === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                {prediction.overallScore}%
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {prediction.level} Success Probability
              </h3>
              <p className="text-gray-600">
                Based on AI analysis of {prediction.factors?.length || 5} key success factors
              </p>
            </div>
          </div>

          {/* Key Insights */}
          {prediction.insights && prediction.insights.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <ul className="space-y-3">
                  {prediction.insights.map((insight: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Zap className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Success Factors Analysis */}
          {prediction.factors && prediction.factors.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Success Factors Analysis</h3>
              </div>
              <div className="grid gap-4">
                {prediction.factors.map((factor: any, index: number) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-900">{factor.category}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        factor.score >= 80 ? 'bg-green-100 text-green-800' :
                        factor.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {factor.score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div 
                        className={`h-3 rounded-full ${
                          factor.score >= 80 ? 'bg-green-500' :
                          factor.score >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{factor.impact}</p>
                    {factor.recommendations && factor.recommendations.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                        {factor.recommendations.map((rec: string, recIndex: number) => (
                          <p key={recIndex} className="text-sm text-gray-600 pl-4">• {rec}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          {prediction.recommendations && prediction.recommendations.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="space-y-3">
                  {prediction.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Target className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Risk Factors */}
          {prediction.riskFactors && prediction.riskFactors.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Risk Factors to Consider</h3>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="space-y-2">
                  {prediction.riskFactors.map((risk: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* How It Works */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How Our AI Analysis Works</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Data Points Analyzed</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Booth size and location factors</li>
                  <li>• Team size and experience level</li>
                  <li>• Market location and timing</li>
                  <li>• Industry alignment and focus</li>
                  <li>• Budget allocation efficiency</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">AI Algorithm Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Machine learning pattern recognition</li>
                  <li>• Historical exhibition data analysis</li>
                  <li>• Market-specific success predictors</li>
                  <li>• Real-time factor weighting</li>
                  <li>• Continuous model improvement</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Close Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}