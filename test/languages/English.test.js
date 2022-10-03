import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { English } = Languages;

describe('English', () => {
  it('should map keywords', () => {
    deq(English.regexp('feature'), /^\s*(?:feature)\s*:\s*(.*)/i);
    deq(English.regexp('background'), /^\s*(?:background)\s*:\s*(.*)/i);
    deq(English.regexp('scenario'), /^\s*(?:scenario)\s*:\s*(.*)/i);
  });
});
