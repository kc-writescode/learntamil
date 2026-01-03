import { useState, useEffect, useCallback } from 'react';
import { BookOpen, MessageSquare, Menu, CalendarDays } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WordList from './components/WordList';
import SentenceList from './components/SentenceList';
import Calendar from './components/Calendar';
import { WordPair, SentencePair, Topic, StreakData } from './types';
import { supabase, TABLES } from './lib/supabase';
import { defaultWords, defaultSentences, wordTopics, sentenceTopics } from './data/defaultData';

const STREAK_STORAGE_KEY = 'learntamil_streak';

function App() {
  const [activeTab, setActiveTab] = useState<'words' | 'sentences' | 'calendar'>('words');
  const [words, setWords] = useState<WordPair[]>([]);
  const [sentences, setSentences] = useState<SentencePair[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streak, setStreak] = useState<StreakData>({
    current_streak: 0,
    longest_streak: 0,
    last_activity_date: '',
    total_words_learned: 0,
    total_sentences_learned: 0,
  });

  // Load streak from localStorage or Supabase
  const loadStreak = useCallback(async () => {
    try {
      // Try Supabase first
      const { data } = await supabase
        .from(TABLES.STREAKS)
        .select('*')
        .limit(1)
        .single();

      if (data) {
        setStreak(data);
        return;
      }
    } catch {
      // Fall back to localStorage
    }

    // Load from localStorage
    const stored = localStorage.getItem(STREAK_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStreak(parsed);
      } catch {
        // Invalid stored data, use defaults
      }
    }
  }, []);

  // Save streak to localStorage and optionally Supabase
  const saveStreak = useCallback(async (newStreak: StreakData) => {
    setStreak(newStreak);
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newStreak));

    try {
      if (newStreak.id) {
        await supabase
          .from(TABLES.STREAKS)
          .update(newStreak)
          .eq('id', newStreak.id);
      } else {
        const { data } = await supabase
          .from(TABLES.STREAKS)
          .insert([newStreak])
          .select()
          .single();
        if (data) {
          setStreak(data);
          localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
        }
      }
    } catch {
      // Supabase save failed, localStorage is our backup
    }
  }, []);

  // Check and update streak based on date
  const checkAndUpdateStreak = useCallback((currentStreak: StreakData): StreakData => {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = currentStreak.last_activity_date;

    if (!lastDate) {
      return currentStreak;
    }

    const lastActivity = new Date(lastDate);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastActivity.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      // Streak broken - more than 1 day gap
      return {
        ...currentStreak,
        current_streak: 0,
      };
    }

    return currentStreak;
  }, []);

  // Update learned count (increment or decrement)
  const updateLearnedCount = useCallback((type: 'word' | 'sentence', delta: number) => {
    const today = new Date().toISOString().split('T')[0];

    setStreak(currentStreak => {
      const checkedStreak = checkAndUpdateStreak(currentStreak);
      const lastDate = checkedStreak.last_activity_date;

      let newCurrentStreak = checkedStreak.current_streak;

      // Only update streak days when adding (not removing)
      if (delta > 0 && lastDate !== today) {
        // First activity of the day
        if (lastDate) {
          const lastActivity = new Date(lastDate);
          const todayDate = new Date(today);
          const diffTime = todayDate.getTime() - lastActivity.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            // Consecutive day
            newCurrentStreak = checkedStreak.current_streak + 1;
          } else if (diffDays > 1) {
            // Streak broken
            newCurrentStreak = 1;
          }
        } else {
          // First ever activity
          newCurrentStreak = 1;
        }
      }

      const newWordsCount = Math.max(0, checkedStreak.total_words_learned + (type === 'word' ? delta : 0));
      const newSentencesCount = Math.max(0, checkedStreak.total_sentences_learned + (type === 'sentence' ? delta : 0));

      const newStreak: StreakData = {
        ...checkedStreak,
        current_streak: newCurrentStreak,
        longest_streak: Math.max(checkedStreak.longest_streak, newCurrentStreak),
        last_activity_date: delta > 0 ? today : checkedStreak.last_activity_date,
        total_words_learned: newWordsCount,
        total_sentences_learned: newSentencesCount,
      };

      // Save async
      saveStreak(newStreak);

      return newStreak;
    });
  }, [checkAndUpdateStreak, saveStreak]);

  // Initialize data from Supabase or use defaults
  useEffect(() => {
    initializeData();
    loadStreak();
  }, [loadStreak]);

  // Check streak on load (might have expired)
  useEffect(() => {
    if (streak.last_activity_date) {
      const checked = checkAndUpdateStreak(streak);
      if (checked.current_streak !== streak.current_streak) {
        saveStreak(checked);
      }
    }
  }, [streak.last_activity_date, checkAndUpdateStreak, saveStreak, streak]);

  const initializeData = async () => {
    try {
      // Try to fetch from Supabase
      const { data: wordsData } = await supabase
        .from(TABLES.WORDS)
        .select('*');

      const { data: sentencesData } = await supabase
        .from(TABLES.SENTENCES)
        .select('*');

      if (wordsData && wordsData.length > 0) {
        setWords(wordsData);
      } else {
        // Use default data and sync to Supabase if available
        const defaultWordsWithIds = defaultWords.map((word) => ({
          ...word,
          id: crypto.randomUUID(),
        }));
        setWords(defaultWordsWithIds);

        // Try to insert into Supabase
        if (supabase) {
          await supabase.from(TABLES.WORDS).insert(defaultWordsWithIds);
        }
      }

      if (sentencesData && sentencesData.length > 0) {
        setSentences(sentencesData);
      } else {
        const defaultSentencesWithIds = defaultSentences.map((sentence) => ({
          ...sentence,
          id: crypto.randomUUID(),
        }));
        setSentences(defaultSentencesWithIds);

        if (supabase) {
          await supabase.from(TABLES.SENTENCES).insert(defaultSentencesWithIds);
        }
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      // Fall back to local state with default data
      const defaultWordsWithIds = defaultWords.map((word) => ({
        ...word,
        id: crypto.randomUUID(),
      }));
      setWords(defaultWordsWithIds);

      const defaultSentencesWithIds = defaultSentences.map((sentence) => ({
        ...sentence,
        id: crypto.randomUUID(),
      }));
      setSentences(defaultSentencesWithIds);
    } finally {
      setLoading(false);
    }
  };

  // Get topics with counts and pending translations
  const getTopics = (type: 'words' | 'sentences'): Topic[] => {
    const items = type === 'words' ? words : sentences;
    const topicsList = type === 'words' ? wordTopics : sentenceTopics;

    const topicsWithCounts = topicsList.map((topicName) => {
      const topicItems = items.filter((item) => item.topic === topicName);
      const pendingCount = topicItems.filter((item) => !item.tamil?.trim()).length;
      const isComplete = topicItems.length > 0 && pendingCount === 0;

      return {
        id: topicName,
        name: topicName,
        count: topicItems.length,
        pendingCount,
        isComplete,
        type,
      };
    });

    // Sort: incomplete topics first, then completed topics
    return topicsWithCounts.sort((a, b) => {
      if (a.isComplete === b.isComplete) return 0;
      return a.isComplete ? 1 : -1;
    });
  };

  // Word operations
  const handleAddWord = async (english: string, tamil: string) => {
    if (!selectedTopic) return;

    const now = new Date().toISOString();
    const newWord: WordPair = {
      id: crypto.randomUUID(),
      english,
      tamil,
      topic: selectedTopic,
      created_at: now,
      updated_at: tamil.trim() ? now : undefined,
    };

    setWords([...words, newWord]);

    // Only count if Tamil translation is provided
    if (tamil.trim()) {
      updateLearnedCount('word', 1);
    }

    // Sync to Supabase
    try {
      await supabase.from(TABLES.WORDS).insert([newWord]);
    } catch (error) {
      console.error('Error adding word to Supabase:', error);
    }
  };

  const handleUpdateWord = async (id: string, tamil: string) => {
    const word = words.find(w => w.id === id);
    const hadTranslation = !!word?.tamil?.trim();
    const hasTranslation = !!tamil.trim();
    const now = new Date().toISOString();

    setWords(words.map((w) => (w.id === id ? { ...w, tamil, updated_at: now } : w)));

    // Update count based on translation change
    if (hasTranslation && !hadTranslation) {
      // Added a translation
      updateLearnedCount('word', 1);
    } else if (!hasTranslation && hadTranslation) {
      // Removed a translation
      updateLearnedCount('word', -1);
    }

    // Sync to Supabase
    try {
      await supabase.from(TABLES.WORDS).update({ tamil, updated_at: now }).eq('id', id);
    } catch (error) {
      console.error('Error updating word in Supabase:', error);
    }
  };

  const handleDeleteWord = async (id: string) => {
    const word = words.find(w => w.id === id);
    const hadTranslation = !!word?.tamil?.trim();

    setWords(words.filter((w) => w.id !== id));

    // Decrease count if the deleted word had a translation
    if (hadTranslation) {
      updateLearnedCount('word', -1);
    }

    // Sync to Supabase
    try {
      await supabase.from(TABLES.WORDS).delete().eq('id', id);
    } catch (error) {
      console.error('Error deleting word from Supabase:', error);
    }
  };

  // Sentence operations
  const handleAddSentence = async (english: string, tamil: string) => {
    if (!selectedTopic) return;

    const now = new Date().toISOString();
    const newSentence: SentencePair = {
      id: crypto.randomUUID(),
      english,
      tamil,
      topic: selectedTopic,
      created_at: now,
      updated_at: tamil.trim() ? now : undefined,
    };

    setSentences([...sentences, newSentence]);

    // Only count if Tamil translation is provided
    if (tamil.trim()) {
      updateLearnedCount('sentence', 1);
    }

    // Sync to Supabase
    try {
      await supabase.from(TABLES.SENTENCES).insert([newSentence]);
    } catch (error) {
      console.error('Error adding sentence to Supabase:', error);
    }
  };

  const handleUpdateSentence = async (id: string, tamil: string) => {
    const sentence = sentences.find(s => s.id === id);
    const hadTranslation = !!sentence?.tamil?.trim();
    const hasTranslation = !!tamil.trim();
    const now = new Date().toISOString();

    setSentences(
      sentences.map((s) => (s.id === id ? { ...s, tamil, updated_at: now } : s))
    );

    // Update count based on translation change
    if (hasTranslation && !hadTranslation) {
      // Added a translation
      updateLearnedCount('sentence', 1);
    } else if (!hasTranslation && hadTranslation) {
      // Removed a translation
      updateLearnedCount('sentence', -1);
    }

    // Sync to Supabase
    try {
      await supabase.from(TABLES.SENTENCES).update({ tamil, updated_at: now }).eq('id', id);
    } catch (error) {
      console.error('Error updating sentence in Supabase:', error);
    }
  };

  const handleDeleteSentence = async (id: string) => {
    const sentence = sentences.find(s => s.id === id);
    const hadTranslation = !!sentence?.tamil?.trim();

    setSentences(sentences.filter((s) => s.id !== id));

    // Decrease count if the deleted sentence had a translation
    if (hadTranslation) {
      updateLearnedCount('sentence', -1);
    }

    // Sync to Supabase
    try {
      await supabase.from(TABLES.SENTENCES).delete().eq('id', id);
    } catch (error) {
      console.error('Error deleting sentence from Supabase:', error);
    }
  };

  // Topic operations
  const handleAddTopic = () => {
    const topicName = prompt(
      `Enter new ${activeTab === 'words' ? 'word' : 'sentence'} topic name:`
    );
    if (topicName && topicName.trim()) {
      // Topics are created automatically when first item is added
      setSelectedTopic(topicName.trim());
    }
  };

  const handleDeleteTopic = (topicName: string) => {
    if (confirm(`Are you sure you want to delete the "${topicName}" topic?`)) {
      if (activeTab === 'words') {
        setWords(words.filter((word) => word.topic !== topicName));
      } else {
        setSentences(sentences.filter((sentence) => sentence.topic !== topicName));
      }
    }
  };

  // Get current items based on active tab and selected topic
  const currentWords = selectedTopic
    ? words.filter((word) => word.topic === selectedTopic)
    : [];

  const currentSentences = selectedTopic
    ? sentences.filter((sentence) => sentence.topic === selectedTopic)
    : [];

  const topics = activeTab === 'calendar' ? [] : getTopics(activeTab);

  // Auto-select first topic if none selected
  useEffect(() => {
    if (!selectedTopic && topics.length > 0) {
      setSelectedTopic(topics[0].name);
    }
  }, [topics, selectedTopic]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header streak={streak} />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6">
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
            title="Open topics"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setActiveTab('words');
              setSelectedTopic(null);
            }}
            className={`flex items-center gap-2 px-3 md:px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'words'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Words</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('sentences');
              setSelectedTopic(null);
            }}
            className={`flex items-center gap-2 px-3 md:px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'sentences'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Sentences</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('calendar');
            }}
            className={`flex items-center gap-2 px-3 md:px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'calendar'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'calendar' ? (
          <Calendar
            words={words}
            sentences={sentences}
            onRefresh={initializeData}
          />
        ) : (
          <>
            <Sidebar
              topics={topics}
              selectedTopic={selectedTopic}
              onSelectTopic={setSelectedTopic}
              onAddTopic={handleAddTopic}
              onDeleteTopic={handleDeleteTopic}
              activeTab={activeTab}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            {selectedTopic ? (
              activeTab === 'words' ? (
                <WordList
                  words={currentWords}
                  topicName={selectedTopic}
                  onAddWord={handleAddWord}
                  onUpdateWord={handleUpdateWord}
                  onDeleteWord={handleDeleteWord}
                />
              ) : (
                <SentenceList
                  sentences={currentSentences}
                  topicName={selectedTopic}
                  onAddSentence={handleAddSentence}
                  onUpdateSentence={handleUpdateSentence}
                  onDeleteSentence={handleDeleteSentence}
                />
              )
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 p-4 text-center">
                <span className="md:hidden">Tap the menu to select a topic</span>
                <span className="hidden md:inline">Select a topic to get started</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
