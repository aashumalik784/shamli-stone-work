# Shamli Stone Work Website

Premium quality stone and tile work website with admin panel for photo management.

## Features

- 🖼️ Dynamic photo gallery with 12 categories
- 🔐 Secure admin panel for photo uploads
- 📱 Fully responsive design
- ⚡ Fast loading with lazy loading
- 🎨 Modern UI/UX design

## Categories

1. Tiles Work
2. Stone
3. Simple Stones
4. Wall Tiles
5. Floor Tiles
6. Step Riser
7. Model Kitchen
8. Model Almari
9. Model Wash Basin
10. Front Tiles
11. Ramp
12. Pillar Design

## Setup Instructions

### 1. Supabase Setup

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run SQL queries to create tables
4. Create storage bucket named "photos" (public)
5. Copy your Supabase URL and anon key

### 2. Configuration

Edit `supabase.js` file:
```javascript
const SUPABASE_URL = 'your-supabase-url';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### 3. Deployment

#### GitHub + Cloudflare Pages

1. Push code to GitHub
2. Connect repository to Cloudflare Pages
3. Deploy (no build command needed)

## Admin Access

- Login URL: `/login.html`
- Default credentials: Check Supabase Authentication

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Supabase (Backend & Storage)
- Cloudflare Pages (Hosting)

## License

© 2026 Shamli Stone Work. All Rights Reserved.
