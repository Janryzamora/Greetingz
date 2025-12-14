# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Note down your project URL and API keys

URL: "https://nybsyypkbmjwgqapgope.supabase.co"
API: "sb_publishable_9Dfzuvlx7kTj6ODX1D1XtQ_Vs7WIJit"

## 2. Create Database Table

Run this SQL in the Supabase SQL Editor:

```sql
CREATE TABLE greetings (
  id TEXT PRIMARY KEY,
  recipient_name TEXT NOT NULL,
  greeting_type TEXT NOT NULL,
  custom_greeting TEXT,
  date_text TEXT,
  image_url TEXT NOT NULL,
  message_title TEXT NOT NULL,
  message_text TEXT NOT NULL,
  button_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster lookups
CREATE INDEX idx_greetings_created_at ON greetings(created_at);
```

## 3. Create Storage Bucket

1. Go to Storage in Supabase dashboard
2. Click "New bucket"
3. Name: `greeting-images`
4. Set to **Public**
5. Click "Create bucket"

## 4. Set Storage Policies

Run this SQL to allow public read access:

```sql
-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'greeting-images');

-- Allow authenticated uploads (or adjust as needed)
CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'greeting-images');
```

## 5. Get Your Credentials

From your Supabase project settings:
- **Project URL**: Found in Settings > API
- **Anon/Public Key**: Found in Settings > API (anon/public key)
- **Service Role Key**: Found in Settings > API (service_role key) - Keep this secret!

URL: "https://nybsyypkbmjwgqapgope.supabase.co"
Anon: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YnN5eXBrYm1qd2dxYXBnb3BlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MjI1MTgsImV4cCI6MjA4MTI5ODUxOH0.GSOUGsdbj08017MTW1ZBnV_cY1oKFp_0iLG2ERtq6Ms"
Role: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YnN5eXBrYm1qd2dxYXBnb3BlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTcyMjUxOCwiZXhwIjoyMDgxMjk4NTE4fQ.EMhTK748bH5wKjjSJxF6Dg_VGWw9ATaOibgtCxNYAx8"


## 6. Set Environment Variables in Vercel

Add these in Vercel dashboard or via CLI:

```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

Or in Vercel Dashboard:
1. Go to your project
2. Settings > Environment Variables
3. Add all three variables

## 7. Test Your Setup

After deployment, test:
1. Create a greeting card
2. Upload an image
3. Share the link
4. Verify it loads correctly

