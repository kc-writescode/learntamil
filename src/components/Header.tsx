import { Languages } from 'lucide-react';
import StreakBadge from './StreakBadge';
import { StreakData } from '../types';

interface HeaderProps {
  streak: StreakData;
}

export default function Header({ streak }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Languages className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">Learn Tamil by Deni Akka</h1>
            <p className="text-xs md:text-sm text-gray-600 hidden sm:block">English to Tamil Language Learning</p>
          </div>
        </div>

        {/* Streak badge - compact on mobile */}
        <div className="flex-shrink-0">
          <StreakBadge streak={streak} compact />
        </div>
      </div>
    </header>
  );
}
