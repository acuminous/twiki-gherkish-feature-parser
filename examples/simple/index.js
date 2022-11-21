/* eslint no-console: 0 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';
import { strictEqual as eq } from 'node:assert';
import { FeatureParser } from '../../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path = join(__dirname, 'buck-rogers.feature');

const featureFile = readFileSync(path, 'utf-8');
const parser = new FeatureParser();
const metadata = {
  source: {
    uri: path,
  },
};

console.log(`Running ${__filename}`);
const feature = parser.parse(featureFile, metadata);
eq(feature.title, 'Buck Rogers');
console.log('OK');
