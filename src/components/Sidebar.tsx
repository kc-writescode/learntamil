import { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen, MessageSquare, X, Check, Lock } from 'lucide-react';
import { Topic, WordPair, SentencePair, canDeleteTranslatedItem, getDeleteTimeRemaining } from '../types';

interface SidebarProps {
  topics: Topic[];
  selectedTopic: string | null;
  onSelectTopic: (topic: string) => void;
  onAddTopic: () => void;
  onDeleteTopic: (topicName: string) => void;
  activeTab: 'words' | 'sentences' | 'calendar';
  isOpen: boolean;
  onClose: () => void;
  words: WordPair[];
  sentences: SentencePair[];
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
  words,
  sentences,
}: SidebarProps) {
  const [, forceUpdate] = useState(0);

  // Re-render periodically to update delete button state for topics with recent translations
  useEffect(() => {
    const items = activeTab === 'words' ? words : sentences;
    const hasRecentTranslations = items.some(
      (item) => item.tamil?.trim() && getDeleteTimeRemaining(item.updated_at) > 0
    );

    if (hasRecentTranslations) {
      const interval = setInterval(() => forceUpdate((n) => n + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [words, sentences, activeTab]);

  // Check if a topic can be deleted (all translated items must be within 3-minute window)
  const canDeleteTopic = (topicName: string): boolean => {
    const items = activeTab === 'words'
      ? words.filter((w) => w.topic === topicName)
      : sentences.filter((s) => s.topic === topicName);

    // Check if any item has a translation older than 3 minutes
    const hasLockedItem = items.some(
      (item) => item.tamil?.trim() && !canDeleteTranslatedItem(item.updated_at)
    );

    return !hasLockedItem;
  };

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
                    : topic.isComplete
                    ? 'bg-green-50 border-2 border-transparent hover:bg-green-100'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
                onClick={() => handleTopicSelect(topic.name)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {activeTab === 'words' ? (
                    <BookOpen className={`w-4 h-4 flex-shrink-0 ${topic.isComplete ? 'text-green-600' : 'text-gray-500'}`} />
                  ) : (
                    <MessageSquare className={`w-4 h-4 flex-shrink-0 ${topic.isComplete ? 'text-green-600' : 'text-gray-500'}`} />
                  )}
                  <span className={`font-medium truncate ${topic.isComplete ? 'text-green-700' : 'text-gray-900'}`}>{topic.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {topic.isComplete ? (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white rounded-full">
                      <Check className="w-3 h-3" strokeWidth={3} />
                      <span className="text-xs font-medium">{topic.count}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      {topic.pendingCount > 0 && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                          {topic.pendingCount} pending
                        </span>
                      )}
                      <span className="text-sm text-gray-500">{topic.count}</span>
                    </div>
                  )}
                  {canDeleteTopic(topic.name) ? (
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
                  ) : (
                    <div
                      className="text-gray-300 cursor-not-allowed"
                      title="Topic contains translations older than 3 minutes"
                    >
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
