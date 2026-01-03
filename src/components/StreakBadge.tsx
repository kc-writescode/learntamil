import { Flame, Trophy, BookOpen, MessageSquare } from 'lucide-react';
import { StreakData } from '../types';

interface StreakBadgeProps {
  streak: StreakData;
  compact?: boolean;
}

export default function StreakBadge({ streak, compact = false }: StreakBadgeProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 rounded-lg">
        <Flame className={`w-4 h-4 ${streak.current_streak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
        <span className={`text-sm font-semibold ${streak.current_streak > 0 ? 'text-orange-600' : 'text-gray-500'}`}>
          {streak.current_streak}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Learning Streak</h3>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>Best: {streak.longest_streak} days</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          streak.current_streak > 0
            ? 'bg-gradient-to-br from-orange-400 to-red-500'
            : 'bg-gray-200'
        }`}>
          <Flame className={`w-6 h-6 ${streak.current_streak > 0 ? 'text-white' : 'text-gray-400'}`} />
        </div>
        <div>
          <div className={`text-3xl font-bold ${streak.current_streak > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
            {streak.current_streak}
          </div>
          <div className="text-xs text-gray-500">
            {streak.current_streak === 1 ? 'day streak' : 'days streak'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          <div>
            <div className="text-sm font-semibold text-gray-900">{streak.total_words_learned}</div>
            <div className="text-xs text-gray-500">Words</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2">
          <MessageSquare className="w-4 h-4 text-indigo-500" />
          <div>
            <div className="text-sm font-semibold text-gray-900">{streak.total_sentences_learned}</div>
            <div className="text-xs text-gray-500">Sentences</div>
          </div>
        </div>
      </div>

      {streak.current_streak === 0 && (
        <p className="mt-3 text-xs text-center text-gray-500">
          Start learning today to begin your streak!
        </p>
      )}

      {streak.current_streak > 0 && streak.current_streak < streak.longest_streak && (
        <p className="mt-3 text-xs text-center text-orange-600">
          {streak.longest_streak - streak.current_streak} more days to beat your record!
        </p>
      )}

      {streak.current_streak > 0 && streak.current_streak >= streak.longest_streak && (
        <p className="mt-3 text-xs text-center text-green-600 font-medium">
          You're on your best streak ever!
        </p>
      )}
    </div>
  );
}
