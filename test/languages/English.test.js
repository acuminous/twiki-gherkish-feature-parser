import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { English } = Languages;

describe('English', () => {
  it('should answer to name', () => {
    eq(English.answersToName('English'), true);
    eq(English.answersToName('english'), true);
    eq(English.answersToName('other'), false);
  });

  it('should have answer to code', () => {
    eq(English.answersToCode('en'), true);
    eq(English.answersToCode('EN'), true);
    eq(English.answersToCode(null), false);
    eq(English.answersToCode(undefined), false);
    eq(English.answersToCode(''), false);
    eq(English.answersToCode('other'), false);
  });
});
