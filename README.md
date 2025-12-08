# TripPortier Website

Official website for TripPortier - Your Smart Travel Companion.

## Deployment to GitHub Pages

### Option 1: Deploy as a separate repository (Recommended)

1. Create a new GitHub repository named `tripportier.github.io` (or any name)

2. Push this website folder to the repository:
   ```bash
   cd website
   git init
   git add .
   git commit -m "Initial website commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/tripportier-website.git
   git push -u origin main
   ```

3. Go to repository Settings > Pages

4. Under "Source", select "Deploy from a branch"

5. Select `main` branch and `/ (root)` folder

6. Click Save

### Option 2: Use GitHub Actions (For custom domain)

The website is already configured for the custom domain `tripportier.com` via the CNAME file.

### DNS Configuration (Kreativmedia)

Configure these DNS records in your Kreativmedia domain settings:

| Type  | Name | Value                      |
|-------|------|----------------------------|
| A     | @    | 185.199.108.153           |
| A     | @    | 185.199.109.153           |
| A     | @    | 185.199.110.153           |
| A     | @    | 185.199.111.153           |
| CNAME | www  | YOUR_USERNAME.github.io   |

Replace `YOUR_USERNAME` with your GitHub username.

## File Structure

```
website/
├── index.html           # Homepage
├── privacy.html         # Privacy Policy
├── terms.html           # Terms of Service
├── faq.html            # FAQ page
├── feature-request.html # Feature requests & voting
├── 404.html            # Custom 404 page
├── CNAME               # Custom domain config
├── robots.txt          # SEO robots file
├── sitemap.xml         # SEO sitemap
├── .nojekyll           # Disable Jekyll processing
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── main.js         # JavaScript functionality
└── assets/
    └── images/
        ├── logo.png         # App logo (add your own)
        ├── favicon.png      # Favicon (add your own)
        └── app-screenshot.png # App screenshot (add your own)
```

## Required Images

Add these images to `assets/images/`:

1. **logo.png** - Your app logo (recommended: 80x80px)
2. **favicon.png** - Browser favicon (recommended: 32x32px)
3. **app-screenshot.png** - iPhone app screenshot for hero section

## Customization

### WhatsApp Number
The WhatsApp contact button uses `+41765125678`. To change it, search and replace in all HTML files.

### App Store Link
Update the App Store link in all HTML files once your app is published:
```html
href="https://apps.apple.com/app/tripportier"
```

### Colors
Main colors are defined in `css/style.css`:
```css
:root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --secondary: #06b6d4;
    --accent: #f59e0b;
}
```

## Feature Requests Backend

The feature request voting currently uses localStorage. For production, consider:
- Firebase Firestore
- Supabase
- Your own backend API

## License

Copyright 2024 TripPortier. All rights reserved.
