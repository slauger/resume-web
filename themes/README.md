# Resume Themes

This directory contains pre-defined color themes for your resume. You can use these themes by copying one of them to `html/custom.css`, or create your own custom theme.

## 🎨 Available Themes

### Professional Themes

#### `professional-blue`
Clean, corporate blue color scheme perfect for traditional industries.
- Primary: Professional blue (#2563eb)
- Secondary: Dark slate (#0f172a)
- Background: Light gray (#f8fafc)

![Professional Blue Theme](https://slauger.github.io/resume-web/screenshot-professional-blue.png)

#### `corporate-green`
Professional green color scheme with an eco-friendly vibe.
- Primary: Emerald green (#059669)
- Secondary: Dark green (#064e3b)
- Background: Light green tint (#f0fdf4)

![Corporate Green Theme](https://slauger.github.io/resume-web/screenshot-corporate-green.png)

#### `elegant-purple`
Sophisticated purple color scheme for creative professionals.
- Primary: Vivid purple (#9333ea)
- Secondary: Dark indigo (#1e1b4b)
- Background: Light purple (#faf5ff)

![Elegant Purple Theme](https://slauger.github.io/resume-web/screenshot-elegant-purple.png)

#### `dark-mode`
True dark theme with orange accents - easy on the eyes.
- Primary: Orange accent (#f97316)
- Secondary: Light text (#f8fafc)
- Background: Dark slate (#0f172a)

![Dark Mode Theme](https://slauger.github.io/resume-web/screenshot-dark-mode.png)

### Retro & Fun Themes

#### `frnz-retro`
Inspired by constellation7.org - Purple space vibes with neon colors for maximum 90s nostalgia.
- Primary: Hot magenta (#ff00ff)
- Secondary: Cyan text (#00ffff)
- Background: Deep purple (#1a0033)
- **Bonus**: Animated gradient background, neon glow effects, vibrant badges

![FRNZ Retro Theme](https://slauger.github.io/resume-web/screenshot-frnz-retro.png)

#### `geocities-hell` ⚠️
**WARNING: Eye cancer ahead!**

Maximum 90s Geocities vibes with blinking text, rainbow backgrounds, and under construction energy.
- Animated rainbow background
- Blinking headings
- Wobbling cards
- Pulsating badges
- "UNDER CONSTRUCTION" banner

*Use at your own risk. May cause temporary blindness.*

![Geocities Hell Theme](https://slauger.github.io/resume-web/screenshot-geocities-hell.png)

#### `comic-sans-nightmare` ⚠️
**WARNING: May cause psychological damage!**

Everything wrong with web design, circa 2001. Comic Sans, WordArt, glitter backgrounds, and spinning avatars.
- Comic Sans font for EVERYTHING
- Rainbow WordArt-style headings
- Glitter background animation
- Spinning avatar
- Bouncing cards
- Crazy rotating badges

*Not recommended for actual job applications. Or anything, really.*

![Comic Sans Nightmare Theme](https://slauger.github.io/resume-web/screenshot-comic-sans-nightmare.png)

## 🚀 How to Use

### Option 1: Use a Pre-defined Theme (Easiest)

Copy the theme to `html/custom.css`:

```bash
cp themes/professional-blue.css html/custom.css
```

### Option 2: Create Your Own Custom Theme

Create `html/custom.css` with your own colors. You can base it on any theme here - just copy and modify!

```css
/* My custom theme */
:root {
  --color-primary: #your-color;
  --color-secondary: #your-color;
  --color-background: #your-color;
}
```

## 🎨 Creating Your Own Theme

The color system is based on three primary CSS variables:

```css
:root {
  --color-primary: #f97316;      /* Main accent color */
  --color-secondary: #0f172a;    /* Text color */
  --color-background: #f8fafc;   /* Page background */
}
```

All other colors (badges, buttons, borders, hover states) are automatically derived from these three base colors using CSS `color-mix()`.

### Advanced Customization

You can also add animations, effects, and custom styles. See `frnz-retro.css`, `geocities-hell.css`, or `comic-sans-nightmare.css` for examples of advanced theming.

## 📸 Theme Preview

Want to see how a theme looks before committing?

1. Copy the theme file to `html/custom.css` locally
2. Run `make serve` (or `cd html && python3 -m http.server 8000`)
3. Open http://localhost:8000

## 🤝 Contributing Themes

Have a cool theme to share? PRs welcome! Just add your `.css` file to this directory and update this README.

---

**Pro tip**: Start with a professional theme for your actual resume, but keep `geocities-hell.css` handy for April Fools' Day. 😉
