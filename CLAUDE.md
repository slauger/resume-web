# CLAUDE.md — Project Documentation (resume-web)

This document summarizes the complete project history, architecture, design decisions, and implementation details of the **resume-web** project. It serves as a knowledge base for future development and maintenance.

---

## 📋 Project Overview

**resume-web** is a static web application for displaying a resume based on a structured JSON format (`cv.json`). The project was originally developed with ChatGPT and enhanced by Claude Code with modern design and extended features. Optimized for static hosting (GitHub Pages, GitLab Pages, S3).

### Core Features

- ✅ Load resume data from a single `cv.json` file
- ✅ **Modern light design** with orange accents
- ✅ **Interactive skill filter** - Click on skills to filter experience entries
- ✅ Glassmorphism design with subtle animations
- ✅ 2-column bento-box layout (desktop)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Language skills with animated progress bars and CEFR levels
- ✅ PDF export in two modes: **compact** (collapsed) and **detailed** (expanded)
- ✅ JSON download function for raw data
- ✅ No external dependencies, no build steps required
- ✅ XSS protection through URL sanitization
- ✅ JSON schema validation with AJV
- ✅ Testing setup with Vitest

### Live Demo

🔗 [https://slauger.github.io/resume-web/](https://slauger.github.io/resume-web/)

---

## 🗂️ Project Structure

```
resume-web/
├── .github/
│   └── workflows/
│       └── static.yml          # GitHub Pages deployment
├── html/
│   ├── index.html              # Main HTML (minimalist)
│   ├── app.js                  # Rendering logic
│   ├── styles.css              # Styling (incl. print CSS)
│   ├── cv.json                 # Sample resume data
│   ├── profile.jpg             # Profile picture
│   ├── favicon.ico             # Favicon
│   └── robots.txt              # Robots file
├── Makefile                    # Build and server commands
├── README.md                   # Project README (English)
├── CLAUDE.md                   # This file
└── example.png                 # Screenshot for README
```

---

## 🏗️ Architecture

### Technology Stack

- **Vanilla JavaScript** (ES6+) - No frameworks
- **CSS3** with CSS variables
- **HTML5** with semantic tags
- **Python HTTP server** for local development

### Design Principles

1. **Zero Dependencies** - No npm, no build tools
2. **Static-First** - Works anywhere static HTML can be hosted
3. **Security** - No loading of external URLs, HTML escaping for XSS protection
4. **Print-Optimized** - Special print stylesheet for professional PDFs
5. **Progressive Enhancement** - Works even without JavaScript (basic HTML)

---

## 📊 Data Model (cv.json)

### Top-Level Structure

```json
{
  "name": "Full Name",
  "title": "Professional Title",
  "image": "profile.jpg",
  "contact": {
    "address": "Street Nr., ZIP City, Country",
    "email": "email@example.com",
    "phone": "+49 ...",
    "web": {
      "url": "https://example.com",
      "title": "Website"
    }
  },
  "socialLinks": [
    { "name": "GitHub", "url": "https://github.com/..." },
    { "name": "LinkedIn", "url": "https://linkedin.com/in/..." }
  ],
  "description": "Brief profile summary",
  "skills": ["Skill1", "Skill2", "..."],
  "languages": {
    "German": { "level": 100, "label": "Native", "cefr": "C2" },
    "English": { "level": 85, "label": "Fluent", "cefr": "C1" }
  },
  "interests": ["Interest1", "Interest2"],
  "experience": [...],
  "education": [...],
  "certificates": [...]
}
```

### Experience Objects

Each entry in `experience` follows this schema:

```json
{
  "title": "Project or position title (5-7 words)",
  "company": "Company/Client",
  "location": "City/Region",
  "role": "Your role (e.g., Cloud Consultant)",
  "type": "self_employed | permanent | contract | staffing",
  "period": {
    "start": "YYYY-MM",
    "end": "YYYY-MM"  // or null for "present"
  },
  "skills": ["Tag1", "Tag2"],
  "description": "One-line project summary",
  "details": ["Bullet Point 1", "Bullet Point 2"]
}
```

**Important Conventions:**
- `type` is a **string**, not an object
- `period.end = null` is rendered as "present"
- `description` is a **one-liner summary**
- `details` is a **bullet-point array** for detailed information
- Field order: `title, company, location, role, type, period, skills, description, details`

### Education Objects

```json
{
  "degree": "Degree or training",
  "school": "Institution",
  "location": "City",
  "period": { "start": "YYYY-MM", "end": "YYYY-MM" },
  "description": "Optional brief description",
  "details": ["Detail 1", "Detail 2"]
}
```

### Certificate Objects

```json
{
  "title": "Certificate name",
  "description": "Optional",
  "date": "YYYY-MM",
  "url": "https://..." // or null
}
```

---

## 🎨 UI/UX Details

### Design System

**Color Palette (lauger.de inspired):**
- Primary Orange: `#ff5722`
- Orange Light: `#ff7043`
- Orange Dark: `#e64a19`
- Background: `#f5f5f5` → `#e8e8e8` (gradient)
- Text: `#2a2a2a`, `#555`, `#666`

**Design Features:**
- Glassmorphism cards with `backdrop-filter: blur(10px)`
- Subtle floating shapes in background (opacity 0.15)
- Orange accents for borders, buttons, and active elements
- Smooth transitions (0.2s ease)
- Box-shadows for depth

### Header Section
- Profile picture (round, 110×110px with orange border and glow)
- Name with orange gradient
- Title, brief description
- Action buttons with orange background: "PDF compact", "PDF detailed", "JSON"
- White hero section with subtle orange radial gradients

### Contact Section
- Grid layout: Label | Value with SVG icons
- Email and phone as clickable links
- **Web and social links are hidden in print**
- Social links inline without bullet points

### Skills (with interactive filter!)
- Flat array as orange badges (no category system)
- **Clickable** - Clicking on a skill shows only relevant experience entries
- Active badge: Bright orange with glow effect
- Hover: Lift effect with shadow
- Project-specific skills are also rendered as badges

### Languages
- Progress bars with orange gradient and uniform alignment
- Orange badges for label ("Native") and CEFR ("C2")
- In print: Bars hidden, text only
- **Layout:** Languages and Interests side-by-side in 2-column grid

### Experience
- Collapsible `<details>` elements with light backgrounds
- Summary line: **Title** + meta info (Company · Period)
- Content: 3-line key-value grid (Role, Employment Type, Location)
- Skills badges above description (clickable for filter)
- Details as unordered list
- Sorted by date (newest first)
- Hover: Orange border

### Education & Certificates
- Similar structure to experience
- Certificates with optional link (orange on hover)

---

## 🖨️ Print/PDF Rules

### Two Modes

1. **Compact** - All `<details>` are collapsed, then `window.print()`
2. **Detailed** - All `<details>` are expanded, then `window.print()`

### Print CSS (`@media print`)

```css
@media print {
  details, .card { break-inside: avoid; }
  .badge { background: #fff; border: 1px solid #000; color: #000; }
  .actions { display: none !important; }
  .progress { display: none !important; }
  .contact-web, .contact-social { display: none !important; }
  .cefr { display: none !important; }
  .two-col-grid { grid-template-columns: 1fr 1fr !important; }
}
```

**Important:**
- Action buttons are hidden
- Web & social links are hidden
- Badges get black border (instead of colored background)
- Text becomes black for better readability
- Page breaks within cards are avoided
- Languages and Interests remain side-by-side in print

---

## 💻 Implementation

### index.html (html/index.html:1-64)

Minimalist HTML with:
- Header with avatar, name, title, summary
- Action buttons
- Container `<div id="cv"></div>` for dynamic content
- Inclusion of `app.js` (defer)

### app.js (html/app.js:1-302)

**Main Functions:**

1. **`escapeHtml(str)`** - HTML escaping for XSS protection
2. **`formatPeriod(period)`** - Formats `{start, end}` to "MM/YYYY – present"
3. **`renderHeader(data)`** - Renders contact section
4. **`renderSkills(skills)`** - Renders skills as badges
5. **`renderLanguages(langs)`** - Renders languages with progress bars
6. **`renderInterests(list)`** - Renders interests as badges
7. **`renderExperience(items)`** - Renders experience entries as `<details>`
8. **`renderEducation(items)`** - Renders education entries
9. **`renderCertificates(items)`** - Renders certificates
10. **`attachControls()`** - Event handlers for print/download buttons
11. **`filterExperienceBySkill(skill)`** - Filters experience by clicked skill
12. **`attachSkillFilter()`** - Attaches click handlers to skill badges
13. **`renderAll(data)`** - Orchestrates rendering of all sections
14. **`boot()`** - Loads `cv.json` and initializes rendering

**Security:**
- All user inputs are escaped via `escapeHtml()`
- `fetch('cv.json', {cache: 'no-store'})` prevents caching issues
- No external URLs are loaded

**Layout:**
- Skills section gets full width
- Languages and Interests are wrapped in `<div class="two-col-grid">` for side-by-side layout

### styles.css (html/styles.css:1-600+)

**CSS Variables:**
```css
:root {
  --fg: #000;
  --muted: #666;
  --bg: #fdfdfd;
  --card: #fff;
  --border: #ddd;
  --radius: 14px;
  --accent: #ff5722;
  --lang-col: 260px;
}
```

**Important Classes:**
- `.hero` - Header with gradient background
- `.card` - Card layout with border and shadow
- `.badge` - Skills/interests badges
- `.lang-row` - Languages grid layout
- `.kv` - Key-value grid for experience details
- `.contact-grid` - Contact grid layout
- `.two-col-grid` - 2-column grid for languages/interests (50/50 split)
- `.cefr` - CEFR level badges (orange: `#ff5722`)

**Responsive:**
- `.two-col-grid` collapses to single column on mobile (< 768px)

---

## 🚀 Deployment

### GitHub Pages

The project is prepared for GitHub Pages with:
- Workflow: `.github/workflows/static.yml`
- Deployment of `html/` directory
- Automatic deployment on push to `main`

### Local Development

```bash
# With Makefile (recommended)
make serve          # Starts server on port 8000
make serve PORT=3000  # Starts server on port 3000

# Or manually
cd html
python3 -m http.server 8000
```

Then open `http://localhost:8000`

---

## 🔧 Development History

### Git Log

```
4aa3caf - docs: add link to github pages (6 weeks ago)
8b42493 - docs: add link to github pages (6 weeks ago)
39b8484 - Create static.yml (6 weeks ago)
024393f - initial commit (6 weeks ago)
```

### Important Decisions

1. **No external JSON loading** - Originally planned, but removed for security reasons
2. **Flat skills array** - Originally with categories, but simplified for better overview
3. **`title` instead of `profession`** - Field renaming for clearer semantics
4. **`description` instead of `profile`** - Field renaming for consistency
5. **`period` as object** - Enables flexible date logic (null = "present")
6. **Type as string** - Simpler than nested objects
7. **orange color scheme** - Orange instead of blue/purple for unified branding
8. **Light theme** - Switched from dark to light design (friendlier)
9. **Interactive skill filter** - Main feature for recruiter-friendliness
10. **Side-by-side languages/interests** - Better space utilization, no empty blocks

### Claude Code Enhancements (October 2025)

**Phase 1: Basic Modernization**
- Makefile for `make serve`
- Experience sorting by date
- Dark mode support
- Loading spinner with animation
- More demo data (Karl Klamauk)
- XSS protection with URL sanitization
- Meta tags for SEO/social
- Accessibility (ARIA labels)
- Testing setup (package.json, JSON schema, Vitest)

**Phase 2: Design Evolution**
- Iteration 1: Glassmorphism + gradient backgrounds
- Iteration 2: Floating shapes + 2-column grid
- Iteration 3: Ultra-modern with neon effects
- Iteration 4: Orange color scheme
- Iteration 5: Light, friendly theme

**Phase 3: Interactive Features**
- Skill filter (click-to-filter)
- SVG icons for contact
- Dynamic PDF filenames
- Animated progress bars
- Responsive bento-box grid

**Phase 4: Layout Optimization**
- CEFR badges in orange (instead of gray)
- Skills section full-width
- Languages and Interests side-by-side (2-column grid)
- Print-optimized 2-column layout

### Known Pitfalls

**From ChatGPT Development:**
1. **"s is not defined"** - `escapeHtml()` helper must be defined before use
2. **White buttons** - Force `color: #111 !important` in `.btn`
3. **Language bars not aligned** - Fixed-width first column in grid
4. **CEFR wrapping** - `white-space: nowrap` for badges
5. **Social links with bullets** - Ensure `.contact-social` is flex
6. **Print shows too much** - Explicit `display: none !important` rules
7. **Cache issues** - `cache: 'no-store'` in fetch and hard-refresh

**From Claude Development:**
8. **Loading spinner stays visible** - `hidden` class + `display:none !important` needed
9. **Dark mode override** - `@media (prefers-color-scheme: dark)` overrides colors
10. **Browser cache** - Always hard-refresh (Ctrl+Shift+R) after CSS changes
11. **Blue links in print** - Explicitly set orange in print CSS
12. **Shimmer too intrusive** - Subtle animations (opacity 0.15) better than strong ones
13. **CEFR badges gray** - Set `.cefr` color to orange (`#ff5722`) in regular view

---

## 📝 Best Practices for Content

### Title & Description Rules (from ChatGPT Development)

**Goal:** Concise, recruiter-friendly titles (~5-7 words)

**Rules:**
- Derive title and description **only from the respective project**
- **No mixing** of skills from other projects
- **No anachronisms** (don't use technologies that didn't exist at the time)
- **Unique titles** - No duplicates
- For permanent positions: **Keep title**, only optimize description

**Good Examples:**
- "Migration from Puppet to OpenVox"
- "Introduction of CI/CD with Tekton & ArgoCD"
- "Platform setup in Open Telekom Cloud"

**Anti-Patterns:**
- ❌ Generic sentences like "Implementation and development of cloud solutions"
- ❌ Inferring technologies not in the entry
- ❌ Adding suffix to title to avoid duplicates

### Skills Recommendations

- Keep skills consistent across all projects
- Use established technology names (e.g., "Kubernetes" instead of "K8s")
- No overly broad skills ("Cloud" → better: "AWS", "Azure", "GCP")

---

## 🎯 Sample Data

The project contains humorous sample data of a fictional clown "Karl Klamauk" as a demo. The data shows:
- Self-ironic description
- Tech puns (CI/CD = "Clown In/Clown Out", Docker = "Bucket")
- Complete use of all features (skills, languages, certificates, etc.)

**See:** `html/cv.json`

---

## 🔮 Future Ideas

### Potential Features
- [ ] Executive summary section
- [x] Icons for contact/skills (SVG icons implemented)
- [ ] Human-readable date formatting ("Dec 2024 – present")
- [x] Better page-break control in print (completely redesigned)
- [ ] CLI tool for JSON validation and sorting
- [x] Dark mode support (implemented, but currently light theme preferred)
- [ ] Multilingual support (i18n for UI texts)
- [x] Interactive features (skill filter implemented)
- [ ] More filter options (by company, time period, etc.)
- [ ] Timeline visualization for experience
- [ ] Export formats (Markdown, PDF via browser)

### Testing
- [x] JSON schema validation (implemented with AJV)
- [x] Testing setup (Vitest, package.json)
- [ ] Browser tests with Playwright/Cypress
- [ ] JavaScript unit tests
- [ ] HTML/CSS validation
- [ ] Accessibility tests (a11y)

---

## 🛠️ Maintenance

### When Changing Code

1. **Test locally** with `make serve`
2. **Validate** JSON structure against schema
3. **Test print modes** (compact & detailed)
4. **Test responsive** design (mobile, tablet, desktop)
5. **Check browsers** (Chrome, Firefox, Safari)

### When Changing Data Model

1. Update this documentation
2. Update sample data (`cv.json`)
3. Update rendering functions in `app.js`
4. Test backwards compatibility

---

## 📚 References

- **GitHub Repo:** [github.com/slauger/resume-web](https://github.com/slauger/resume-web)
- **Live Demo:** [slauger.github.io/resume-web](https://slauger.github.io/resume-web/)
- **Original ChatGPT Session:** See commit history (September 2024)

---

## ✅ Checklist for New Developers

- [ ] Repository cloned
- [ ] `make serve` works
- [ ] Local changes to `cv.json` are rendered correctly
- [ ] Print modes tested (compact & detailed)
- [ ] This documentation read
- [ ] Code structure understood (index.html → app.js → styles.css)

---

**Last Updated:** 2025-10-17
**Design:** Light, friendly theme with glassmorphism
