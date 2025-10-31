#!/usr/bin/env node

/**
 * Migration Script: Update client:load directives
 *
 * This script helps identify and suggest changes for React component hydration strategies.
 * Run with: node src/scripts/update-hydration.js
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import process from 'node:process';

// Components that should use client:idle (non-critical, below-the-fold)
const IDLE_COMPONENTS = [
  'AuthContainer',
  'GlobalToastProvider',
  'GlobalFCMProvider',
  'Footer',
  'MessagesContainer',
  'EditProfileView',
  'Dashboard',
  'ReservationView',
];

// Components that should use client:only (client-side only)
const ONLY_COMPONENTS = ['TimezoneBootstrap', 'AccountSection', 'EarningsView'];

// Components that should use client:visible (below-the-fold, lazy)
const VISIBLE_COMPONENTS = ['About', 'Reviews', 'SimilarListings'];

function findAstroFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        findAstroFiles(filePath, fileList);
      }
    } else if (file.endsWith('.astro')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function analyzeFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const suggestions = [];

  // Find all client:load directives
  const clientLoadRegex = /<(\w+)[^>]*\sclient:load[^>]*>/g;
  let match;

  while ((match = clientLoadRegex.exec(content)) !== null) {
    const componentName = match[1];
    const fullMatch = match[0];

    let suggestion = null;

    if (IDLE_COMPONENTS.some((comp) => fullMatch.includes(comp))) {
      suggestion = fullMatch.replace('client:load', 'client:idle');
    } else if (ONLY_COMPONENTS.some((comp) => fullMatch.includes(comp))) {
      suggestion = fullMatch.replace('client:load', 'client:only="react"');
    } else if (VISIBLE_COMPONENTS.some((comp) => fullMatch.includes(comp))) {
      suggestion = fullMatch.replace('client:load', 'client:visible');
    }

    if (suggestion) {
      suggestions.push({
        file: filePath,
        component: componentName,
        original: fullMatch,
        suggested: suggestion,
      });
    }
  }

  return suggestions;
}

function main() {
  console.log('🔍 Analyzing Astro files for hydration optimization...\n');

  const srcDir = join(process.cwd(), 'src');
  const astroFiles = findAstroFiles(srcDir);

  const allSuggestions = [];

  astroFiles.forEach((file) => {
    const suggestions = analyzeFile(file);
    if (suggestions.length > 0) {
      allSuggestions.push(...suggestions);
    }
  });

  if (allSuggestions.length === 0) {
    console.log('✅ No optimization suggestions found. Great job!');
    return;
  }

  console.log(`📊 Found ${allSuggestions.length} potential optimizations:\n`);

  allSuggestions.forEach((suggestion, index) => {
    console.log(`${index + 1}. ${suggestion.file}`);
    console.log(`   Component: ${suggestion.component}`);
    console.log(`   Current:   ${suggestion.original}`);
    console.log(`   Suggested: ${suggestion.suggested}\n`);
  });

  console.log('\n💡 Optimization Guide:');
  console.log('   • client:load  - Critical, above-the-fold content');
  console.log('   • client:idle  - Non-critical, can wait until browser idle');
  console.log(
    '   • client:visible - Below-the-fold, load when scrolled into view'
  );
  console.log('   • client:only  - Client-side only, no SSR\n');
}

main();
