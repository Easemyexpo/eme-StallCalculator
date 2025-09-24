interface RiskAssessmentInput {
  formData: any;
  costs: any;
  selectedFlights: any;
  selectedHotel: any;
  timestamp: string;
}

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

export function performRiskAssessment(input: RiskAssessmentInput) {
  const { formData, costs, selectedFlights, selectedHotel } = input;
  
  const riskFactors: RiskFactor[] = [];
  let riskScore = 0;

  // 1. Venue & Location Risks
  if (formData.venueType === 'outdoor') {
    riskFactors.push({
      id: 'venue_weather',
      category: 'Venue & Location',
      title: 'Weather Dependency Risk',
      description: 'Outdoor exhibitions are vulnerable to weather conditions that could impact attendance and setup.',
      severity: 'high',
      probability: 30,
      impact: 8,
      mitigation: [
        'Arrange weather-proof tenting and coverings',
        'Have indoor backup venue on standby',
        'Purchase weather insurance coverage',
        'Monitor weather forecasts closely'
      ],
      cost_impact: 'Potential 15-25% budget increase for weather protection',
      timeline_impact: 'Setup may require additional 1-2 days'
    });
    riskScore += 20;
  }

  // 2. Budget & Financial Risks
  const totalCost = costs?.total || 0;
  if (totalCost > 800000) {
    riskFactors.push({
      id: 'budget_overrun',
      category: 'Financial',
      title: 'High Budget Risk',
      description: 'Large exhibition budgets carry higher risk of cost overruns and approval delays.',
      severity: 'medium',
      probability: 25,
      impact: 7,
      mitigation: [
        'Set aside 10-15% contingency budget',
        'Get multiple vendor quotes for comparison',
        'Implement strict cost approval process',
        'Regular budget monitoring and reporting'
      ],
      cost_impact: 'Potential 10-20% budget overrun',
      timeline_impact: 'Budget approvals may delay project by 1-2 weeks'
    });
    riskScore += 15;
  }

  // 3. Travel & Logistics Risks
  const hasInternationalTravel = formData.distance > 2000;
  if (hasInternationalTravel) {
    riskFactors.push({
      id: 'international_logistics',
      category: 'Travel & Logistics',
      title: 'International Logistics Complexity',
      description: 'Cross-border exhibition logistics involve customs, documentation, and regulatory compliance risks.',
      severity: 'high',
      probability: 40,
      impact: 8,
      mitigation: [
        'Engage experienced international freight forwarder',
        'Complete customs documentation 2-3 weeks early',
        'Arrange carnet documentation for temporary imports',
        'Plan buffer time for customs clearance'
      ],
      cost_impact: 'Additional 15-30% for international logistics',
      timeline_impact: 'Requires 2-3 additional weeks for planning'
    });
    riskScore += 25;
  }

  // 4. Timeline Risks
  const eventDate = new Date(formData.exhibitionStartDate);
  const today = new Date();
  const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilEvent < 30) {
    riskFactors.push({
      id: 'short_timeline',
      category: 'Timeline',
      title: 'Compressed Planning Timeline',
      description: 'Limited time for planning increases risk of vendor unavailability and rushed decisions.',
      severity: 'critical',
      probability: 70,
      impact: 9,
      mitigation: [
        'Prioritize critical vendors and book immediately',
        'Accept higher costs for expedited services',
        'Simplify booth design and requirements',
        'Have backup vendors identified'
      ],
      cost_impact: 'Rush charges may increase costs by 20-40%',
      timeline_impact: 'Limited options may compromise quality'
    });
    riskScore += 35;
  } else if (daysUntilEvent < 60) {
    riskFactors.push({
      id: 'moderate_timeline',
      category: 'Timeline',
      title: 'Moderate Timeline Pressure',
      description: 'Planning timeline is tight but manageable with efficient execution.',
      severity: 'medium',
      probability: 40,
      impact: 6,
      mitigation: [
        'Create detailed project timeline with milestones',
        'Book key vendors within next 2 weeks',
        'Regular progress check-ins with team',
        'Identify potential bottlenecks early'
      ],
      cost_impact: 'Minimal cost impact with good planning',
      timeline_impact: 'Requires disciplined schedule adherence'
    });
    riskScore += 10;
  }

  // 5. Team & Resource Risks
  if (formData.teamSize > 8) {
    riskFactors.push({
      id: 'large_team_coordination',
      category: 'Team & Resources',
      title: 'Large Team Coordination',
      description: 'Managing large teams increases coordination complexity and communication risks.',
      severity: 'medium',
      probability: 35,
      impact: 5,
      mitigation: [
        'Assign clear roles and responsibilities',
        'Establish daily communication protocols',
        'Use project management tools for tracking',
        'Designate team leads for different areas'
      ],
      cost_impact: 'Additional management overhead 5-10%',
      timeline_impact: 'Decision-making may be slower'
    });
    riskScore += 8;
  }

  // 6. Market & Competition Risks
  const isHighSeasonEvent = isHighSeason(eventDate);
  if (isHighSeasonEvent) {
    riskFactors.push({
      id: 'high_season_competition',
      category: 'Market Competition',
      title: 'Peak Season Resource Competition',
      description: 'High season events face increased competition for venues, vendors, and accommodation.',
      severity: 'high',
      probability: 60,
      impact: 7,
      mitigation: [
        'Book vendors and venues immediately',
        'Negotiate contracts with cancellation protection',
        'Have backup options for all critical services',
        'Consider shoulder dates if flexible'
      ],
      cost_impact: 'Peak season premium 20-30% higher costs',
      timeline_impact: 'Limited vendor availability'
    });
    riskScore += 18;
  }

  // 7. Technology & Equipment Risks
  if (formData.avEquipment || formData.lighting) {
    riskFactors.push({
      id: 'tech_equipment_failure',
      category: 'Technology',
      title: 'Equipment Failure Risk',
      description: 'Technical equipment dependency creates risk of failures during critical exhibition moments.',
      severity: 'medium',
      probability: 20,
      impact: 6,
      mitigation: [
        'Arrange backup equipment for critical items',
        'Conduct equipment testing 48 hours before event',
        'Have technical support team on standby',
        'Plan manual backup procedures'
      ],
      cost_impact: 'Backup equipment adds 10-15% to tech costs',
      timeline_impact: 'Equipment setup requires additional day'
    });
    riskScore += 7;
  }

  // 8. Regulatory & Compliance Risks
  if (formData.industry === 'pharmaceutical' || formData.industry === 'medical') {
    riskFactors.push({
      id: 'regulatory_compliance',
      category: 'Regulatory',
      title: 'Industry Compliance Requirements',
      description: 'Regulated industries require special permits, certifications, and compliance measures.',
      severity: 'high',
      probability: 30,
      impact: 8,
      mitigation: [
        'Engage regulatory compliance specialist',
        'Submit permit applications 6-8 weeks early',
        'Ensure all materials meet industry standards',
        'Have compliance documentation ready'
      ],
      cost_impact: 'Compliance costs 5-15% of total budget',
      timeline_impact: 'Regulatory approvals require 4-6 weeks'
    });
    riskScore += 16;
  }

  // Calculate overall metrics
  const totalFactors = riskFactors.length;
  const criticalRisks = riskFactors.filter(r => r.severity === 'critical').length;
  const highRisks = riskFactors.filter(r => r.severity === 'high').length;
  const mediumRisks = riskFactors.filter(r => r.severity === 'medium').length;
  const lowRisks = riskFactors.filter(r => r.severity === 'low').length;

  // Determine risk level
  let riskLevel = 'low';
  if (riskScore > 70) riskLevel = 'critical';
  else if (riskScore > 40) riskLevel = 'high';
  else if (riskScore > 20) riskLevel = 'medium';

  // Calculate success probability
  const successProbability = Math.max(10, Math.min(95, 100 - riskScore));

  // Generate recommendations
  const recommendations = generateRecommendations(riskFactors, formData, riskScore);

  // Calculate budget variance
  const budgetVariance = calculateBudgetVariance(riskFactors, riskScore);

  // Calculate timeline risks
  const timelineRisks = calculateTimelineRisks(riskFactors, daysUntilEvent);

  return {
    overall_risk_score: riskScore,
    risk_level: riskLevel,
    total_factors: totalFactors,
    critical_risks: criticalRisks,
    high_risks: highRisks,
    medium_risks: mediumRisks,
    low_risks: lowRisks,
    risk_factors: riskFactors,
    recommendations,
    success_probability: successProbability,
    budget_variance: budgetVariance,
    timeline_risks: timelineRisks
  };
}

