# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned

## 2. Create Database Tables

Run these SQL commands in the Supabase SQL Editor:

```sql
-- Create words table
CREATE TABLE words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  english TEXT NOT NULL,
  tamil TEXT NOT NULL DEFAULT '',
  topic TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create sentences table
CREATE TABLE sentences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  english TEXT NOT NULL,
  tamil TEXT NOT NULL DEFAULT '',
  topic TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentences ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (for learning purposes)
CREATE POLICY "Enable read access for all users" ON words FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON words FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON words FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON words FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON sentences FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON sentences FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON sentences FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON sentences FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_words_topic ON words(topic);
CREATE INDEX idx_sentences_topic ON sentences(topic);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_words_updated_at BEFORE UPDATE ON words
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sentences_updated_at BEFORE UPDATE ON sentences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 3. Get Your Credentials

1. Go to Project Settings > API
2. Copy the Project URL and anon/public key
3. Create a `.env` file in the project root
4. Add your credentials:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 4. Run the Application

```bash
npm install
npm run dev
```
