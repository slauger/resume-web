#!/usr/bin/env node

/**
 * Screenshot Generator for resume-web
 *
 * Generates a screenshot of the resume for the README.md
 * Usage: npm run screenshot (or make screenshot)
 *
 * Prerequisites:
 * - Server must be running on http://localhost:8000
 * - Playwright must be installed (npm install)
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  url: 'http://localhost:8000',
  outputPath: join(__dirname, '..', 'example.png'),
  viewport: {
    width: 1920,
    height: 1080
  },
  fullPage: false, // Only capture above-the-fold for README
  timeout: 5000
};

async function generateScreenshot() {
  console.log('📸 Starting screenshot generation...');
  console.log(`   URL: ${config.url}`);
  console.log(`   Output: ${config.outputPath}`);
  console.log(`   Viewport: ${config.viewport.width}x${config.viewport.height}`);
  console.log('');

  let browser;
  try {
    // Launch browser
    console.log('🚀 Launching browser...');
    browser = await chromium.launch({
      headless: true
    });

    // Create page
    const page = await browser.newPage();
    await page.setViewportSize(config.viewport);

    // Navigate to page
    console.log('🌐 Loading page...');
    const response = await page.goto(config.url, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });

    if (!response || !response.ok()) {
      throw new Error(`Failed to load page: ${response?.status()} ${response?.statusText()}`);
    }

    // Wait for content to be fully rendered
    console.log('⏳ Waiting for content...');
    await page.waitForSelector('#cv', { timeout: config.timeout });

    // Wait for images to load
    await page.waitForLoadState('load');

    // Small delay to ensure animations/fonts are loaded
    await page.waitForTimeout(1000);

    // Take screenshot
    console.log('📷 Capturing screenshot...');
    await page.screenshot({
      path: config.outputPath,
      fullPage: config.fullPage,
      animations: 'disabled' // Disable animations for consistent screenshots
    });

    console.log('✅ Screenshot saved successfully!');
    console.log(`   Location: ${config.outputPath}`);

  } catch (error) {
    console.error('❌ Error generating screenshot:');
    console.error(`   ${error.message}`);

    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      console.error('');
      console.error('💡 Tip: Make sure the dev server is running:');
      console.error('   Run: make serve (or npm run serve)');
      console.error('   Then run this script again.');
    }

    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the screenshot generator
generateScreenshot();