function isHighSeason(eventDate: Date): boolean {
  const month = eventDate.getMonth() + 1; // 1-12
  // October to March is high season in India
  return month >= 10 || month <= 3;
}

function generateRecommendations(riskFactors: RiskFactor[], formData: any, riskScore: number): string[] {
  const recommendations: string[] = [];

  if (riskScore > 50) {
    recommendations.push('Consider postponing to reduce timeline pressure and improve vendor availability');
  }

  if (riskFactors.some(r => r.category === 'Financial')) {
    recommendations.push('Establish a contingency fund of 15-20% to handle unexpected costs');
  }

  if (riskFactors.some(r => r.category === 'Travel & Logistics')) {
    recommendations.push('Engage professional logistics partner with international exhibition experience');
  }

  if (formData.teamSize > 6) {
    recommendations.push('Implement daily stand-up meetings and clear communication protocols');
  }

  recommendations.push('Purchase comprehensive exhibition insurance covering cancellation, weather, and liability');
  recommendations.push('Develop detailed contingency plans for your top 3 identified risks');
  recommendations.push('Schedule weekly risk review meetings with your planning team');

  return recommendations;
}

function calculateBudgetVariance(riskFactors: RiskFactor[], riskScore: number) {
  const factors: string[] = [];
  let maxOverrun = 10;
  let minSavings = -5;

  riskFactors.forEach(risk => {
    if (risk.cost_impact) {
      factors.push(risk.title);
      if (risk.severity === 'critical') maxOverrun += 15;
      else if (risk.severity === 'high') maxOverrun += 10;
      else if (risk.severity === 'medium') maxOverrun += 5;
    }
  });

  if (riskScore < 20) {
    minSavings = -10; // More potential for savings
  }

  return {
    min: minSavings,
    max: Math.min(50, maxOverrun),
    factors: factors.length > 0 ? factors : ['Market price fluctuations', 'Vendor availability', 'Scope changes']
  };
}

function calculateTimelineRisks(riskFactors: RiskFactor[], daysUntilEvent: number) {
  let setupDelays = 10;
  let permitIssues = 5;
  let vendorDelays = 15;

  if (daysUntilEvent < 30) {
    setupDelays += 20;
    vendorDelays += 25;
  }

  riskFactors.forEach(risk => {
    if (risk.category === 'Regulatory') permitIssues += 15;
    if (risk.category === 'Timeline') {
      setupDelays += 10;
      vendorDelays += 15;
    }
  });

  return {
    setup_delays: Math.min(50, setupDelays),
    permit_issues: Math.min(40, permitIssues),
    vendor_delays: Math.min(60, vendorDelays)
  };
}