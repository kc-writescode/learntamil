import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, MessageSquare, Check } from 'lucide-react';
import { WordPair, SentencePair } from '../types';

interface CalendarProps {
  words: WordPair[];
  sentences: SentencePair[];
  onRefresh: () => void;
}

export default function Calendar({ words, sentences, onRefresh }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Get activity data for each day
  const activityByDate = useMemo(() => {
    const activity: Record<string, { words: WordPair[]; sentences: SentencePair[] }> = {};

    words.forEach(word => {
      if (word.updated_at && word.tamil?.trim()) {
        const date = word.updated_at.split('T')[0];
        if (!activity[date]) {
          activity[date] = { words: [], sentences: [] };
        }
        activity[date].words.push(word);
      }
    });

    sentences.forEach(sentence => {
      if (sentence.updated_at && sentence.tamil?.trim()) {
        const date = sentence.updated_at.split('T')[0];
        if (!activity[date]) {
          activity[date] = { words: [], sentences: [] };
        }
        activity[date].sentences.push(sentence);
      }
    });

    return activity;
  }, [words, sentences]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayNamesFull = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(today);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const formatDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getActivityForDate = (dateKey: string) => {
    return activityByDate[dateKey] || { words: [], sentences: [] };
  };

  const selectedActivity = selectedDate ? getActivityForDate(selectedDate) : null;

  // Generate calendar days
  const calendarDays: (number | null)[] = [];

  // Empty cells before first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Calculate totals for the month
  const monthStats = useMemo(() => {
    let totalWords = 0;
    let totalSentences = 0;
    let activeDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(day);
      const activity = getActivityForDate(dateKey);
      if (activity.words.length > 0 || activity.sentences.length > 0) {
        activeDays++;
        totalWords += activity.words.length;
        totalSentences += activity.sentences.length;
      }
    }

    return { totalWords, totalSentences, activeDays };
  }, [activityByDate, daysInMonth, month, year]);

  return (
    <div className="flex-1 p-3 md:p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-indigo-50/30">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-4 md:mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Learning Calendar</h2>
              <p className="text-gray-500 text-xs md:text-sm mt-0.5">Track your daily progress</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Month stats cards */}
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
              <div className="text-lg md:text-2xl font-bold text-green-600">{monthStats.totalWords}</div>
              <div className="text-xs text-gray-500">Words</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
              <div className="text-lg md:text-2xl font-bold text-blue-600">{monthStats.totalSentences}</div>
              <div className="text-xs text-gray-500">Sentences</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
              <div className="text-lg md:text-2xl font-bold text-indigo-600">{monthStats.activeDays}</div>
              <div className="text-xs text-gray-500">Active Days</div>
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden mb-4 md:mb-6">
          {/* Month navigation */}
          <div className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="text-center">
              <h3 className="text-lg md:text-xl font-bold text-white">
                {monthNames[month]} {year}
              </h3>
              <button
                onClick={goToToday}
                className="text-xs text-indigo-200 hover:text-white transition-colors"
              >
                Go to today
              </button>
            </div>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
            {dayNames.map((day, index) => (
              <div key={dayNamesFull[index]} className="py-2 md:py-3 text-center text-xs font-semibold text-gray-400 uppercase">
                <span className="md:hidden">{day}</span>
                <span className="hidden md:inline">{dayNamesFull[index]}</span>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-100 p-px">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square bg-gray-50/50" />;
              }

              const dateKey = formatDateKey(day);
              const activity = getActivityForDate(dateKey);
              const hasActivity = activity.words.length > 0 || activity.sentences.length > 0;
              const isToday = dateKey === today;
              const isSelected = dateKey === selectedDate;
              const isFuture = dateKey > today;
              const totalItems = activity.words.length + activity.sentences.length;

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                  disabled={isFuture}
                  className={`
                    aspect-square bg-white relative
                    flex flex-col items-center justify-center
                    transition-all duration-200
                    ${isFuture ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-indigo-50 cursor-pointer active:scale-95'}
                    ${isSelected ? 'bg-indigo-600 hover:bg-indigo-600 ring-2 ring-indigo-600 ring-offset-2' : ''}
                    ${isToday && !isSelected ? 'ring-2 ring-indigo-300 ring-inset' : ''}
                  `}
                >
                  <span className={`
                    text-sm md:text-base font-medium
                    ${isToday && !isSelected ? 'text-indigo-600 font-bold' : ''}
                    ${isSelected ? 'text-white font-bold' : ''}
                    ${isFuture ? 'text-gray-300' : ''}
                  `}>
                    {day}
                  </span>

                  {/* Activity indicator - Tick mark */}
                  {hasActivity && (
                    <div className={`
                      absolute bottom-1 md:bottom-1.5
                      w-4 h-4 md:w-5 md:h-5 rounded-full
                      flex items-center justify-center
                      ${isSelected ? 'bg-white' : 'bg-green-500'}
                      shadow-sm
                    `}>
                      <Check className={`w-2.5 h-2.5 md:w-3 md:h-3 ${isSelected ? 'text-indigo-600' : 'text-white'}`} strokeWidth={3} />
                    </div>
                  )}

                  {/* Item count badge */}
                  {hasActivity && totalItems > 1 && (
                    <div className={`
                      absolute top-0.5 right-0.5 md:top-1 md:right-1
                      min-w-[16px] h-4 px-1
                      text-[10px] font-bold rounded-full
                      flex items-center justify-center
                      ${isSelected ? 'bg-white text-indigo-600' : 'bg-indigo-100 text-indigo-600'}
                    `}>
                      {totalItems}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 md:gap-6 p-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </div>
              <span>Learned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                5
              </div>
              <span>Item count</span>
            </div>
          </div>
        </div>

        {/* Selected day details */}
        {selectedDate && selectedActivity && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
              <h3 className="font-bold text-white">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <p className="text-indigo-200 text-sm mt-1">
                {selectedActivity.words.length} {selectedActivity.words.length === 1 ? 'word' : 'words'} • {' '}
                {selectedActivity.sentences.length} {selectedActivity.sentences.length === 1 ? 'sentence' : 'sentences'}
              </p>
            </div>

            {selectedActivity.words.length === 0 && selectedActivity.sentences.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No learning activity</p>
                <p className="text-gray-400 text-sm mt-1">Start learning to see your progress here!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {/* Words section */}
                {selectedActivity.words.length > 0 && (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Words Learned</h4>
                      <span className="ml-auto text-sm text-gray-400">{selectedActivity.words.length}</span>
                    </div>
                    <div className="space-y-2">
                      {selectedActivity.words.map(word => (
                        <div key={word.id} className="flex flex-col p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-medium text-gray-900">{word.english}</span>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{word.topic}</span>
                          </div>
                          <span className="text-green-700 text-sm mt-1">{word.tamil}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sentences section */}
                {selectedActivity.sentences.length > 0 && (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Sentences Learned</h4>
                      <span className="ml-auto text-sm text-gray-400">{selectedActivity.sentences.length}</span>
                    </div>
                    <div className="space-y-2">
                      {selectedActivity.sentences.map(sentence => (
                        <div key={sentence.id} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-medium text-gray-900">{sentence.english}</span>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{sentence.topic}</span>
                          </div>
                          <span className="text-blue-700 text-sm mt-1 block">{sentence.tamil}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* No date selected message */}
        {!selectedDate && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-gray-600 font-medium">Tap a date to see activity</p>
            <p className="text-gray-400 text-sm mt-1">Days with a checkmark have learning progress</p>
          </div>
        )}
      </div>
    </div>
  );
}
