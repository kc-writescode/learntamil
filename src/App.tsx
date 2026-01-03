import { useState, useEffect } from 'react';
import { BookOpen, MessageSquare } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WordList from './components/WordList';
import SentenceList from './components/SentenceList';
import { WordPair, SentencePair, Topic } from './types';
import { supabase, TABLES } from './lib/supabase';
import { defaultWords, defaultSentences, wordTopics, sentenceTopics } from './data/defaultData';

function App() {
  const [activeTab, setActiveTab] = useState<'words' | 'sentences'>('words');
  const [words, setWords] = useState<WordPair[]>([]);
  const [sentences, setSentences] = useState<SentencePair[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize data from Supabase or use defaults
  useEffect(() => {
    initializeData();
  }, []);

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

  // Get topics with counts
  const getTopics = (type: 'words' | 'sentences'): Topic[] => {
    const items = type === 'words' ? words : sentences;
    const topicsList = type === 'words' ? wordTopics : sentenceTopics;

    return topicsList.map((topicName) => ({
      id: topicName,
      name: topicName,
      count: items.filter((item) => item.topic === topicName).length,
      type,
    }));
  };

  // Word operations
  const handleAddWord = async (english: string, tamil: string) => {
    if (!selectedTopic) return;

    const newWord: WordPair = {
      id: crypto.randomUUID(),
      english,
      tamil,
      topic: selectedTopic,
    };

    setWords([...words, newWord]);

    // Sync to Supabase
    try {
      await supabase.from(TABLES.WORDS).insert([newWord]);
    } catch (error) {
      console.error('Error adding word to Supabase:', error);
    }
  };

  const handleUpdateWord = async (id: string, tamil: string) => {
    setWords(words.map((word) => (word.id === id ? { ...word, tamil } : word)));

    // Sync to Supabase
    try {
      await supabase.from(TABLES.WORDS).update({ tamil }).eq('id', id);
    } catch (error) {
      console.error('Error updating word in Supabase:', error);
    }
  };

  const handleDeleteWord = async (id: string) => {
    setWords(words.filter((word) => word.id !== id));

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

    const newSentence: SentencePair = {
      id: crypto.randomUUID(),
      english,
      tamil,
      topic: selectedTopic,
    };

    setSentences([...sentences, newSentence]);

    // Sync to Supabase
    try {
      await supabase.from(TABLES.SENTENCES).insert([newSentence]);
    } catch (error) {
      console.error('Error adding sentence to Supabase:', error);
    }
  };

  const handleUpdateSentence = async (id: string, tamil: string) => {
    setSentences(
      sentences.map((sentence) => (sentence.id === id ? { ...sentence, tamil } : sentence))
    );

    // Sync to Supabase
    try {
      await supabase.from(TABLES.SENTENCES).update({ tamil }).eq('id', id);
    } catch (error) {
      console.error('Error updating sentence in Supabase:', error);
    }
  };

  const handleDeleteSentence = async (id: string) => {
    setSentences(sentences.filter((sentence) => sentence.id !== id));

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

  const topics = getTopics(activeTab);

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
      <Header />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab('words');
              setSelectedTopic(null);
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'words'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Words
          </button>
          <button
            onClick={() => {
              setActiveTab('sentences');
              setSelectedTopic(null);
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'sentences'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Sentences
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          topics={topics}
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
          onAddTopic={handleAddTopic}
          onDeleteTopic={handleDeleteTopic}
          activeTab={activeTab}
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
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a topic to get started
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
