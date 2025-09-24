import React from 'react';

interface EaseMyExpoLogoProps {
  className?: string;
}

export function EaseMyExpoLogo({ className = "h-16 w-auto" }: EaseMyExpoLogoProps) {
  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {/* Logo Icon */}
      <div className="flex items-center space-x-2">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <img 
            src="/attached_assets/Green Transparent_1755439114273.jpg"
            alt="EaseMyExpo Logo"
            className="w-full h-full object-contain"
            data-testid="img-easemyexpo-logo"
          />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          EaseMyExpo
        </span>
      </div>
    </div>
  );
}