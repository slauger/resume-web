#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Validates html/cv.json against cv-schema.json and, in i18n mode,
// every html/cv/<lang>.json against cv-content-schema.json.
// allErrors is intended: all problems are reported in one run. The
// validated files are part of the repository, not untrusted input.
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const readJson = (path) => JSON.parse(readFileSync(path, 'utf-8'));
const validators = new Map();

function validateFile(schemaPath, dataPath) {
  if (!validators.has(schemaPath)) validators.set(schemaPath, ajv.compile(readJson(schemaPath)));
  const validate = validators.get(schemaPath);
  if (validate(readJson(dataPath))) {
    console.log(`✅ ${dataPath} is valid`);
    return true;
  }
  console.error(`❌ ${dataPath} validation failed:`);
  validate.errors.forEach(err => {
    console.error(`  - ${err.instancePath || '(root)'}: ${err.message}`);
  });
  return false;
}

try {
  let valid = validateFile('./cv-schema.json', './html/cv.json');

  const contentDir = './html/cv';
  if (existsSync(contentDir)) {
    for (const file of readdirSync(contentDir).filter(f => f.endsWith('.json')).sort()) {
      valid = validateFile('./cv-content-schema.json', join(contentDir, file)) && valid;
    }
  }

  process.exit(valid ? 0 : 1);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
