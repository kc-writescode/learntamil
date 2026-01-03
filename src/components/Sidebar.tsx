import { Plus, Trash2, BookOpen, MessageSquare, X } from 'lucide-react';
import { Topic, StreakData } from '../types';
import StreakBadge from './StreakBadge';

interface SidebarProps {
  topics: Topic[];
  selectedTopic: string | null;
  onSelectTopic: (topic: string) => void;
  onAddTopic: () => void;
  onDeleteTopic: (topicName: string) => void;
  activeTab: 'words' | 'sentences' | 'calendar';
  isOpen: boolean;
  onClose: () => void;
  streak: StreakData;
}

export default function Sidebar({
  topics,
  selectedTopic,
  onSelectTopic,
  onAddTopic,
  onDeleteTopic,
  activeTab,
  isOpen,
  onClose,
  streak,
}: SidebarProps) {
  const handleTopicSelect = (topicName: string) => {
    onSelectTopic(topicName);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-50
          w-72 md:w-64 lg:w-80
          bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}
      >
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab === 'words' ? 'Word Topics' : 'Sentence Topics'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={onAddTopic}
                className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                title="Add Topic"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg md:hidden"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-2">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedTopic === topic.name
                    ? 'bg-indigo-50 border-2 border-indigo-600'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
                onClick={() => handleTopicSelect(topic.name)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {activeTab === 'words' ? (
                    <BookOpen className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  ) : (
                    <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  )}
                  <span className="font-medium text-gray-900 truncate">{topic.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm text-gray-500">{topic.count}</span>
                  {topic.count === 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTopic(topic.name);
                      }}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Topic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak section at bottom */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <StreakBadge streak={streak} />
        </div>
      </div>
    </>
  );
}
