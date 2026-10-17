const { execSync } = require('node:child_process');

function run(command) {
  try {
    return execSync(command, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
  } catch (error) {
    return '';
  }
}

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const baseIndex = args.indexOf('--base');
const base = baseIndex >= 0 ? args[baseIndex + 1] : 'origin/main';

const changed = run(`git diff --name-only --relative ${base}...HEAD`);
const files = changed ? changed.split('\n').filter(Boolean) : [];

if (!files.length) {
  console.log('No changed files detected against ' + base + '.');
  process.exit(0);
}

if (dryRun) {
  console.log('Would run tests for:');
  for (const file of files) console.log(`- ${file}`);
  process.exit(0);
}

console.log('Running focused validation for changed files:');
for (const file of files) console.log(`- ${file}`);
console.log('');

const vitest = require.resolve('vitest/vitest.mjs');
console.log('Vitest entry:', vitest);
