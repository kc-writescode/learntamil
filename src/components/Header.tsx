import { useState, useRef, useEffect } from 'react';
import { Languages, Flame, Trophy, BookOpen, MessageSquare, X } from 'lucide-react';
import { StreakData } from '../types';

interface HeaderProps {
  streak: StreakData;
}

export default function Header({ streak }: HeaderProps) {
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowStreakPopup(false);
      }
    };

    if (showStreakPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStreakPopup]);

  return (
    <header className="bg-white border-b border-gray-200 px-3 md:px-6 py-2 md:py-3">
      <div className="flex items-center justify-between gap-2">
        {/* Logo and title */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="w-9 h-9 md:w-11 md:h-11 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Languages className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base md:text-xl font-bold text-gray-900 truncate">Learn Tamil</h1>
            <p className="text-xs text-gray-500 hidden sm:block">by Deni Akka</p>
          </div>
        </div>

        {/* Streak section - clickable for details */}
        <div className="relative flex-shrink-0" ref={popupRef}>
          <button
            onClick={() => setShowStreakPopup(!showStreakPopup)}
            className={`
              flex items-center gap-2 md:gap-3 px-2 md:px-4 py-1.5 md:py-2 rounded-xl
              transition-all duration-200
              ${streak.current_streak > 0
                ? 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 hover:shadow-md hover:shadow-orange-100'
                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }
            `}
          >
            {/* Flame icon */}
            <div className={`
              w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
              ${streak.current_streak > 0
                ? 'bg-gradient-to-br from-orange-400 to-red-500'
                : 'bg-gray-200'
              }
            `}>
              <Flame className={`w-4 h-4 md:w-5 md:h-5 ${streak.current_streak > 0 ? 'text-white' : 'text-gray-400'}`} />
            </div>

            {/* Streak count */}
            <div className="text-left">
              <div className={`text-lg md:text-2xl font-bold leading-none ${streak.current_streak > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                {streak.current_streak}
              </div>
              <div className="text-[10px] md:text-xs text-gray-500">
                {streak.current_streak === 1 ? 'day' : 'days'}
              </div>
            </div>

            {/* Stats - hidden on small mobile */}
            <div className="hidden sm:flex items-center gap-3 pl-2 md:pl-3 border-l border-gray-200">
              <div className="text-center">
                <div className="text-sm md:text-base font-semibold text-green-600">{streak.total_words_learned}</div>
                <div className="text-[10px] text-gray-500">Words</div>
              </div>
              <div className="text-center">
                <div className="text-sm md:text-base font-semibold text-blue-600">{streak.total_sentences_learned}</div>
                <div className="text-[10px] text-gray-500">Sentences</div>
              </div>
            </div>
          </button>

          {/* Streak popup - detailed view */}
          {showStreakPopup && (
            <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white relative">
                <button
                  onClick={() => setShowStreakPopup(false)}
                  className="absolute right-2 top-2 p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="font-bold text-lg">Learning Streak</h3>
                <div className="flex items-center gap-1 text-orange-100 text-sm mt-1">
                  <Trophy className="w-4 h-4" />
                  <span>Best: {streak.longest_streak} {streak.longest_streak === 1 ? 'day' : 'days'}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Current streak */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center
                    ${streak.current_streak > 0
                      ? 'bg-gradient-to-br from-orange-400 to-red-500'
                      : 'bg-gray-200'
                    }
                  `}>
                    <Flame className={`w-8 h-8 ${streak.current_streak > 0 ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <div className={`text-4xl font-bold ${streak.current_streak > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                      {streak.current_streak}
                    </div>
                    <div className="text-sm text-gray-500">
                      {streak.current_streak === 1 ? 'day streak' : 'days streak'}
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-600">{streak.total_words_learned}</div>
                      <div className="text-xs text-gray-500">Words Learned</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">{streak.total_sentences_learned}</div>
                      <div className="text-xs text-gray-500">Sentences</div>
                    </div>
                  </div>
                </div>

                {/* Motivational message */}
                {streak.current_streak === 0 && (
                  <div className="text-center py-3 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">Start learning today to begin your streak! 🔥</p>
                  </div>
                )}

                {streak.current_streak > 0 && streak.current_streak < streak.longest_streak && (
                  <div className="text-center py-3 bg-orange-50 rounded-xl">
                    <p className="text-sm text-orange-600 font-medium">
                      {streak.longest_streak - streak.current_streak} more {streak.longest_streak - streak.current_streak === 1 ? 'day' : 'days'} to beat your record! 💪
                    </p>
                  </div>
                )}

                {streak.current_streak > 0 && streak.current_streak >= streak.longest_streak && (
                  <div className="text-center py-3 bg-green-50 rounded-xl">
                    <p className="text-sm text-green-600 font-medium">
                      You're on your best streak ever! 🎉
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
