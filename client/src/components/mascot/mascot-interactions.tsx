import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Star, TrendingUp, Target, Gift, Zap, Coffee, Heart } from 'lucide-react';

// Enhanced interactions based on user behavior
interface MascotInteraction {
  trigger: 'cost_increase' | 'cost_decrease' | 'step_complete' | 'form_error' | 'vendor_select' | 'achievement' | 'idle' | 'budget_exceeded';
  message: string;
  mood: 'happy' | 'excited' | 'concerned' | 'celebrating' | 'thinking';
  duration?: number;
  actionText?: string;
  onAction?: () => void;
}

const interactionTemplates: Record<string, MascotInteraction[]> = {
  cost_increase: [
    {
      trigger: 'cost_increase',
      message: "Hmm, I noticed costs went up. Let me suggest some ways to optimize without sacrificing quality!",
      mood: 'thinking',
      actionText: "Show Tips",
    },
    {
      trigger: 'cost_increase',
      message: "Don't worry! Higher costs often mean better ROI. Premium booths generate 40% more leads!",
      mood: 'happy',
    }
  ],
  cost_decrease: [
    {
      trigger: 'cost_decrease',
      message: "Great job saving money! Smart exhibitors like you achieve better ROI through strategic planning.",
      mood: 'celebrating',
    },
    {
      trigger: 'cost_decrease',
      message: "Excellent savings! You're on track for a profitable exhibition experience.",
      mood: 'excited',
    }
  ],
  achievement: [
    {
      trigger: 'achievement',
      message: "🎉 Achievement unlocked! You're becoming an exhibition planning expert!",
      mood: 'celebrating',
    },
    {
      trigger: 'achievement',
      message: "Wow! You've earned another achievement. Your planning skills are impressive!",
      mood: 'excited',
    }
  ],
  step_complete: [
    {
      trigger: 'step_complete',
      message: "Fantastic progress! Each completed step brings you closer to exhibition success.",
      mood: 'happy',
    },
    {
      trigger: 'step_complete',
      message: "You're doing amazing! Professional exhibitors follow this exact planning process.",
      mood: 'excited',
    }
  ],
  budget_exceeded: [
    {
      trigger: 'budget_exceeded',
      message: "Budget alert! Let me help you find cost-effective alternatives that maintain impact.",
      mood: 'concerned',
      actionText: "Optimize Budget",
    }
  ],
  vendor_select: [
    {
      trigger: 'vendor_select',
      message: "Excellent vendor choice! This partner has a 95% client satisfaction rate.",
      mood: 'happy',
    },
    {
      trigger: 'vendor_select',
      message: "Smart selection! This vendor specializes in your industry and location.",
      mood: 'excited',
    }
  ]
};

