# Next.js 14 Portfolio Setup

## Project created at: `e:\WebProj\porto-portfolio\`

### Files created:
- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration with static export
- `app/layout.jsx` - Root layout with Space Grotesk font
- `app/globals.css` - All CSS (identical to original)
- `app/page.jsx` - React component with language toggle & dark mode using useState/useEffect
- `public/WebTemplate/FirstTemplate/index.html` - First template
- `public/WebTemplate/PhotographyPortfolio/index.html` - Photography template
- `public/WebTemplate/PhotographyPortfolio/script.js` - Photography template scripts
- `public/WebTemplate/PhotographyPortfolio/styles.css` - Photography template styles

### Manual steps required:

1. **Copy image file:**
   ```
   Copy: e:\WebProj\Porto\Prop\haikal wr_no_bg.png
   To:   e:\WebProj\porto-portfolio\public\Prop\haikal wr_no_bg.png
   ```

2. **Install dependencies:**
   ```
   cd e:\WebProj\porto-portfolio
   npm install
   ```

3. **Run development server:**
   ```
   npm run dev
   ```
   Visit: http://localhost:3000

4. **Build for production:**
   ```
   npm run build
   npm start
   ```

### Features converted:
- ✓ HTML structure → React components in page.jsx
- ✓ CSS preserved identically in globals.css
- ✓ Language toggle (ID/EN) → useState hook
- ✓ Dark mode toggle → useState hook with localStorage
- ✓ Smooth scroll animations → useEffect with IntersectionObserver
- ✓ Contact form submission → event handler
- ✓ Project iframes pointing to `/public/WebTemplate/*`
- ✓ Space Grotesk font via next/font/google
- ✓ Static export configured for Vercel

### Tech Stack:
- Next.js 14 (App Router)
- React 18
- CSS (no external UI library)
