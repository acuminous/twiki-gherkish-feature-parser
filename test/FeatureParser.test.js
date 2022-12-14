import * as fs from 'node:fs';
import * as path from 'node:path';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureParser, Languages } from '../index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('FeatureParser', () => {

  describe('Supported Languages', () => {

    it('should parse features in English by default', () => {
      assertFeature('languages', 'buck-rogers-season-one-en');
    });

    it('should parse features in Pirate', () => {
      assertFeature('languages', 'buck-rogers-season-one-bv', { language: Languages.Pirate });
    });
  });

  describe('Valid Variants', () => {
    listFeatures('variants').forEach(({ title, basename }) => {
      it(`should parse ${title}`, () => {
        assertFeature('variants', basename);
      });
    });
  });

  describe('Error handling', () => {
    listFeatures('invalid').forEach(({ title, basename }) => {
      it(`should report ${title}`, () => {
        assertParserError('invalid', basename);
      });
    });
  });

  describe('ASCII Art', () => {
    it('should parse ascii art', () => {
      assertFeature('ascii-art', 'buck-rogers-ascii-art');
    });
  });
});

function listFeatures(folder) {
  return fs.readdirSync(path.join('test', 'features', folder)).filter((filename) => path.extname(filename) === '.feature').map((filename) => {
    const basename = path.basename(filename, '.feature');
    const title = basename.replaceAll('-', ' ');
    return { title, basename };
  });
}

function assertFeature(folder, filename, options) {
  const expected = readJsonFile(folder, `${filename}.json`);
  const source = readTextFile(folder, `${filename}.feature`);
  const parser = new FeatureParser(options);
  const metadata = {
    source: {
      uri: getFilePath(folder, `${filename}.feature`),
    },
  };
  const actual = parser.parse(source, metadata);
  deq(actual, expected);
}

function assertParserError(folder, filename, options) {
  const message = readTextFile(folder, `${filename}.error`);
  const source = readTextFile(folder, `${filename}.feature`);
  const parser = new FeatureParser(options);
  const metadata = {
    source: {
      uri: getFilePath(folder, `${filename}.feature`),
    },
  };
  throws(() => parser.parse(source, metadata), (err) => {
    eq(err.message, message);
    return true;
  });
}

function readJsonFile(folder, filename) {
  const file = readTextFile(folder, filename);
  return JSON.parse(file);
}

function readTextFile(folder, filename) {
  const filepath = getFilePath(folder, filename);
  return fs.readFileSync(filepath, 'utf-8');
}

function getFilePath(folder, filename) {
  return path.join('test', 'features', folder, filename);
}
