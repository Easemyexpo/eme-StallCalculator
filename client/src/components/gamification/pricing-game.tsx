import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, TrendingUp, Zap, Star, Award } from 'lucide-react';

interface PricingGameProps {
  totalCost: number;
  budgetTarget?: number;
  costBreakdown: {
    category: string;
    amount: number;
    color: string;
  }[];
  onAchievement?: (achievement: string) => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  target: number;
}

export function PricingGame({ totalCost, budgetTarget = 200000, costBreakdown, onAchievement }: PricingGameProps) {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'budget_master',
      title: 'Budget Master',
      description: 'Stay within budget',
      icon: <Trophy className="w-4 h-4" />,
      unlocked: false,
      progress: 0,
      target: 1
    },
    {
      id: 'cost_optimizer',
      title: 'Cost Optimizer',
      description: 'Reduce costs by 20%',
      icon: <Target className="w-4 h-4" />,
      unlocked: false,
      progress: 0,
      target: 20
    },
    {
      id: 'efficiency_expert',
      title: 'Efficiency Expert',
      description: 'Optimize 5 different categories',
      icon: <Zap className="w-4 h-4" />,
      unlocked: false,
      progress: 0,
      target: 5
    }
  ]);

  // Calculate progress metrics
  const budgetUtilization = Math.min((totalCost / budgetTarget) * 100, 100);
  const savingsPercentage = Math.max(0, ((budgetTarget - totalCost) / budgetTarget) * 100);
  const efficiencyScore = Math.max(0, 100 - budgetUtilization);

  // Gamification logic
  useEffect(() => {
    const budgetUtilization = budgetTarget > 0 ? (totalCost / budgetTarget) * 100 : 0;
    const savingsPercentage = budgetTarget > 0 ? Math.max(0, ((budgetTarget - totalCost) / budgetTarget) * 100) : 0;
    const efficiencyScore = Math.min(100, (savingsPercentage + (100 - budgetUtilization)));
    
    const newScore = Math.round(efficiencyScore * 10);
    setScore(newScore);
    
    // Level progression
    const newLevel = Math.floor(newScore / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setStreak(streak + 1);
    }
    
    // Check achievements without causing state updates during render
    const updatedAchievements = achievements.map(achievement => {
      let progress = achievement.progress;
      let unlocked = achievement.unlocked;
      
      switch (achievement.id) {
        case 'budget_master':
          progress = totalCost <= budgetTarget ? 1 : 0;
          unlocked = progress >= achievement.target;
          break;
        case 'cost_optimizer':
          progress = savingsPercentage;
          unlocked = progress >= achievement.target;
          break;
        case 'efficiency_expert':
          progress = costBreakdown.length;
          unlocked = progress >= achievement.target;
          break;
      }
      
      if (unlocked && !achievement.unlocked && onAchievement) {
        // Use setTimeout to avoid state update during render
        setTimeout(() => onAchievement(achievement.title), 0);
      }
      
      return { ...achievement, progress, unlocked };
    });
    
    setAchievements(updatedAchievements);
  }, [totalCost, budgetTarget, costBreakdown, onAchievement]);

  const getRankBadge = () => {
    if (efficiencyScore >= 80) return { label: 'Expert', color: 'bg-green-600', icon: <Award className="w-3 h-3" /> };
    if (efficiencyScore >= 60) return { label: 'Advanced', color: 'bg-green-500', icon: <Star className="w-3 h-3" /> };
    if (efficiencyScore >= 40) return { label: 'Intermediate', color: 'bg-emerald-500', icon: <TrendingUp className="w-3 h-3" /> };
    return { label: 'Beginner', color: 'bg-green-400', icon: <Target className="w-3 h-3" /> };
  };

  const rank = getRankBadge();

  return (
    <div className="fixed left-4 top-32 w-80 z-30 space-y-4 hidden xl:block">
      {/* Main Game Card */}
      <Card className="bg-green-500/5 backdrop-blur-md border border-green-300/10 shadow-xl hover:bg-green-500/5 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-900 flex items-center gap-2 text-lg font-bold">
            <Trophy className="w-5 h-5 text-green-600" />
            Pricing Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Score and Level */}
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-green-800">{score.toLocaleString()}</div>
              <div className="text-xs text-green-600">Efficiency Points</div>
            </div>
            <div className="text-right">
              <Badge className={`${rank.color} text-white flex items-center gap-1`}>
                {rank.icon}
                {rank.label}
              </Badge>
              <div className="text-xs text-green-600 mt-1">Level {level}</div>
            </div>
          </div>
          
          {/* Progress Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-green-700 mb-1">
                <span>Budget Usage</span>
                <span>{budgetUtilization.toFixed(1)}%</span>
              </div>
              <Progress 
                value={budgetUtilization} 
                className="h-2 bg-green-200/30"
                style={{
                  background: budgetUtilization > 90 ? '#ef4444' : budgetUtilization > 70 ? '#f59e0b' : '#10b981'
                }}
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-green-700 mb-1">
                <span>Savings</span>
                <span>₹{((budgetTarget - totalCost) / 1000).toFixed(0)}k</span>
              </div>
              <Progress value={savingsPercentage} className="h-2 bg-green-200/30" />
            </div>
          </div>
          
          {/* Live Bar Chart */}
          <div className="bg-green-600/5 rounded-lg p-3 border border-green-300/5">
            <div className="text-xs text-green-800 mb-2 font-medium">Cost Breakdown</div>
            <div className="space-y-2">
              {costBreakdown.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-16 text-xs text-green-700 truncate">{item.category}</div>
                  <div className="flex-1 bg-green-200/20 rounded-full h-2 relative overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${(item.amount / totalCost) * 100}%`,
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                  <div className="text-xs text-green-700 w-12 text-right">
                    ₹{(item.amount / 1000).toFixed(0)}k
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Achievements Card */}
      <Card className="bg-green-500/5 backdrop-blur-md border border-green-300/10 shadow-xl hover:bg-green-500/5 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-green-900 flex items-center gap-2 text-sm font-bold">
            <Award className="w-4 h-4 text-green-600" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                achievement.unlocked 
                  ? 'bg-green-100/80 border border-green-400/50' 
                  : 'bg-green-50/60 border border-green-300/30'
              }`}
            >
              <div className={`${achievement.unlocked ? 'text-green-600' : 'text-green-400'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium ${achievement.unlocked ? 'text-green-800' : 'text-green-700'}`}>
                  {achievement.title}
                </div>
                <div className="text-xs text-green-600">{achievement.description}</div>
                {!achievement.unlocked && (
                  <div className="mt-1">
                    <Progress 
                      value={(achievement.progress / achievement.target) * 100} 
                      className="h-1 bg-green-200/30"
                    />
                  </div>
                )}
              </div>
              {achievement.unlocked && (
                <div className="text-green-400 text-xs">✓</div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Quick Stats */}
      <Card className="bg-gradient-to-br from-orange-900/95 to-red-900/95 border-orange-500/30 backdrop-blur-sm">
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="text-xl font-bold text-orange-400">{streak}</div>
              <div className="text-xs text-gray-300">Win Streak</div>
            </div>
            <div>
              <div className="text-xl font-bold text-red-400">
                {achievements.filter(a => a.unlocked).length}
              </div>
              <div className="text-xs text-gray-300">Unlocked</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}