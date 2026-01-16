/**
 * Screenshot Generator für resume-web
 *
 * Erstellt automatische Screenshots der Webseite für die README.
 * Generiert Screenshots für alle Themes und Dark Mode.
 * Wird in GitHub Actions während des Deployments ausgeführt.
 */

import { chromium } from 'playwright';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const THEMES_DIR = 'themes';
const HTML_DIR = 'html';
const SCREENSHOT_WIDTH = 1400;
const SCREENSHOT_HEIGHT = 900;

// Liste aller verfügbaren Themes
const themes = readdirSync(THEMES_DIR)
  .filter(f => f.endsWith('.css') && f !== 'custom.css')
  .map(f => f.replace('.css', ''));

async function takeScreenshot(page, name, customCSS = null, colorScheme = 'light') {
  console.log(`📸 Taking screenshot: ${name} (${colorScheme})...`);

  // Setze Color Scheme (light/dark)
  await page.emulateMedia({ colorScheme });

  // Injiziere Custom CSS falls vorhanden
  if (customCSS) {
    await page.addStyleTag({ content: customCSS });
  }

  // Warte bis Loading-Spinner verschwindet
  await page.waitForSelector('#loading', {
    state: 'hidden',
    timeout: 10000
  });

  // Warte bis CV-Content sichtbar ist
  await page.waitForSelector('#cv', {
    state: 'visible',
    timeout: 10000
  });

  // Zusätzliche Wartezeit für Animationen und Bilder
  await page.waitForTimeout(2000);

  // Screenshot erstellen
  const filename = `${HTML_DIR}/${name}.png`;
  await page.screenshot({
    path: filename,
    type: 'png'
  });

  console.log(`✅ Screenshot saved: ${filename}`);
}

(async () => {
  console.log('🚀 Starting screenshot generation...');
  console.log(`📋 Found ${themes.length} themes: ${themes.join(', ')}`);

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage({
    viewport: {
      width: SCREENSHOT_WIDTH,
      height: SCREENSHOT_HEIGHT
    }
  });

  console.log('📄 Loading page...');
  await page.goto('http://localhost:8000', {
    waitUntil: 'networkidle'
  });

  console.log('⏳ Waiting for initial content to load...');

  // 1. Default Screenshot (light mode, orange theme)
  await takeScreenshot(page, 'screenshot', null, 'light');

  // 2. Theme Screenshots
  for (const theme of themes) {
    const themePath = join(THEMES_DIR, `${theme}.css`);
    const themeCSS = readFileSync(themePath, 'utf-8');

    await page.reload({ waitUntil: 'networkidle' });
    await takeScreenshot(page, `screenshot-${theme}`, themeCSS, 'light');
  }

  console.log('✨ All screenshots generated successfully!');
  await browser.close();
})();
