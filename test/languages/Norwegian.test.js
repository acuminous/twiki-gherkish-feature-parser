import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import { Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { Norwegian } = Languages;

describe('Norwegian', () => {
  it('should map keywords', () => {
    deq(Norwegian.translate('feature'), /^\s*(?:egenskap)\s*:\s*(.*)/i);
    deq(Norwegian.translate('background'), /^\s*(?:bakgrunn)\s*:\s*(.*)/i);
    deq(Norwegian.translate('scenario'), /^\s*(?:scenario)\s*:\s*(.*)/i);
    deq(Norwegian.translate('examples'), /^\s*(?:eksempler)\s*:\s*(.*)/i);
  });

  it('should report missing translations', () => {
    throws(() => Norwegian.translate('missing'), { message: 'Norwegian is missing a translation for the "missing" keyword - Please submit a pull request to https://github.com/acuminous/twiki-gherkish-feature-parser' });
  });
});
