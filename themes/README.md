# Resume Themes

This directory contains pre-defined color themes for your resume. You can use these themes by setting the `THEME` environment variable in your deployment workflow, or create your own custom theme.

## 🎨 Available Themes

### Professional Themes

#### `professional-blue`
Clean, corporate blue color scheme perfect for traditional industries.
- Primary: Professional blue (#2563eb)
- Secondary: Dark slate (#0f172a)
- Background: Light gray (#f8fafc)

#### `corporate-green`
Professional green color scheme with an eco-friendly vibe.
- Primary: Emerald green (#059669)
- Secondary: Dark green (#064e3b)
- Background: Light green tint (#f0fdf4)

#### `elegant-purple`
Sophisticated purple color scheme for creative professionals.
- Primary: Vivid purple (#9333ea)
- Secondary: Dark indigo (#1e1b4b)
- Background: Light purple (#faf5ff)

#### `dark-mode`
True dark theme with orange accents - easy on the eyes.
- Primary: Orange accent (#f97316)
- Secondary: Light text (#f8fafc)
- Background: Dark slate (#0f172a)

### Retro & Fun Themes

#### `frnz-retro`
Inspired by constellation7.org - Purple space vibes with neon colors for maximum 90s nostalgia.
- Primary: Hot magenta (#ff00ff)
- Secondary: Cyan text (#00ffff)
- Background: Deep purple (#1a0033)
- **Bonus**: Animated gradient background, neon glow effects, vibrant badges

#### `geocities-hell` ⚠️
**WARNING: Eye cancer ahead!**

Maximum 90s Geocities vibes with blinking text, rainbow backgrounds, and under construction energy.
- Animated rainbow background
- Blinking headings
- Wobbling cards
- Pulsating badges
- "UNDER CONSTRUCTION" banner

*Use at your own risk. May cause temporary blindness.*

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

## 🚀 How to Use

### Option 1: Use a Pre-defined Theme (Easiest)

In your fork's `.github/workflows/deploy.yml`, set the `THEME` environment variable:

```yaml
env:
  UPSTREAM_REF: 'main'
  THEME: 'professional-blue'  # Choose any theme from above
```

### Option 2: Create Your Own Custom Theme (Recommended)

This approach keeps your fork merge-able when upstream changes come in:

1. Create `themes/custom.css` in your fork:
   ```css
   /* My custom theme */
   :root {
     --color-primary: #your-color;
     --color-secondary: #your-color;
     --color-background: #your-color;
   }
   ```

2. The workflow automatically detects and uses `themes/custom.css`

3. You can base it on any theme here - just copy and modify!

### Option 3: Direct Override

Place `custom.css` directly in `html/` directory (will override THEME variable).

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
