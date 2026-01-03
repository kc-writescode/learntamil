import { useState } from 'react';
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react';
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTamil, setEditTamil] = useState('');

  const handleAdd = () => {
    if (newEnglish.trim()) {
      onAddWord(newEnglish.trim(), newTamil.trim());
      setNewEnglish('');
      setNewTamil('');
      setShowAddForm(false);
    }
  };

  const handleEdit = (id: string) => {
    if (editTamil.trim() !== undefined) {
      onUpdateWord(id, editTamil.trim());
      setEditingId(null);
      setEditTamil('');
    }
  };

  const startEdit = (word: WordPair) => {
    setEditingId(word.id);
    setEditTamil(word.tamil);
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{topicName}</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Word
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Add English words and their Tamil translations
        </p>

        {showAddForm && (
          <div className="bg-indigo-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  English Word
                </label>
                <input
                  type="text"
                  value={newEnglish}
                  onChange={(e) => setNewEnglish(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Appa"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Word
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewEnglish('');
                  setNewTamil('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
            <div>English</div>
            <div>Tamil (தமிழ்)</div>
            <div>Actions</div>
          </div>

          {words.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No words added yet. Click "Add Word" to get started.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {words.map((word) => (
                <div
                  key={word.id}
                  className="grid grid-cols-3 gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{word.english}</div>
                  <div>
                    {editingId === word.id ? (
                      <input
                        type="text"
                        value={editTamil}
                        onChange={(e) => setEditTamil(e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        autoFocus
                      />
                    ) : (
                      <span className="text-gray-700">
                        {word.tamil || (
                          <span className="text-gray-400 italic">Not translated yet</span>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingId === word.id ? (
                      <>
                        <button
                          onClick={() => handleEdit(word.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditTamil('');
                          }}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(word)}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteWord(word.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
