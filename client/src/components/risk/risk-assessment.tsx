import { useState, useEffect } from "react";
import { AlertTriangle, Shield, CheckCircle, Clock, DollarSign, Users, Plane, Building, MapPin, Calendar, TrendingUp, TrendingDown, Info, ExternalLink, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface RiskFactor {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  impact: number;
  mitigation: string[];
  cost_impact?: string;
  timeline_impact?: string;
}

interface RiskAssessmentData {
  overall_risk_score: number;
  risk_level: string;
  total_factors: number;
  critical_risks: number;
  high_risks: number;
  medium_risks: number;
  low_risks: number;
  risk_factors: RiskFactor[];
  recommendations: string[];
  success_probability: number;
  budget_variance: {
    min: number;
    max: number;
    factors: string[];
  };
  timeline_risks: {
    setup_delays: number;
    permit_issues: number;
    vendor_delays: number;
  };
}

interface RiskAssessmentProps {
  formData: any;
  costs?: any;
  selectedFlights?: any;
  selectedHotel?: any;
  onClose?: () => void;
}

export function RiskAssessment({ formData, costs, selectedFlights, selectedHotel, onClose }: RiskAssessmentProps) {
  const [assessment, setAssessment] = useState<RiskAssessmentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performRiskAssessment = async () => {
    setLoading(true);
    setError(null);

    try {
      const assessmentData = {
        formData,
        costs,
        selectedFlights,
        selectedHotel,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/risk-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData)
      });

      if (!response.ok) {
        throw new Error('Failed to perform risk assessment');
      }

      const result = await response.json();
      setAssessment(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Assessment failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performRiskAssessment();
  }, [formData, costs]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700';
      case 'high': return 'text-orange-700';
      case 'medium': return 'text-yellow-700';
      case 'low': return 'text-green-700';
      default: return 'text-gray-700';
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return <Shield className="w-5 h-5 text-green-600" />;
      case 'medium': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Analyzing Exhibition Risks...</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <Progress value={33} className="h-2" />
              <p className="text-sm text-gray-600">
                Evaluating venue, timing, budget, and logistics factors...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span>Assessment Error</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={performRiskAssessment} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!assessment) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Exhibition Risk Assessment</h2>
          <p className="text-gray-600">AI-powered analysis of potential risks and mitigation strategies</p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close Assessment
          </Button>
        )}
      </div>

      {/* Overall Risk Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getRiskLevelIcon(assessment.risk_level)}
            <span>Overall Risk Level: {assessment.risk_level.toUpperCase()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{assessment.overall_risk_score}/100</div>
              <div className="text-sm text-gray-600">Risk Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{assessment.success_probability}%</div>
              <div className="text-sm text-gray-600">Success Probability</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{assessment.total_factors}</div>
              <div className="text-sm text-gray-600">Risk Factors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{assessment.critical_risks}</div>
              <div className="text-sm text-gray-600">Critical Risks</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Risk Distribution</span>
              <span>{assessment.total_factors} total factors</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="flex h-full">
                <div 
                  className="bg-red-500" 
                  style={{ width: `${(assessment.critical_risks / assessment.total_factors) * 100}%` }}
                ></div>
                <div 
                  className="bg-orange-500" 
                  style={{ width: `${(assessment.high_risks / assessment.total_factors) * 100}%` }}
                ></div>
                <div 
                  className="bg-yellow-500" 
                  style={{ width: `${(assessment.medium_risks / assessment.total_factors) * 100}%` }}
                ></div>
                <div 
                  className="bg-green-500" 
                  style={{ width: `${(assessment.low_risks / assessment.total_factors) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget & Timeline Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Budget Variance Risk</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Potential Overrun:</span>
                <span className="font-semibold text-red-600">+{assessment.budget_variance.max}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Potential Savings:</span>
                <span className="font-semibold text-green-600">-{Math.abs(assessment.budget_variance.min)}%</span>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Key factors:</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  {assessment.budget_variance.factors.map((factor, index) => (
                    <li key={index}>• {factor}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Timeline Risks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Setup Delays</span>
                <Badge variant={assessment.timeline_risks.setup_delays > 20 ? "destructive" : "secondary"}>
                  {assessment.timeline_risks.setup_delays}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Permit Issues</span>
                <Badge variant={assessment.timeline_risks.permit_issues > 15 ? "destructive" : "secondary"}>
                  {assessment.timeline_risks.permit_issues}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Vendor Delays</span>
                <Badge variant={assessment.timeline_risks.vendor_delays > 25 ? "destructive" : "secondary"}>
                  {assessment.timeline_risks.vendor_delays}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Identified Risk Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessment.risk_factors.map((risk) => (
              <div key={risk.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={getSeverityColor(risk.severity)}>
                        {risk.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-600">{risk.category}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">{risk.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                  </div>
                  <div className="text-right text-sm">
                    <div className={`font-semibold ${getSeverityTextColor(risk.severity)}`}>
                      Impact: {risk.impact}/10
                    </div>
                    <div className="text-gray-600">
                      Probability: {risk.probability}%
                    </div>
                  </div>
                </div>

                {risk.cost_impact && (
                  <div className="bg-red-50 p-2 rounded text-sm">
                    <strong>Cost Impact:</strong> {risk.cost_impact}
                  </div>
                )}

                {risk.timeline_impact && (
                  <div className="bg-yellow-50 p-2 rounded text-sm">
                    <strong>Timeline Impact:</strong> {risk.timeline_impact}
                  </div>
                )}

                <div className="bg-blue-50 p-3 rounded">
                  <strong className="text-sm text-blue-800">Mitigation Strategies:</strong>
                  <ul className="mt-1 text-sm text-blue-700 space-y-1">
                    {risk.mitigation.map((strategy, index) => (
                      <li key={index}>• {strategy}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assessment.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button onClick={performRiskAssessment} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Assessment
        </Button>
        <Button 
          onClick={() => {
            const emailSubject = `Exhibition Risk Assessment Report - ${formData.destinationCity || 'Event'}`;
            const emailBody = `Please find attached the risk assessment report for our upcoming exhibition.\n\nOverall Risk Level: ${assessment.risk_level.toUpperCase()}\nSuccess Probability: ${assessment.success_probability}%\nCritical Risks: ${assessment.critical_risks}\n\nPlease review and advise on mitigation strategies.\n\nGenerated by EaseMyExpo Risk Assessment Tool`;
            window.location.href = `mailto:easemyexpo1@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
          }}
          className="bg-primary text-white"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Email Report
        </Button>
      </div>
    </div>
  );
}