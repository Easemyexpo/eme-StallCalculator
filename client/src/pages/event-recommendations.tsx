import React from 'react';
import { EventRecommendations } from '@/components/event-recommendations';
import { EaseMyExpoLogo } from '@/components/easemyexpo-logo';

export function EventRecommendationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-green to-surface-green">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-primary-green/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <EaseMyExpoLogo className="h-12" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EventRecommendations />
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-white/80 backdrop-blur-sm border-t border-primary-green/20">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-text-secondary">
            Powered by EaseMyExpo - Your Exhibition Planning Partner
          </p>
        </div>
      </footer>
    </div>
  );
}