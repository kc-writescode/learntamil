import { useState, useRef } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { WordPair } from '../types';

interface WordListProps {
  words: WordPair[];
  topicName: string;
  onAddWord: (english: string, tamil: string) => void;
  onUpdateWord: (id: string, tamil: string) => void;
  onDeleteWord: (id: string) => void;
}

export default function WordList({
  words,
  topicName,
  onAddWord,
  onUpdateWord,
  onDeleteWord,
}: WordListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEnglish, setNewEnglish] = useState('');
  const [newTamil, setNewTamil] = useState('');
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleAdd = () => {
    if (newEnglish.trim()) {
      onAddWord(newEnglish.trim(), newTamil.trim());
      setNewEnglish('');
      setNewTamil('');
      setShowAddForm(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const getDisplayValue = (word: WordPair) => {
    return localValues[word.id] !== undefined ? localValues[word.id] : word.tamil;
  };

  const handleInputChange = (id: string, value: string) => {
    setLocalValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = (word: WordPair) => {
    const newValue = localValues[word.id];
    if (newValue !== undefined && newValue !== word.tamil) {
      onUpdateWord(word.id, newValue);
    }
    // Clear local state after save
    setLocalValues(prev => {
      const next = { ...prev };
      delete next[word.id];
      return next;
    });
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{topicName}</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Word
          </button>
        </div>

        <p className="text-gray-600 mb-4 text-sm">
          Type the Tamil translation and press Enter to save
        </p>

        {showAddForm && (
          <div className="bg-indigo-50 rounded-lg p-4 md:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  English Word
                </label>
                <input
                  type="text"
                  value={newEnglish}
                  onChange={(e) => setNewEnglish(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleAdd)}
                  className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-base"
                  placeholder="Father"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamil Translation
                </label>
                <input
                  type="text"
                  value={newTamil}
                  onChange={(e) => setNewTamil(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleAdd)}
                  className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-base"
                  placeholder="Appa"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleAdd}
                className="px-4 py-3 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
              >
                Add Word
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewEnglish('');
                  setNewTamil('');
                }}
                className="px-4 py-3 md:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {words.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            No words added yet. Click "Add Word" to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {words.map((word) => (
              <div
                key={word.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {/* English word - prominent display */}
                    <div className="font-semibold text-gray-900 text-lg mb-3">
                      {word.english}
                    </div>

                    {/* Tamil input - always editable */}
                    <div className="relative">
                      <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Tamil Translation
                      </label>
                      <input
                        ref={(el) => { inputRefs.current[word.id] = el; }}
                        type="text"
                        value={getDisplayValue(word)}
                        onChange={(e) => handleInputChange(word.id, e.target.value)}
                        onBlur={() => handleSave(word)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSave(word);
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white outline-none text-base transition-colors"
                        placeholder="Type Tamil translation..."
                      />
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteWord(word.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 mt-1"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
