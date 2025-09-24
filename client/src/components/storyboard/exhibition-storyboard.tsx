import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Users, Building, Plane, Camera, Trophy, TrendingUp, Clock, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StoryboardProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  costs: any;
  selectedFlights: any;
  selectedHotel: any;
}

interface StoryPhase {
  id: string;
  title: string;
  timeline: string;
  icon: any;
  status: 'upcoming' | 'current' | 'completed';
  activities: Activity[];
  tips: string[];
  costs?: number;
  duration?: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  time?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export function ExhibitionStoryboard({ isOpen, onClose, formData, costs, selectedFlights, selectedHotel }: StoryboardProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: formData.currency || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStoryPhases = (): StoryPhase[] => {
    const eventDate = new Date(formData.eventStartDate || Date.now());
    const today = new Date();
    const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return [
      {
        id: 'planning',
        title: 'Strategic Planning',
        timeline: `${daysUntilEvent + 60} days before`,
        icon: Building,
        status: daysUntilEvent > 45 ? 'current' : 'completed',
        activities: [
          {
            id: 'budget',
            title: 'Budget Allocation',
            description: 'Define budget parameters and allocate funds across categories',
            status: 'completed',
            priority: 'high'
          },
          {
            id: 'venue',
            title: 'Venue Selection',
            description: `Confirmed: ${formData.destinationCity || 'Selected venue'}`,
            status: 'completed',
            priority: 'high'
          },
          {
            id: 'goals',
            title: 'Set Exhibition Goals',
            description: 'Define success metrics and target outcomes',
            status: 'completed',
            priority: 'medium'
          },
          {
            id: 'team',
            title: 'Team Assembly',
            description: `${formData.teamSize || 4} team members assigned`,
            status: 'completed',
            priority: 'medium'
          }
        ],
        tips: [
          'Book booth space early for better positioning',
          'Set clear, measurable objectives',
          'Research competitor participation',
          'Plan marketing campaigns in advance'
        ],
        costs: costs?.total * 0.1 || 0,
        duration: '2-3 weeks'
      },
      {
        id: 'design',
        title: 'Booth Design & Construction',
        timeline: `${daysUntilEvent + 30} days before`,
        icon: Building,
        status: daysUntilEvent > 30 ? 'upcoming' : daysUntilEvent > 15 ? 'current' : 'completed',
        activities: [
          {
            id: 'concept',
            title: 'Design Conceptualization',
            description: `${formData.boothSize}㎡ ${formData.boothType} booth design`,
            status: 'in-progress',
            priority: 'high'
          },
          {
            id: 'approval',
            title: 'Design Approval',
            description: 'Finalize booth layout and graphics',
            status: 'pending',
            priority: 'high'
          },
          {
            id: 'production',
            title: 'Construction & Production',
            description: 'Booth fabrication and material preparation',
            status: 'pending',
            priority: 'medium'
          },
          {
            id: 'testing',
            title: 'Quality Testing',
            description: 'Test all booth components and technology',
            status: 'pending',
            priority: 'medium'
          }
        ],
        tips: [
          'Include interactive elements to attract visitors',
          'Ensure brand consistency across all materials',
          'Plan for adequate storage space',
          'Consider lighting for different times of day'
        ],
        costs: costs?.constructionCost || 0,
        duration: '3-4 weeks'
      },
      {
        id: 'logistics',
        title: 'Travel & Logistics',
        timeline: `${daysUntilEvent + 14} days before`,
        icon: Plane,
        status: daysUntilEvent > 14 ? 'upcoming' : daysUntilEvent > 7 ? 'current' : 'completed',
        activities: [
          {
            id: 'flights',
            title: 'Flight Bookings',
            description: selectedFlights?.outbound ? `${selectedFlights.outbound.airline} flights confirmed` : 'Book team flights',
            status: selectedFlights?.outbound ? 'completed' : 'pending',
            priority: 'high'
          },
          {
            id: 'accommodation',
            title: 'Hotel Reservations',
            description: selectedHotel ? `${selectedHotel.name} reserved for ${formData.eventDuration} nights` : 'Book accommodation',
            status: selectedHotel ? 'completed' : 'pending',
            priority: 'high'
          },
          {
            id: 'shipping',
            title: 'Material Shipping',
            description: 'Ship booth materials and promotional items',
            status: 'pending',
            priority: 'medium'
          },
          {
            id: 'insurance',
            title: 'Insurance Coverage',
            description: 'Secure travel and equipment insurance',
            status: 'pending',
            priority: 'low'
          }
        ],
        tips: [
          'Book flights early for better rates',
          'Choose hotels close to the venue',
          'Plan for material customs clearance',
          'Prepare backup travel arrangements'
        ],
        costs: (selectedFlights ? Object.values(selectedFlights).reduce((total: number, flight: any) => total + (flight?.price || 0), 0) : 0) + (selectedHotel?.totalPrice || 0),
        duration: '1-2 weeks'
      },
      {
        id: 'preparation',
        title: 'Final Preparations',
        timeline: `${daysUntilEvent} days before`,
        icon: CheckCircle,
        status: daysUntilEvent > 3 ? 'upcoming' : daysUntilEvent > 0 ? 'current' : 'completed',
        activities: [
          {
            id: 'training',
            title: 'Team Training',
            description: 'Brief team on goals, processes, and key messages',
            status: 'pending',
            priority: 'high'
          },
          {
            id: 'materials',
            title: 'Marketing Materials',
            description: 'Prepare brochures, business cards, and giveaways',
            status: 'pending',
            priority: 'medium'
          },
          {
            id: 'setup',
            title: 'Booth Setup Plan',
            description: 'Coordinate booth installation and testing',
            status: 'pending',
            priority: 'high'
          },
          {
            id: 'meetings',
            title: 'Pre-scheduled Meetings',
            description: 'Confirm appointments with key prospects',
            status: 'pending',
            priority: 'medium'
          }
        ],
        tips: [
          'Create a detailed setup timeline',
          'Prepare backup materials',
          'Test all technology beforehand',
          'Review lead capture process'
        ],
        costs: costs?.marketingCost || 0,
        duration: '3-5 days'
      },
      {
        id: 'exhibition',
        title: 'Exhibition Days',
        timeline: 'Event period',
        icon: Star,
        status: daysUntilEvent <= 0 && daysUntilEvent > -5 ? 'current' : daysUntilEvent <= -5 ? 'completed' : 'upcoming',
        activities: [
          {
            id: 'setup',
            title: 'Day 0 - Setup',
            description: 'Booth installation and final preparations',
            time: '8:00 AM - 6:00 PM',
            status: 'pending',
            priority: 'high'
          },
          {
            id: 'day1',
            title: 'Day 1 - Grand Opening',
            description: 'Exhibition opening and maximum engagement',
            time: '9:00 AM - 6:00 PM',
            status: 'pending',
            priority: 'high'
          },
          {
            id: 'day2',
            title: 'Day 2 - Peak Activity',
            description: 'Focus on lead generation and networking',
            time: '9:00 AM - 6:00 PM',
            status: 'pending',
            priority: 'high'
          },
          {
            id: 'day3',
            title: 'Day 3 - Closing & Teardown',
            description: 'Final networking and booth dismantling',
            time: '9:00 AM - 8:00 PM',
            status: 'pending',
            priority: 'medium'
          }
        ],
        tips: [
          'Arrive early for optimal booth positioning',
          'Keep energy high throughout the day',
          'Document everything with photos and videos',
          'Follow up on leads immediately'
        ],
        costs: costs?.staffCost || 0,
        duration: formData.eventDuration || '3 days'
      },
      {
        id: 'followup',
        title: 'Post-Exhibition',
        timeline: 'After event',
        icon: TrendingUp,
        status: daysUntilEvent <= -5 ? 'current' : 'upcoming',
        activities: [
          {
            id: 'breakdown',
            title: 'Booth Breakdown',
            description: 'Dismantle booth and ship materials back',
            status: 'pending',
            priority: 'medium'
          },
          {
            id: 'leads',
            title: 'Lead Processing',
            description: 'Organize and qualify all captured leads',
            status: 'pending',
            priority: 'high'
          },
          {
            id: 'followup',
            title: 'Immediate Follow-up',
            description: 'Contact hot prospects within 24-48 hours',
            status: 'pending',
            priority: 'high'
          },
          {
            id: 'analysis',
            title: 'ROI Analysis',
            description: 'Evaluate exhibition performance and ROI',
            status: 'pending',
            priority: 'medium'
          }
        ],
        tips: [
          'Follow up with leads within 48 hours',
          'Send personalized thank you messages',
          'Track conversion rates and revenue',
          'Plan improvements for next exhibition'
        ],
        costs: costs?.servicesCost || 0,
        duration: '2-4 weeks'
      }
    ];
  };

  const phases = getStoryPhases();

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay) {
      const timer = setInterval(() => {
        setCurrentPhase(prev => (prev + 1) % phases.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [autoPlay, phases.length]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'current': return 'text-blue-600 bg-blue-100';
      case 'upcoming': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header - Mobile Responsive */}
        <div className="sticky top-0 bg-white border-b p-3 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Exhibition Journey</h2>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Interactive visualization of your complete exhibition experience</p>
              <p className="text-xs text-gray-600 sm:hidden">Your exhibition timeline</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoPlay(!autoPlay)}
                className={`text-xs sm:text-sm ${autoPlay ? 'bg-emerald-50 text-emerald-600' : ''}`}
              >
                {autoPlay ? 'Pause' : 'Auto'}
              </Button>
              <button onClick={onClose} className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Timeline Navigation - Mobile Responsive */}
          <div className="mt-3 sm:mt-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Timeline</h3>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
                  disabled={currentPhase === 0}
                  className="p-1 sm:p-2"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <span className="text-xs sm:text-sm text-gray-600 px-1">
                  {currentPhase + 1}/{phases.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPhase(Math.min(phases.length - 1, currentPhase + 1))}
                  disabled={currentPhase === phases.length - 1}
                  className="p-1 sm:p-2"
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>

            {/* Phase Navigation Bar - Mobile Responsive */}
            <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
              {phases.map((phase, index) => {
                const IconComponent = phase.icon;
                return (
                  <button
                    key={phase.id}
                    onClick={() => setCurrentPhase(index)}
                    className={`flex-shrink-0 px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                      index === currentPhase
                        ? 'bg-emerald-600 text-white'
                        : `${getStatusColor(phase.status)} hover:bg-opacity-80`
                    }`}
                  >
                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{phase.title}</span>
                    <span className="sm:hidden">{phase.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <Progress value={((currentPhase + 1) / phases.length) * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Content - Mobile Responsive */}
        <div className="p-3 sm:p-6">
          {phases[currentPhase] && (
            <div className="space-y-4 sm:space-y-6">
              {/* Phase Header - Mobile Responsive */}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-3 sm:mb-4 ${getStatusColor(phases[currentPhase].status)}`}>
                  {React.createElement(phases[currentPhase].icon, { className: "w-8 h-8 sm:w-10 sm:h-10" })}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{phases[currentPhase].title}</h3>
                
                {/* Mobile: Stack info vertically */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {phases[currentPhase].timeline}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {phases[currentPhase].duration}
                  </span>
                  {(phases[currentPhase].costs || 0) > 0 && (
                    <span className="flex items-center">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {formatCurrency(phases[currentPhase].costs || 0)}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                      Key Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    {phases[currentPhase].activities.map((activity) => (
                      <div
                        key={activity.id}
                        className={`p-2 sm:p-3 border-l-4 bg-gray-50 rounded-r-lg ${getPriorityColor(activity.priority)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                              <div className="flex items-center space-x-2">
                                {getActivityStatusIcon(activity.status)}
                                <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{activity.title}</h4>
                              </div>
                              {activity.time && (
                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded self-start sm:self-auto">
                                  {activity.time}
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">{activity.description}</p>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ml-2 flex-shrink-0 ${
                            activity.priority === 'high' ? 'bg-red-100 text-red-600' :
                            activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {activity.priority}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Tips & Best Practices - Mobile Responsive */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm sm:text-base">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-2" />
                      Tips & Best Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    {phases[currentPhase].tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-yellow-50 rounded-lg">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-1 sm:mt-2 flex-shrink-0"></div>
                        <p className="text-xs sm:text-sm text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Phase Status Summary - Mobile Responsive */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-3 sm:p-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Phase Summary</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-emerald-600">
                      {phases[currentPhase].activities.filter(a => a.status === 'completed').length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">
                      {phases[currentPhase].activities.filter(a => a.status === 'in-progress').length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-gray-600">
                      {phases[currentPhase].activities.filter(a => a.status === 'pending').length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm sm:text-2xl font-bold text-purple-600">
                      {(phases[currentPhase].costs || 0) > 0 ? formatCurrency(phases[currentPhase].costs || 0) : '—'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Phase Cost</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Mobile Responsive */}
        <div className="sticky bottom-0 bg-white border-t p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Exhibition in {formData.destinationCity || 'Selected City'} • {formData.eventDuration || 3} days
            </div>
            <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
              <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none text-xs sm:text-sm">
                Close
              </Button>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 flex-1 sm:flex-none text-xs sm:text-sm"
                onClick={() => {
                  // Create and download exhibition journey as PDF
                  const journeyData = {
                    exhibition: formData.exhibitionName || 'Your Exhibition',
                    location: `${formData.destinationCity}, ${formData.destinationState}`,
                    duration: `${formData.eventDuration || 3} days`,
                    phases: phases.length,
                    totalActivities: phases.reduce((sum, phase) => sum + phase.activities.length, 0),
                    completedActivities: phases.reduce((sum, phase) => sum + phase.activities.filter(a => a.status === 'completed').length, 0),
                    generatedOn: new Date().toLocaleDateString()
                  };
                  
                  // Create a downloadable text file for now (can be enhanced to PDF later)
                  const content = `
EXHIBITION JOURNEY STORYBOARD
================================

Exhibition: ${journeyData.exhibition}
Location: ${journeyData.location}
Duration: ${journeyData.duration}
Generated: ${journeyData.generatedOn}

PHASES OVERVIEW:
${phases.map((phase, index) => `
${index + 1}. ${phase.title} (${phase.duration})
   Activities: ${phase.activities.length}
   Completed: ${phase.activities.filter(a => a.status === 'completed').length}
   In Progress: ${phase.activities.filter(a => a.status === 'in-progress').length}
   Pending: ${phase.activities.filter(a => a.status === 'pending').length}
   
   Key Activities:
${phase.activities.map(activity => `   - ${activity.title} [${activity.status}]`).join('\n')}
   
   Tips:
${phase.tips.map(tip => `   - ${tip}`).join('\n')}
`).join('\n')}

Generated by EaseMyExpo - Exhibition Cost Calculator
                  `;
                  
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${journeyData.exhibition.replace(/[^a-z0-9]/gi, '_')}_Journey_Storyboard.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                <span className="hidden sm:inline">Download Journey Map</span>
                <span className="sm:hidden">Download</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}