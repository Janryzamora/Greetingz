# Deployment Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

Follow the instructions in `SUPABASE_SETUP.md` to:
- Create the database table
- Set up storage bucket
- Get your API keys

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Add environment variables in project settings:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy

### 4. Update API Routes

The API routes need to be updated with your Supabase credentials. Make sure:
- `api/create-greeting.js` uses the correct Supabase URL and keys
- `api/get-greeting.js` uses the correct Supabase URL and keys
- `api/upload-image.js` uses the correct Supabase URL and service role key

### 5. Test Your Deployment

1. Visit your Vercel URL
2. Create a greeting card
3. Upload an image
4. Share the link
5. Verify it works

## Troubleshooting

### Images not uploading?
- Check Supabase storage bucket is public
- Verify storage policies are set correctly
- Check service role key is correct

### Greetings not saving?
- Verify database table exists
- Check Supabase URL and anon key
- Check browser console for errors

### API routes not working?
- Verify environment variables are set in Vercel
- Check Vercel function logs
- Ensure Supabase client is initialized correctly

## Local Development

```bash
# Install dependencies
npm install

# Run local dev server
npm run dev

# Or use Vercel CLI
vercel dev
```

Make sure to create a `.env.local` file with your Supabase credentials for local development.

