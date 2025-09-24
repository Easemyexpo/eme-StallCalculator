import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, TrendingUp, Target, Award } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface NotificationProps {
  achievement: Achievement | null;
  onComplete: () => void;
}

export function AchievementNotification({ achievement, onComplete }: NotificationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (achievement) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onComplete, 300);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, onComplete]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-20 max-w-sm"
        >
          <div className="bg-green-100/20 backdrop-blur-lg border border-green-200/30 text-green-800 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}>
            <div className="flex items-center gap-3">
              <div className="text-2xl animate-bounce">
                {achievement.icon}
              </div>
              <div>
                <div className="font-bold text-lg text-green-900">Achievement Unlocked!</div>
                <div className="text-sm text-green-800 opacity-90">{achievement.title}</div>
                <div className="text-xs text-green-700 opacity-85">{achievement.description}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface PricingFeedbackProps {
  totalCost: number;
  budgetTarget: number;
  previousCost?: number;
}

export function PricingFeedback({ totalCost, budgetTarget, previousCost }: PricingFeedbackProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'warning' | 'info'>('info');

  useEffect(() => {
    if (previousCost !== undefined && previousCost !== totalCost) {
      const difference = previousCost - totalCost;
      const percentageChange = (difference / previousCost) * 100;
      
      if (difference > 0 && percentageChange > 5) {
        setFeedback(`Great! You saved ₹${(difference / 1000).toFixed(0)}k`);
        setFeedbackType('success');
      } else if (difference < 0 && Math.abs(percentageChange) > 10) {
        setFeedback(`Cost increased by ₹${(Math.abs(difference) / 1000).toFixed(0)}k`);
        setFeedbackType('warning');
      } else if (totalCost <= budgetTarget * 0.8) {
        setFeedback('Excellent budget efficiency!');
        setFeedbackType('success');
      }
      
      if (feedback) {
        setTimeout(() => setFeedback(null), 2500);
      }
    }
  }, [totalCost, previousCost, budgetTarget, feedback]);

  const budgetUtilization = (totalCost / budgetTarget) * 100;
  
  const getStatusMessage = () => {
    if (budgetUtilization <= 60) return { text: 'Excellent! Well under budget', color: 'text-green-400' };
    if (budgetUtilization <= 80) return { text: 'Good budget management', color: 'text-blue-400' };
    if (budgetUtilization <= 95) return { text: 'Close to budget limit', color: 'text-yellow-400' };
    return { text: 'Over budget - consider optimization', color: 'text-red-400' };
  };

  const status = getStatusMessage();

  return (
    <div className="fixed bottom-4 left-4 space-y-2 z-30 max-w-xs hidden md:block">
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`p-3 rounded-lg shadow-lg border backdrop-blur-sm ${
              feedbackType === 'success' 
                ? 'bg-green-100/95 border-green-400/50 text-green-800' 
                : feedbackType === 'warning'
                ? 'bg-yellow-100/95 border-yellow-400/50 text-yellow-800'
                : 'bg-blue-100/95 border-blue-400/50 text-blue-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackType === 'success' && <TrendingUp className="w-4 h-4" />}
              {feedbackType === 'warning' && <Target className="w-4 h-4" />}
              {feedbackType === 'info' && <Star className="w-4 h-4" />}
              <span className="text-sm font-medium">{feedback}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Persistent Status */}
      <div className={`p-3 rounded-lg shadow-lg border backdrop-blur-sm ${
        budgetUtilization > 100 
          ? 'bg-red-500/90 border-red-400/50' 
          : 'bg-gray-900/90 border-gray-600/30'
      }`}>
        <div className={`text-sm font-medium ${
          budgetUtilization > 100 ? 'text-green-100' : status.color
        }`}>
          {status.text}
        </div>
        <div className={`text-xs mt-1 ${
          budgetUtilization > 100 ? 'text-green-200' : 'text-gray-400'
        }`}>
          ₹{(totalCost / 1000).toFixed(0)}k / ₹{(budgetTarget / 1000).toFixed(0)}k
        </div>
      </div>
    </div>
  );
}