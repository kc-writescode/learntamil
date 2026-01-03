import { Plus, Trash2, BookOpen, MessageSquare } from 'lucide-react';
import { Topic } from '../types';

interface SidebarProps {
  topics: Topic[];
  selectedTopic: string | null;
  onSelectTopic: (topic: string) => void;
  onAddTopic: () => void;
  onDeleteTopic: (topicName: string) => void;
  activeTab: 'words' | 'sentences';
}

export default function Sidebar({
  topics,
  selectedTopic,
  onSelectTopic,
  onAddTopic,
  onDeleteTopic,
  activeTab,
}: SidebarProps) {
  return (
    <div className="w-96 bg-white border-r border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {activeTab === 'words' ? 'Word Topics' : 'Sentence Topics'}
        </h2>
        <button
          onClick={onAddTopic}
          className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          title="Add Topic"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
              selectedTopic === topic.name
                ? 'bg-indigo-50 border-2 border-indigo-600'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }`}
            onClick={() => onSelectTopic(topic.name)}
          >
            <div className="flex items-center gap-2">
              {activeTab === 'words' ? (
                <BookOpen className="w-4 h-4 text-gray-500" />
              ) : (
                <MessageSquare className="w-4 h-4 text-gray-500" />
              )}
              <span className="font-medium text-gray-900">{topic.name}</span>
            </div>
            <div className="flex items-center gap-2">
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
  );
}
