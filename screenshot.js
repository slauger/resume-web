/**
 * Screenshot Generator für resume-web
 *
 * Erstellt einen automatischen Screenshot der Webseite für die README.
 * Wird in GitHub Actions während des Deployments ausgeführt.
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting screenshot generation...');

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage({
    viewport: {
      width: 1400,
      height: 900
    }
  });

  console.log('📄 Loading page...');
  await page.goto('http://localhost:8000', {
    waitUntil: 'networkidle'
  });

  console.log('⏳ Waiting for content to load...');

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
  console.log('✨ Waiting for animations...');
  await page.waitForTimeout(2000);

  console.log('📸 Taking screenshot...');
  await page.screenshot({
    path: 'html/screenshot.png',
    type: 'png'
  });

  console.log('✅ Screenshot saved to html/screenshot.png');

  await browser.close();
})();
