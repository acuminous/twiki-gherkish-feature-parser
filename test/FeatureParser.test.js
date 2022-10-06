import * as fs from 'node:fs';
import * as path from 'node:path';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureParser, Languages } from '../index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('FeatureParser', () => {
  it('should parse features in English by default', () => {
    const expected = readJsonFile('en', 'buck-rogers-season-one.json');
    const source = readFeatureFile('en', 'buck-rogers-season-one.feature');
    const parser = new FeatureParser();
    const actual = parser.parse(source);

    deq(actual, expected);
  });

  it('should parse features in Pirate', () => {
    const expected = readJsonFile('bv', 'buck-rogers-season-one.json');
    const source = readFeatureFile('bv', 'buck-rogers-season-one.feature');
    const parser = new FeatureParser({ language: Languages.Pirate });
    const actual = parser.parse(source);

    deq(actual, expected);
  });

  it('should parse minimal features', () => {
    const expected = readJsonFile('en', 'minimal.json');
    const source = readFeatureFile('en', 'minimal.feature');
    const parser = new FeatureParser();
    const actual = parser.parse(source);

    deq(actual, expected);
  });

  it('should parse docstrings', () => {
    const expected = readJsonFile('en', 'docstrings.json');
    const source = readFeatureFile('en', 'docstrings.feature');
    const parser = new FeatureParser();
    const actual = parser.parse(source);

    deq(actual, expected);
  });

  it('should report parse errors', () => {
    const metadata = {
      source: {
        uri: 'invalid.feature',
      },
    };
    const source = readFeatureFile('en', 'invalid.feature');
    const parser = new FeatureParser();
    const expectedEvents = [
      ' - an annotation',
      ' - a blank line',
      ' - a block comment',
      ' - a single line comment',
      ' - a step',
    ].join('\n');

    throws(() => {
      parser.parse(source, metadata);
    }, { message: `I did not expect the end of the feature at invalid.feature:11\nInstead, I expected one of:\n${expectedEvents}\n` });
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
