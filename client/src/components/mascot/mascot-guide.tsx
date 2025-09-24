import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Lightbulb, TrendingUp, Calendar, Users, MapPin, DollarSign, Sparkles } from 'lucide-react';

// Mascot SVG Component
const ExpoMascot = ({ mood = 'happy', size = 80 }: { mood?: 'happy' | 'excited' | 'thinking' | 'celebrating', size?: number }) => {
  return (
    <motion.div
      animate={{
        y: mood === 'excited' ? [-2, 2, -2] : [0, -3, 0],
        rotate: mood === 'celebrating' ? [0, 5, -5, 0] : 0
      }}
      transition={{
        duration: mood === 'excited' ? 0.8 : 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Body */}
        <ellipse cx="50" cy="65" rx="25" ry="20" fill="#10B981" />
        
        {/* Head */}
        <circle cx="50" cy="35" r="20" fill="#34D399" />
        
        {/* Eyes */}
        <circle cx="44" cy="30" r="3" fill="#1F2937" />
        <circle cx="56" cy="30" r="3" fill="#1F2937" />
        
        {/* Eye sparkles */}
        {mood === 'excited' && (
          <>
            <circle cx="45" cy="29" r="1" fill="white" />
            <circle cx="57" cy="29" r="1" fill="white" />
          </>
        )}
        
        {/* Mouth */}
        {mood === 'happy' && <path d="M 45 38 Q 50 42 55 38" stroke="#1F2937" strokeWidth="2" fill="none" />}
        {mood === 'excited' && <ellipse cx="50" cy="40" rx="4" ry="3" fill="#1F2937" />}
        {mood === 'thinking' && <path d="M 45 38 L 55 38" stroke="#1F2937" strokeWidth="2" />}
        {mood === 'celebrating' && <path d="M 42 38 Q 50 44 58 38" stroke="#1F2937" strokeWidth="2" fill="none" />}
        
        {/* Arms */}
        <ellipse cx="30" cy="55" rx="8" ry="4" fill="#10B981" transform="rotate(-20 30 55)" />
        <ellipse cx="70" cy="55" rx="8" ry="4" fill="#10B981" transform="rotate(20 70 55)" />
        
        {/* Badge/Logo */}
        <circle cx="50" cy="60" r="6" fill="#065F46" />
        <text x="50" y="65" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">E</text>
        
        {/* Sparkles for celebrating mood */}
        {mood === 'celebrating' && (
          <>
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <path d="M 25 25 L 27 27 L 25 29 L 23 27 Z" fill="#F59E0B" />
              <path d="M 75 20 L 77 22 L 75 24 L 73 22 Z" fill="#F59E0B" />
              <path d="M 80 70 L 82 72 L 80 74 L 78 72 Z" fill="#F59E0B" />
            </motion.g>
          </>
        )}
      </svg>
    </motion.div>
  );
};

interface MascotMessage {
  step: number;
  title: string;
  message: string;
  tips?: string[];
  mood: 'happy' | 'excited' | 'thinking' | 'celebrating';
  icon?: React.ReactNode;
}

const stepMessages: MascotMessage[] = [
  {
    step: 1,
    title: "Welcome to EaseMyExpo! 🎪",
    message: "Hi there! I'm Expo, your friendly exhibition planning assistant. Let's create an amazing trade show experience together! Start by telling me about your event and destination.",
    tips: [
      "Choose cities with major exhibition centers for better vendor availability",
      "Consider travel distances for your team when selecting destinations",
      "Industry selection helps me recommend relevant exhibitions"
    ],
    mood: 'excited',
    icon: <MapPin className="w-4 h-4" />
  },
  {
    step: 2,
    title: "Design Your Dream Booth! 🏗️",
    message: "Now for the exciting part - designing your booth! I'll help you choose the perfect size, materials, and features that match your budget and brand image.",
    tips: [
      "Shell scheme booths are cost-effective for first-time exhibitors",
      "Corner booths get 50% more foot traffic than inline booths",
      "Quality flooring makes a huge impression on visitors"
    ],
    mood: 'thinking',
    icon: <Lightbulb className="w-4 h-4" />
  },
  {
    step: 3,
    title: "Boost Your Impact! ⚡",
    message: "Let's add some extra sparkle! Choose additional services that will make your booth stand out and attract more visitors.",
    tips: [
      "AV equipment helps showcase products effectively",
      "Professional lighting can increase booth attractiveness by 40%",
      "Storage space keeps your booth organized throughout the event"
    ],
    mood: 'excited',
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    step: 4,
    title: "Find Perfect Partners! 🤝",
    message: "I'm connecting you with top-rated vendors who specialize in your industry. These partners will help bring your vision to life!",
    tips: [
      "Verified vendors have proven track records",
      "Local vendors often provide better support during events",
      "Compare portfolios to find vendors matching your style"
    ],
    mood: 'happy',
    icon: <Users className="w-4 h-4" />
  },
  {
    step: 5,
    title: "Time to Fly! ✈️",
    message: "Smart exhibitors save big on flights! I've found the best options for your team. Choose flights that give you time to set up without stress.",
    tips: [
      "Early morning arrivals give you full setup days",
      "Direct flights reduce travel fatigue for your team",
      "Flexible tickets are worth it for exhibition schedules"
    ],
    mood: 'excited',
    icon: <TrendingUp className="w-4 h-4" />
  },
  {
    step: 6,
    title: "Rest Well, Exhibit Better! 🏨",
    message: "Your team deserves great rest after busy exhibition days. I've selected hotels that offer the perfect balance of comfort, location, and value.",
    tips: [
      "Hotels near venues save daily transport costs",
      "Business facilities help with last-minute presentation prep",
      "Good breakfast keeps your team energized all day"
    ],
    mood: 'happy',
    icon: <Calendar className="w-4 h-4" />
  },
  {
    step: 7,
    title: "Success Achieved! 🎉",
    message: "Congratulations! You've planned a complete exhibition package. Your total investment of ₹{total} will deliver amazing returns. Ready to make it official?",
    tips: [
      "Professional quotes help with budget approvals",
      "Our 24/7 support ensures smooth execution",
      "Early booking often gets additional discounts"
    ],
    mood: 'celebrating',
    icon: <DollarSign className="w-4 h-4" />
  }
];

interface MascotGuideProps {
  currentStep: number;
  totalCost?: number;
  onClose?: () => void;
  formData?: any;
}

export const MascotGuide: React.FC<MascotGuideProps> = ({ 
  currentStep, 
  totalCost, 
  onClose,
  formData 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<MascotMessage | null>(null);
  const [hasShownStep, setHasShownStep] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Show mascot guide when step changes (only once per step)
    if (!hasShownStep.has(currentStep)) {
      const message = stepMessages.find(msg => msg.step === currentStep);
      if (message) {
        let finalMessage = { ...message };
        
        // Personalize the final step message with actual total
        if (currentStep === 7 && totalCost) {
          finalMessage.message = finalMessage.message.replace(
            '₹{total}', 
            `₹${(totalCost / 100000).toFixed(1)}L`
          );
        }
        
        setCurrentMessage(finalMessage);
        setIsVisible(true);
        setHasShownStep(prev => new Set(Array.from(prev).concat([currentStep])));
        
        // Auto-hide after 8 seconds (except for final step)
        if (currentStep !== 7) {
          setTimeout(() => {
            setIsVisible(false);
          }, 8000);
        }
      }
    }
  }, [currentStep, totalCost, hasShownStep]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <AnimatePresence>
      {isVisible && currentMessage && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            duration: 0.6
          }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-10"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <ExpoMascot mood={currentMessage.mood} size={40} />
                  <div>
                    <h3 className="font-bold text-sm">{currentMessage.title}</h3>
                    <p className="text-xs opacity-90">Step {currentStep} of 7</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div className="p-4">
              <div className="flex items-start space-x-3 mb-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  {currentMessage.icon}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed flex-1">
                  {currentMessage.message}
                </p>
              </div>

              {/* Tips Section */}
              {currentMessage.tips && currentMessage.tips.length > 0 && (
                <div className="bg-emerald-50 rounded-lg p-3 mt-3">
                  <h4 className="text-xs font-semibold text-emerald-800 mb-2 flex items-center">
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Pro Tips:
                  </h4>
                  <ul className="space-y-1">
                    {currentMessage.tips.map((tip, index) => (
                      <li key={index} className="text-xs text-emerald-700 flex items-start">
                        <span className="text-emerald-500 mr-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Progress indicator */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{Math.round((currentStep / 7) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / 7) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Action Button for Final Step */}
            {currentStep === 7 && (
              <div className="p-4 pt-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow"
                >
                  🎉 Continue to Quote Generation
                </motion.button>
              </div>
            )}
          </div>

          {/* Floating mascot for attention */}
          <motion.div
            className="absolute -top-2 -left-2"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ExpoMascot mood={currentMessage.mood} size={24} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Quick Help Button Component
export const MascotHelpButton: React.FC<{
  onClick: () => void;
  hasActiveMessage?: boolean;
}> = ({ onClick, hasActiveMessage = false }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`fixed bottom-4 right-4 z-40 p-3 rounded-full shadow-lg transition-all ${
        hasActiveMessage ? 'bg-gray-100 text-gray-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-xl'
      }`}
      whileHover={{ scale: hasActiveMessage ? 1 : 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        y: hasActiveMessage ? [0] : [0, -2, 0],
      }}
      transition={{
        duration: 2,
        repeat: hasActiveMessage ? 0 : Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="flex items-center space-x-2">
        <ExpoMascot mood="happy" size={20} />
        {!hasActiveMessage && (
          <span className="text-sm font-medium hidden sm:block">Need Help?</span>
        )}
      </div>
      
      {!hasActiveMessage && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

export default MascotGuide;