import React, { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, Target, Users, MapPin, Calendar, DollarSign, Award } from 'lucide-react';

interface RotatingTipsProps {
  className?: string;
}

export function RotatingTips({ className }: RotatingTipsProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  const tips = [
    {
      icon: Lightbulb,
      category: "Smart Planning",
      tip: "Book flights 45-60 days early to save 15-25% on travel costs",
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      icon: TrendingUp,
      category: "Budget Optimization",
      tip: "Peak season (Oct-Mar) costs 20% more - plan accordingly",
      color: "bg-green-50 border-green-200 text-green-800"
    },
    {
      icon: Target,
      category: "Booth Strategy",
      tip: "Corner booths get 40% more footfall but cost 15% extra",
      color: "bg-purple-50 border-purple-200 text-purple-800"
    },
    {
      icon: Users,
      category: "Team Efficiency",
      tip: "2-person teams per 9 sqm booth maximize visitor engagement",
      color: "bg-orange-50 border-orange-200 text-orange-800"
    },
    {
      icon: MapPin,
      category: "Location Insights",
      tip: "Mumbai venues cost 15% more but generate 30% higher ROI",
      color: "bg-pink-50 border-pink-200 text-pink-800"
    },
    {
      icon: Calendar,
      category: "Timing Tips",
      tip: "Tuesday-Thursday events have 25% better business attendance",
      color: "bg-indigo-50 border-indigo-200 text-indigo-800"
    },
    {
      icon: DollarSign,
      category: "Cost Savings",
      tip: "Shared transport for teams of 4+ saves ₹8,000-12,000",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800"
    },
    {
      icon: Award,
      category: "Success Factor",
      tip: "Follow-up within 48 hours increases conversion by 60%",
      color: "bg-yellow-50 border-yellow-200 text-yellow-800"
    },
    {
      icon: Lightbulb,
      category: "Vendor Selection",
      tip: "Local vendors reduce setup costs by 20-30% vs national chains",
      color: "bg-cyan-50 border-cyan-200 text-cyan-800"
    },
    {
      icon: TrendingUp,
      category: "ROI Booster",
      tip: "Interactive demos increase lead quality by 45%",
      color: "bg-red-50 border-red-200 text-red-800"
    },
    {
      icon: Target,
      category: "Space Planning",
      tip: "Open booth designs attract 35% more visitors than closed ones",
      color: "bg-violet-50 border-violet-200 text-violet-800"
    },
    {
      icon: Users,
      category: "Networking",
      tip: "Business lunch meetings convert 3x better than booth visits",
      color: "bg-teal-50 border-teal-200 text-teal-800"
    },
    {
      icon: MapPin,
      category: "Market Research",
      tip: "Research local competitors 2 weeks before exhibition start",
      color: "bg-rose-50 border-rose-200 text-rose-800"
    },
    {
      icon: Calendar,
      category: "Preparation",
      tip: "Finalize booth design 30 days early to avoid rush charges",
      color: "bg-lime-50 border-lime-200 text-lime-800"
    },
    {
      icon: DollarSign,
      category: "Hidden Costs",
      tip: "Budget 15% extra for unexpected venue charges and tips",
      color: "bg-amber-50 border-amber-200 text-amber-800"
    },
    {
      icon: Award,
      category: "Industry Insight",
      tip: "B2B exhibitions generate 5x more qualified leads than B2C",
      color: "bg-sky-50 border-sky-200 text-sky-800"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [tips.length]);

  const currentTip = tips[currentTipIndex];
  const IconComponent = currentTip.icon;

  return (
    <div className={`${className} transition-all duration-500 ease-in-out`}>
      <div className={`border rounded-lg p-4 ${currentTip.color} transform transition-all duration-500`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <IconComponent className="w-5 h-5 mt-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold uppercase tracking-wide">
                {currentTip.category}
              </p>
              <div className="flex space-x-1">
                {tips.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === currentTipIndex 
                        ? 'bg-current opacity-100' 
                        : 'bg-current opacity-30'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm font-medium leading-relaxed">
              💡 {currentTip.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}