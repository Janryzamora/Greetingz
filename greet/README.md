# Greet - Digital Greeting Cards Website

A beautiful web application for creating and sharing personalized digital greeting cards. Built with HTML, CSS, JavaScript, Supabase, and deployed on Vercel.

## Features

- 🎨 **Beautiful Templates**: Choose from pre-designed templates for birthdays, anniversaries, and more
- ✏️ **Customizable**: Edit names, images, messages, and more
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- 🔗 **Easy Sharing**: Generate unique URLs to share your greetings
- 🖼️ **Image Upload**: Upload custom images via Supabase Storage
- ⚡ **Fast**: Built with modern web technologies

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [Supabase](https://supabase.com)
2. Create a table called `greetings` with the following schema:

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
```

3. Create a storage bucket called `greeting-images`:
   - Go to Storage in Supabase dashboard
   - Create a new bucket named `greeting-images`
   - Set it to public

4. Get your Supabase credentials:
   - Project URL (SUPABASE_URL)
   - Anon/Public Key (SUPABASE_ANON_KEY)
   - Service Role Key (SUPABASE_SERVICE_ROLE_KEY)

### 2. Vercel Setup

1. Install Vercel CLI (if not already installed):
```bash
npm i -g vercel
```

2. Set environment variables in Vercel:
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

Or set them in the Vercel dashboard:
- Go to your project settings
- Navigate to Environment Variables
- Add the three variables above

3. Deploy to Vercel:
```bash
vercel
```

### 3. Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. Run development server:
```bash
npm run dev
```

## Project Structure

```
greet/
├── index.html          # Landing page
├── create.html          # Create/Edit page
├── view.html           # View greeting page
├── templates.html      # Templates page
├── api/                # Vercel serverless functions
│   ├── create-greeting.js
│   ├── get-greeting.js
│   └── upload-image.js
├── styles/             # CSS files
│   ├── landing.css
│   ├── create.css
│   └── view.css
├── js/                 # JavaScript files
│   ├── create.js
│   └── view.js
├── assets/             # Images and assets
│   └── images/
├── package.json
├── vercel.json
└── README.md
```

## Usage

1. **Create a Greeting**:
   - Visit the landing page
   - Click "Create Your Greeting"
   - Fill in the form with recipient details
   - Upload an image or use a URL
   - Click "Save & Get Link"

2. **Share Your Greeting**:
   - After saving, you'll get a unique URL
   - Share this URL with anyone
   - They can view the greeting card

3. **View a Greeting**:
   - Open the shared URL
   - The greeting card will display with animations
   - Click the button to see the full message

## Customization

- **Templates**: Add more templates in `templates.html`
- **Styles**: Modify CSS files in `styles/` directory
- **Functionality**: Update JavaScript files in `js/` directory

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Supabase (Database & Storage)
- Vercel (Hosting & Serverless Functions)
- Font Awesome (Icons)
- Google Fonts (Typography)

## License

MIT License - feel free to use this project for your own purposes!

## Support

For issues or questions, please open an issue on the repository.

