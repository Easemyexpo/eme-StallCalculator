import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Users, Calendar, Building, Target, Phone, Mail } from 'lucide-react';

interface ExhibitionTipsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExhibitionTips({ isOpen, onClose }: ExhibitionTipsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Exhibition Tips & Tricks</h2>
              <p className="text-gray-600">Complete guide for first-time and experienced exhibitors</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Pre-Exhibition Planning */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-blue-800">Pre-Exhibition Planning (3-6 months ahead)</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-blue-700 mb-3">Essential Bookings</h4>
                  <ul className="space-y-2 text-blue-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Book booth space 3-6 months in advance for better rates and prime location</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Confirm travel and accommodation bookings at least 30 days prior</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Register for exhibitor badges and arrange booth utilities (electricity, internet)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700 mb-3">Marketing Materials</h4>
                  <ul className="space-y-2 text-blue-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Prepare brochures, business cards, and product samples 2 weeks early</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Design standout banners and signage with clear company branding</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Prepare product demos and interactive displays</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Booth Setup & Design */}
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Building className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-green-800">Booth Setup & Design</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-3">Design Principles</h4>
                  <ul className="space-y-2 text-green-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Keep booth design simple, eye-catching, and on-brand</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Ensure good lighting and comfortable seating for client meetings</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Create clear pathways and open spaces to attract visitors</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-700 mb-3">Setup Tips</h4>
                  <ul className="space-y-2 text-green-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Arrive 1-2 days early for booth setup and staff briefing</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Have backup power solutions and keep promotional materials well-stocked</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Test all equipment and technology before the event opens</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* During the Exhibition */}
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-purple-800">During the Exhibition</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-purple-700 mb-3">Visitor Engagement</h4>
                  <ul className="space-y-2 text-purple-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Train your team on product demos and lead capture techniques</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Collect visitor contact information systematically using digital forms</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Be proactive in approaching visitors, but not pushy</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-700 mb-3">Networking</h4>
                  <ul className="space-y-2 text-purple-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Schedule follow-up meetings during the event for serious prospects</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Network with other exhibitors and attend conference sessions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span>Take notes on visitor interactions for better follow-up</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Post-Exhibition Follow-up */}
            <div className="bg-orange-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-semibold text-orange-800">Post-Exhibition Follow-up</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-orange-700 mb-3">Immediate Actions (48 hours)</h4>
                  <ul className="space-y-2 text-orange-600">
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 mt-1 text-orange-500" />
                      <span>Contact all leads within 48 hours while the event is fresh in their minds</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 mt-1 text-orange-500" />
                      <span>Send personalized thank you emails with product information</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 mt-1 text-orange-500" />
                      <span>Organize and categorize leads by priority and interest level</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-700 mb-3">Long-term Strategy</h4>
                  <ul className="space-y-2 text-orange-600">
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 mt-1 text-orange-500" />
                      <span>Schedule follow-up calls or meetings for qualified prospects</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 mt-1 text-orange-500" />
                      <span>Analyze ROI and feedback to improve future exhibition strategies</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 mt-1 text-orange-500" />
                      <span>Add qualified leads to your CRM and nurturing campaigns</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Expert Support */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Phone className="w-6 h-6 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-800">Need Expert Support?</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    Our EaseMyExpo team provides comprehensive exhibition support services including booth design, 
                    logistics coordination, vendor management, and post-event analytics.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-600">hello@easemyexpo.in</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-600">+91 9321522751</span>
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-2">Free Consultation Services</h4>
                  <ul className="text-sm text-emerald-700 space-y-1">
                    <li>• Exhibition strategy planning</li>
                    <li>• Booth design consultation</li>
                    <li>• Vendor selection assistance</li>
                    <li>• ROI measurement & analytics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}