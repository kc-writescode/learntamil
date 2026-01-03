import { WordPair, SentencePair } from '../types';

export const defaultWords: Omit<WordPair, 'id' | 'created_at' | 'updated_at'>[] = [
  // Greetings
  { english: 'Hello', tamil: '', topic: 'Greetings' },
  { english: 'Good Morning', tamil: '', topic: 'Greetings' },
  { english: 'Good Night', tamil: '', topic: 'Greetings' },
  { english: 'Thank you', tamil: '', topic: 'Greetings' },
  { english: 'Welcome', tamil: '', topic: 'Greetings' },
  { english: 'Goodbye', tamil: '', topic: 'Greetings' },
  { english: 'Please', tamil: '', topic: 'Greetings' },
  { english: 'Sorry', tamil: '', topic: 'Greetings' },

  // Numbers
  { english: 'One', tamil: '', topic: 'Numbers' },
  { english: 'Two', tamil: '', topic: 'Numbers' },
  { english: 'Three', tamil: '', topic: 'Numbers' },
  { english: 'Four', tamil: '', topic: 'Numbers' },
  { english: 'Five', tamil: '', topic: 'Numbers' },
  { english: 'Six', tamil: '', topic: 'Numbers' },
  { english: 'Seven', tamil: '', topic: 'Numbers' },
  { english: 'Eight', tamil: '', topic: 'Numbers' },
  { english: 'Nine', tamil: '', topic: 'Numbers' },
  { english: 'Ten', tamil: '', topic: 'Numbers' },

  // Fruits
  { english: 'Apple', tamil: '', topic: 'Fruits' },
  { english: 'Banana', tamil: '', topic: 'Fruits' },
  { english: 'Mango', tamil: '', topic: 'Fruits' },
  { english: 'Orange', tamil: '', topic: 'Fruits' },
  { english: 'Grapes', tamil: '', topic: 'Fruits' },
  { english: 'Watermelon', tamil: '', topic: 'Fruits' },
  { english: 'Pineapple', tamil: '', topic: 'Fruits' },

  // Fillers
  { english: 'Yes', tamil: '', topic: 'Fillers' },
  { english: 'No', tamil: '', topic: 'Fillers' },
  { english: 'Maybe', tamil: '', topic: 'Fillers' },
  { english: 'Okay', tamil: '', topic: 'Fillers' },
  { english: 'What', tamil: '', topic: 'Fillers' },
  { english: 'Where', tamil: '', topic: 'Fillers' },
  { english: 'When', tamil: '', topic: 'Fillers' },
  { english: 'Why', tamil: '', topic: 'Fillers' },
  { english: 'How', tamil: '', topic: 'Fillers' },

  // Relations
  { english: 'Mother', tamil: '', topic: 'Relations' },
  { english: 'Father', tamil: '', topic: 'Relations' },
  { english: 'Sister', tamil: '', topic: 'Relations' },
  { english: 'Brother', tamil: '', topic: 'Relations' },
  { english: 'Grandmother', tamil: '', topic: 'Relations' },
  { english: 'Grandfather', tamil: '', topic: 'Relations' },
  { english: 'Uncle', tamil: '', topic: 'Relations' },
  { english: 'Aunt', tamil: '', topic: 'Relations' },
  { english: 'Son', tamil: '', topic: 'Relations' },
  { english: 'Daughter', tamil: '', topic: 'Relations' },

  // Colors
  { english: 'Red', tamil: '', topic: 'Colors' },
  { english: 'Blue', tamil: '', topic: 'Colors' },
  { english: 'Green', tamil: '', topic: 'Colors' },
  { english: 'Yellow', tamil: '', topic: 'Colors' },
  { english: 'White', tamil: '', topic: 'Colors' },
  { english: 'Black', tamil: '', topic: 'Colors' },

  // Days
  { english: 'Monday', tamil: '', topic: 'Days' },
  { english: 'Tuesday', tamil: '', topic: 'Days' },
  { english: 'Wednesday', tamil: '', topic: 'Days' },
  { english: 'Thursday', tamil: '', topic: 'Days' },
  { english: 'Friday', tamil: '', topic: 'Days' },
  { english: 'Saturday', tamil: '', topic: 'Days' },
  { english: 'Sunday', tamil: '', topic: 'Days' },

  // Body Parts
  { english: 'Head', tamil: '', topic: 'Body Parts' },
  { english: 'Eye', tamil: '', topic: 'Body Parts' },
  { english: 'Nose', tamil: '', topic: 'Body Parts' },
  { english: 'Mouth', tamil: '', topic: 'Body Parts' },
  { english: 'Hand', tamil: '', topic: 'Body Parts' },
  { english: 'Leg', tamil: '', topic: 'Body Parts' },
];

export const defaultSentences: Omit<SentencePair, 'id' | 'created_at' | 'updated_at'>[] = [
  // Basic Conversation
  { english: 'How are you?', tamil: '', topic: 'Basic Conversation' },
  { english: 'I am fine', tamil: '', topic: 'Basic Conversation' },
  { english: 'What is your name?', tamil: '', topic: 'Basic Conversation' },
  { english: 'My name is...', tamil: '', topic: 'Basic Conversation' },
  { english: 'Nice to meet you', tamil: '', topic: 'Basic Conversation' },
  { english: 'Where are you from?', tamil: '', topic: 'Basic Conversation' },
  { english: 'How old are you?', tamil: '', topic: 'Basic Conversation' },
  { english: 'Do you speak English?', tamil: '', topic: 'Basic Conversation' },

  // Daily Activities
  { english: 'I am going to school', tamil: '', topic: 'Daily Activities' },
  { english: 'I am eating food', tamil: '', topic: 'Daily Activities' },
  { english: 'I am drinking water', tamil: '', topic: 'Daily Activities' },
  { english: 'I am sleeping', tamil: '', topic: 'Daily Activities' },
  { english: 'I am studying', tamil: '', topic: 'Daily Activities' },
  { english: 'I am working', tamil: '', topic: 'Daily Activities' },

  // Questions
  { english: 'Where is the bathroom?', tamil: '', topic: 'Questions' },
  { english: 'How much does this cost?', tamil: '', topic: 'Questions' },
  { english: 'What time is it?', tamil: '', topic: 'Questions' },
  { english: 'Can you help me?', tamil: '', topic: 'Questions' },
  { english: 'Do you understand?', tamil: '', topic: 'Questions' },

  // Feelings
  { english: 'I am happy', tamil: '', topic: 'Feelings' },
  { english: 'I am sad', tamil: '', topic: 'Feelings' },
  { english: 'I am tired', tamil: '', topic: 'Feelings' },
  { english: 'I am hungry', tamil: '', topic: 'Feelings' },
  { english: 'I am thirsty', tamil: '', topic: 'Feelings' },
];

export const wordTopics = [
  'Greetings',
  'Numbers',
  'Fruits',
  'Fillers',
  'Relations',
  'Colors',
  'Days',
  'Body Parts',
];

export const sentenceTopics = [
  'Basic Conversation',
  'Daily Activities',
  'Questions',
  'Feelings',
];
