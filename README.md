# Learn Tamil - Interactive Language Learning WebApp

An interactive language learning web application for learning Tamil from English. This app allows users to learn vocabulary and sentences with pre-populated essential words and phrases, add custom translations, and share them with other learners through a Supabase backend.

![Learn Tamil](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.0.8-purple) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-cyan)

## Features

- **Word Topics**: Pre-populated with essential vocabulary categories
  - Greetings, Numbers, Fruits, Fillers, Relations, Colors, Days, Body Parts

- **Sentence Topics**: Common phrases organized by category
  - Basic Conversation, Daily Activities, Questions, Feelings

- **Interactive Learning**
  - View English words/sentences with Tamil translations
  - Add your own translations
  - Edit existing translations
  - Delete words/sentences
  - Create custom topics

- **Supabase Integration**
  - Real-time data synchronization
  - Share translations with other users
  - Persistent storage across sessions

- **Modern UI**
  - Clean, intuitive interface
  - Responsive design
  - Tab-based navigation between Words and Sentences
  - Topic-based organization

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account (optional, app works locally without it)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kc-writescode/learntamil.git
cd learntamil
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up Supabase:
   - See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions
   - Copy `.env.example` to `.env` and add your Supabase credentials
   - The app will work locally without Supabase, but data won't be shared

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

## Usage

### Learning Words

1. Click on the "Words" tab
2. Select a topic from the sidebar (e.g., "Greetings", "Numbers")
3. View the English words and add Tamil translations
4. Click the edit icon to modify translations
5. Click the "Add Word" button to add new words to the topic

### Learning Sentences

1. Click on the "Sentences" tab
2. Select a topic from the sidebar (e.g., "Basic Conversation")
3. View the English sentences and add Tamil translations
4. Edit or delete sentences as needed
5. Add new sentences with the "Add Sentence" button

### Creating Custom Topics

1. Click the "+" button in the sidebar
2. Enter a name for your new topic
3. Start adding words or sentences to your custom topic

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
learntamil/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx      # App header with logo
│   │   ├── Sidebar.tsx     # Topic list sidebar
│   │   ├── WordList.tsx    # Word management component
│   │   └── SentenceList.tsx # Sentence management component
│   ├── data/
│   │   └── defaultData.ts  # Pre-populated words and sentences
│   ├── lib/
│   │   └── supabase.ts     # Supabase client configuration
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   ├── types.ts            # TypeScript type definitions
│   └── index.css           # Global styles
├── public/                  # Static assets
├── SUPABASE_SETUP.md       # Supabase setup instructions
└── package.json            # Dependencies and scripts
```

## Pre-populated Content

The app comes with essential vocabulary and phrases for learning Tamil:

**Word Topics** (70+ words):
- Greetings (Hello, Thank you, Sorry, etc.)
- Numbers (One through Ten)
- Fruits (Apple, Mango, Banana, etc.)
- Fillers (Yes, No, What, Where, etc.)
- Relations (Mother, Father, Sister, etc.)
- Colors (Red, Blue, Green, etc.)
- Days (Monday through Sunday)
- Body Parts (Head, Eye, Hand, etc.)

**Sentence Topics** (25+ sentences):
- Basic Conversation (How are you? What is your name?)
- Daily Activities (I am eating, I am studying)
- Questions (Where is the bathroom? How much?)
- Feelings (I am happy, I am tired)

## Supabase Setup (Optional)

For data persistence and sharing translations with other users, you'll need to set up Supabase. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete instructions.

The app will work perfectly fine without Supabase, storing data locally in memory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning purposes.

## Acknowledgments

- Built with React, TypeScript, and Tailwind CSS
- Icons by Lucide React
- Backend powered by Supabase