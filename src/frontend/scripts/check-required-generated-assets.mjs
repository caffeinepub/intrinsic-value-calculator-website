#!/usr/bin/env node

/**
 * Prebuild check script to verify required generated assets exist.
 * Exits with non-zero status if any required assets are missing.
 */

import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define required generated assets relative to frontend/public
const REQUIRED_ASSETS = [
  'assets/generated/ivc-hero.dim_1600x900.png',
  'assets/generated/ivc-icon.dim_512x512.png',
];

// Resolve paths relative to frontend/public directory
const publicDir = join(__dirname, '..', 'public');

console.log('🔍 Checking for required generated assets...\n');

const missingAssets = [];

for (const assetPath of REQUIRED_ASSETS) {
  const fullPath = join(publicDir, assetPath);
  const exists = existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ Found: ${assetPath}`);
  } else {
    console.log(`❌ Missing: ${assetPath}`);
    missingAssets.push(assetPath);
  }
}

console.log('');

if (missingAssets.length > 0) {
  console.error('❌ ERROR: Required generated assets are missing!\n');
  console.error('The following files must exist before building:\n');
  missingAssets.forEach(asset => {
    console.error(`  - frontend/public/${asset}`);
  });
  console.error('\nPlease ensure all required generated assets are present in the repository.');
  console.error('These assets should be generated during the build preparation phase.\n');
  process.exit(1);
}

console.log('✅ All required generated assets are present!\n');
process.exit(0);