// Floating mascot for specific interactions
export const InteractiveMascot: React.FC<{
  interaction: MascotInteraction | null;
  onComplete: () => void;
  onAction?: () => void;
}> = ({ interaction, onComplete, onAction }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (interaction) {
      setIsVisible(true);
      const duration = interaction.duration || 4000;
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 300); // Wait for animation to complete
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [interaction, onComplete]);

  if (!interaction) return null;

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'celebrating': return <Star className="w-4 h-4" />;
      case 'excited': return <Zap className="w-4 h-4" />;
      case 'thinking': return <Lightbulb className="w-4 h-4" />;
      case 'concerned': return <Target className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'celebrating': return 'from-yellow-400 to-orange-500';
      case 'excited': return 'from-purple-500 to-pink-500';
      case 'thinking': return 'from-blue-500 to-indigo-500';
      case 'concerned': return 'from-red-400 to-red-600';
      default: return 'from-emerald-500 to-teal-600';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className={`bg-gradient-to-r ${getMoodColor(interaction.mood)} p-4 rounded-2xl text-white shadow-2xl`}>
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                {getMoodIcon(interaction.mood)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{interaction.message}</p>
                {interaction.actionText && onAction && (
                  <button
                    onClick={() => {
                      onAction();
                      setIsVisible(false);
                      onComplete();
                    }}
                    className="mt-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                  >
                    {interaction.actionText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Smart mascot that responds to user behavior patterns
export const SmartMascotEngine: React.FC<{
  currentStep: number;
  totalCost: number;
  previousCost?: number;
  achievements: string[];
  formData: any;
  selectedVendors: string[];
  userBudget?: number;
}> = ({ 
  currentStep, 
  totalCost, 
  previousCost, 
  achievements, 
  formData, 
  selectedVendors, 
  userBudget 
}) => {
  const [currentInteraction, setCurrentInteraction] = useState<MascotInteraction | null>(null);
  const [lastAchievementCount, setLastAchievementCount] = useState(0);

  // Smart interaction logic
  useEffect(() => {
    if (currentInteraction) return; // Don't interrupt current interaction

    // Cost change interactions
    if (previousCost && totalCost !== previousCost) {
      const templates = totalCost > previousCost 
        ? interactionTemplates.cost_increase 
        : interactionTemplates.cost_decrease;
      
      const interaction = templates[Math.floor(Math.random() * templates.length)];
      setCurrentInteraction(interaction);
      return;
    }

    // Achievement interactions
    if (achievements.length > lastAchievementCount) {
      const templates = interactionTemplates.achievement;
      const interaction = templates[Math.floor(Math.random() * templates.length)];
      setCurrentInteraction(interaction);
      setLastAchievementCount(achievements.length);
      return;
    }

    // Budget exceeded warning
    if (userBudget && totalCost > userBudget * 1.2) {
      const templates = interactionTemplates.budget_exceeded;
      const interaction = templates[Math.floor(Math.random() * templates.length)];
      setCurrentInteraction(interaction);
      return;
    }

    // Vendor selection celebration
    if (selectedVendors.length > 0) {
      const templates = interactionTemplates.vendor_select;
      const interaction = templates[Math.floor(Math.random() * templates.length)];
      setCurrentInteraction(interaction);
      return;
    }

  }, [totalCost, previousCost, achievements.length, lastAchievementCount, userBudget, selectedVendors.length, currentInteraction]);

  const handleInteractionComplete = () => {
    setCurrentInteraction(null);
  };

  const handleOptimizeBudget = () => {
    // This could trigger a budget optimization wizard
    console.log('Budget optimization requested');
  };

  return (
    <InteractiveMascot
      interaction={currentInteraction}
      onComplete={handleInteractionComplete}
      onAction={currentInteraction?.actionText === 'Optimize Budget' ? handleOptimizeBudget : undefined}
    />
  );
};

// Celebration effects for major milestones
export const MascotCelebration: React.FC<{
  show: boolean;
  onComplete: () => void;
  milestone: 'first_quote' | 'vendor_selected' | 'budget_optimized' | 'planning_complete';
}> = ({ show, onComplete, milestone }) => {
  const celebrations = {
    first_quote: {
      message: "🎉 Congratulations! You've created your first professional exhibition quote!",
      subtext: "Share this with your team or use it for budget approvals.",
      color: "from-yellow-400 via-orange-500 to-red-500"
    },
    vendor_selected: {
      message: "🤝 Excellent! You've connected with trusted exhibition partners!",
      subtext: "These vendors will help bring your vision to life.",
      color: "from-blue-400 via-purple-500 to-pink-500"
    },
    budget_optimized: {
      message: "💰 Smart savings achieved! You've optimized costs without compromising quality!",
      subtext: "Your strategic approach will maximize ROI.",
      color: "from-green-400 via-emerald-500 to-teal-500"
    },
    planning_complete: {
      message: "🏆 Mission accomplished! Your exhibition plan is ready for success!",
      subtext: "You're now equipped for an amazing trade show experience.",
      color: "from-purple-400 via-pink-500 to-red-500"
    }
  };

  const celebration = celebrations[milestone];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onComplete}
        >
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl"
          >
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${celebration.color} flex items-center justify-center`}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-white text-3xl"
              >
                🎉
              </motion.div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {celebration.message}
            </h3>
            
            <p className="text-gray-600 mb-6">
              {celebration.subtext}
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className={`bg-gradient-to-r ${celebration.color} text-white px-6 py-3 rounded-full font-semibold shadow-lg`}
            >
              Continue Planning
            </motion.button>
            
            {/* Confetti effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{ 
                    x: '50%', 
                    y: '50%',
                    scale: 0 
                  }}
                  animate={{ 
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    scale: [0, 1, 0],
                    rotate: 360
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SmartMascotEngine;