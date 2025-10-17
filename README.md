# resume-web

**Modern static web frontend for JSON-based resumes with advanced PDF export.**

This project renders a stunning, modern resume directly from a `cv.json` file with glassmorphism design, animated backgrounds, and interactive features.
It is designed to be hosted statically (e.g. via GitHub Pages, GitLab Pages, or AWS S3).

![example](example.png)

[Here](https://slauger.github.io/resume-web/) you can find an example, hosted on GitHub Pages.

---

## ✨ Features

### Core Features
- 📄 Load resume data from a single `cv.json`
- 🎨 **Modern glassmorphism design** with gradient backgrounds
- 🎯 **Interactive skill filter** - Click on skills to filter experience entries
- 📱 Fully responsive (Mobile, Tablet, Desktop)
- 🌓 Automatic dark mode support
- 🖨️ Professional PDF export (compact and detailed versions)
- 💾 Raw JSON download
- ♿ WCAG accessibility compliant

### Design Features
- ✨ Floating animated background shapes
- 🎭 Smooth hover animations and transitions
- 🌈 Beautiful gradient buttons and badges
- 💎 Glassmorphism cards with backdrop blur
- 📊 2-column grid layout on desktop
- 🎪 Interactive contact icons (SVG)

### Technical Features
- 🔒 XSS protection with URL sanitization
- ⚡ Zero dependencies - Pure vanilla JavaScript
- 🎯 JSON Schema validation
- 🧪 Testing setup with Vitest
- 📦 No build step required

---

## 📂 Project structure

```
html/
├── index.html       # Main entry point
├── styles.css       # Styling
├── script.js        # Data loading and rendering
├── cv.json          # Your resume data
└── profile.jpg      # Profile picture
```

---

## 🔧 How to use

1. Clone this repository:
   ```bash
   git clone https://github.com/<your-username>/resume-web.git
   cd resume-web
   ```

2. Replace `html/cv.json` and `html/profile.jpg` with your own data and image.

3. **Local development**:
   ```bash
   make serve
   # Or manually: cd html && python3 -m http.server 8000
   ```
   Then open http://localhost:8000

4. **Deploy** to:
   - **GitHub Pages**: Push to `main` and enable Pages in repo settings
   - **GitLab Pages**: Use a simple static site config
   - **S3/CloudFront**: Upload `html/` folder and enable static website hosting
   - **Netlify/Vercel**: Point to `html/` directory

5. **Validate your cv.json**:
   ```bash
   npm install
   npm run validate
   ```

---

## 🎯 Interactive Features

### Skill Filter
Click on any skill badge in the "Kernkompetenzen & Tech-Stack" section to filter the experience entries. Only projects using that skill will be displayed. Click again to reset the filter.

This feature is perfect for recruiters who want to see only relevant experience!

---

## 📝 JSON structure

Top-level fields in `cv.json`:

- `name`: Full name  
- `title`: Professional title (e.g. *Cloud Consultant*)  
- `image`: Path to profile picture  
- `contact`: Address, email, phone, web  
- `socialLinks`: List of `{ name, url }`  
- `description`: Short profile summary  
- `skills`: Array of strings (tags)  
- `languages`: Object `{ "English": { "level": 85, "label": "Fluent", "cefr": "C1" } }`  
- `interests`: Array of strings  
- `experience`: Array of experience objects  
- `education`: Array of education objects  
- `certificates`: Array of certificates  

---

## 📄 License

MIT – free to use, modify and share.
