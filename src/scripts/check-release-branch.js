#!/usr/bin/env node

/**
 * Check if the current branch is 'main' before allowing a release.
 * This prevents accidental version bumps from feature branches.
 */

import { execSync } from 'child_process';
import process from 'process';

try {
  const currentBranch = execSync('git branch --show-current', {
    encoding: 'utf-8',
  }).trim();

  if (currentBranch !== 'main') {
    console.error(
      '\n❌ Error: Releases can only be created from the "main" branch.'
    );
    console.error(`   Current branch: "${currentBranch}"\n`);
    console.error(
      '   Please checkout to main before running a release command.\n'
    );
    process.exit(1);
  }

  console.log('✓ Branch check passed: on main branch');
} catch (error) {
  console.error('\n❌ Error: Could not determine current branch.');
  console.error(`   ${error.message}\n`);
  process.exit(1);
}
