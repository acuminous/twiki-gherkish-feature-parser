import * as fs from 'node:fs';
import * as path from 'node:path';
import { deepStrictEqual as deq } from 'node:assert';
import zunit from 'zunit';
import { FeatureParser, Languages } from '../index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('FeatureParser', () => {
  it('should parse features without a language by default', () => {
    const expected = readJsonFile('en', 'buck-rogers-season-one-ungeneralised.json');
    const source = readFeatureFile('en', 'buck-rogers-season-one.feature');
    const parser = new FeatureParser();
    const actual = parser.parse(source);

    deq(actual, expected);
  });

  it('should parse features in English', () => {
    const expected = readJsonFile('en', 'buck-rogers-season-one-generalised.json');
    const source = readFeatureFile('en', 'buck-rogers-season-one.feature');
    const parser = new FeatureParser({ language: Languages.English });
    const actual = parser.parse(source);

    deq(actual, expected);
  });

  it('should parse features in Pirate', () => {
    const expected = readJsonFile('bv', 'buck-rogers-season-one-generalised.json');
    const source = readFeatureFile('bv', 'buck-rogers-season-one.feature');
    const parser = new FeatureParser({ language: Languages.Pirate });
    const actual = parser.parse(source);

    deq(actual, expected);
  });

});

function readFeatureFile(countryCode, filename) {
  const filepath = path.join('test', 'features', countryCode, filename);
  return fs.readFileSync(filepath, 'utf-8');
}

function readJsonFile(countryCode, filename) {
  const file = readFeatureFile(countryCode, filename);
  return JSON.parse(file);
}
