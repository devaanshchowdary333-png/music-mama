# 🎵 Music Mama v2 — Setup Guide

## Project Structure
```
music-mama-v2/
├── index.html           ← Homepage
├── css/style.css        ← All styles
├── js/firebase.js       ← Firebase config + helpers
├── pages/
│   └── telugu.html      ← Telugu songs page
├── admin/
│   └── index.html       ← Admin panel (no login)
└── firestore.rules      ← Paste into Firebase Console
```

## Firebase Setup (2 services only)

### 1. Firestore Database
- Firebase Console → Build → Firestore → Create database → Production mode
- Go to Rules tab → paste the firestore.rules content → Publish

### 2. Storage
- Firebase Console → Build → Storage → Get started
- Go to Rules tab → paste the storage.rules content → Publish

### 3. Get your config
- Project Settings → General → Your Apps → Web → Copy firebaseConfig
- Paste into `js/firebase.js` replacing YOUR_API_KEY etc.

## How to Add Music

1. Open `/admin/` in your browser
2. **Add Movie** tab → type movie name, select year → Save
   (or click a quick-add chip from the known movies list)
3. **Upload Songs** tab → select the movie → pick MP3 files → Upload
4. Songs appear instantly on the Telugu page with Download buttons

## How Users Download
- Homepage → Telugu → find movie → click to expand → Download button per song
- Each Download button links directly to the Firebase Storage file
