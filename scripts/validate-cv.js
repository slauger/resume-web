#!/usr/bin/env node
import { readFileSync } from 'fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

try {
  const schema = JSON.parse(readFileSync('./cv-schema.json', 'utf-8'));
  const cv = JSON.parse(readFileSync('./html/cv.json', 'utf-8'));

  const validate = ajv.compile(schema);
  const valid = validate(cv);

  if (valid) {
    console.log('✅ cv.json is valid!');
    process.exit(0);
  } else {
    console.error('❌ cv.json validation failed:');
    validate.errors.forEach(err => {
      console.error(`  - ${err.instancePath || '(root)'}: ${err.message}`);
    });
    process.exit(1);
  }
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
