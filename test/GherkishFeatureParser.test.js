import * as fs from 'node:fs';
import * as path from 'node:path';
import { deepStrictEqual as deq } from 'node:assert';
import zunit from 'zunit';
import GherkishFeatureParser from '../index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('FeatureParser', () => {
  it('should parse English by default', () => {
    const file = readFeatureFile('buck-rogers-season-one.feature');
    const parser = new GherkishFeatureParser();
    const actual = parser.parse(file);
    const expected = readJsonFile('buck-rogers-season-one.json');

    deq(actual, expected);
  });
});

function readFeatureFile(filename) {
  const filepath = path.join('test', 'specifications', 'en', filename);
  return fs.readFileSync(filepath, 'utf-8');
}

function readJsonFile(filename) {
  const file = readFeatureFile(filename);
  return JSON.parse(file);
}
