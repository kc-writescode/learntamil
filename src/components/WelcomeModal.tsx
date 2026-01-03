import { useState, useEffect, useMemo } from 'react';
import { X, Flame, Sparkles, BookOpen, MessageSquare } from 'lucide-react';
import { StreakData } from '../types';

interface WelcomeModalProps {
  streak: StreakData;
  onClose: () => void;
}

const QUOTES = [
  "A different language is a different vision of life. — Federico Fellini",
  "The limits of my language mean the limits of my world. — Ludwig Wittgenstein",
  "One language sets you in a corridor for life. Two languages open every door along the way. — Frank Smith",
  "To have another language is to possess a second soul. — Charlemagne",
  "Language is the road map of a culture. It tells you where its people come from and where they are going. — Rita Mae Brown",
  "Learning another language is not only learning different words for the same things, but learning another way to think about things. — Flora Lewis",
  "The more languages you know, the more you are human. — Tomáš Garrigue Masaryk",
  "Language is the key to the heart of people. — Ahmed Deedat",
];

export default function WelcomeModal({ streak, onClose }: WelcomeModalProps) {
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getMotivationalMessage = () => {
    if (streak.current_streak === 0) {
      return "Start your learning journey today!";
    } else if (streak.current_streak === 1) {
      return "Great start! Keep the momentum going!";
    } else if (streak.current_streak < 7) {
      return `${streak.current_streak} days strong! You're building a habit!`;
    } else if (streak.current_streak < 30) {
      return `Amazing ${streak.current_streak}-day streak! You're unstoppable!`;
    } else {
      return `Incredible ${streak.current_streak}-day streak! You're a language champion!`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <button
            onClick={handleClose}
            className="absolute right-3 top-3 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-indigo-200 text-sm font-medium">Welcome Back!</span>
            </div>
            <h2 className="text-2xl font-bold">{getGreeting()}!</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quote */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-5 border border-amber-100">
            <p className="text-gray-700 italic text-sm leading-relaxed">"{quote}"</p>
          </div>

          {/* Streak display */}
          <div className="flex items-center gap-4 mb-5">
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0
              ${streak.current_streak > 0
                ? 'bg-gradient-to-br from-orange-400 to-red-500'
                : 'bg-gray-200'
              }
            `}>
              <Flame className={`w-8 h-8 ${streak.current_streak > 0 ? 'text-white' : 'text-gray-400'}`} />
            </div>
            <div>
              <div className={`text-3xl font-bold ${streak.current_streak > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                {streak.current_streak} {streak.current_streak === 1 ? 'Day' : 'Days'}
              </div>
              <div className="text-sm text-gray-500">{getMotivationalMessage()}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-5">
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

          {/* CTA */}
          <button
            onClick={handleClose}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
          >
            Let's Learn Today!
          </button>
        </div>
      </div>
    </div>
  );
}
