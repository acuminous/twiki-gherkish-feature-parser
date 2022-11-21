import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import { Languages } from '../../lib/index.js';
import { MissingTranslationPullRequest } from '../../lib/Errors.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { English } = Languages;

describe('English', () => {
  it('should map keywords', () => {
    deq(English.translate('feature'), /^\s*(?:feature)\s*:\s*(.*)/i);
    deq(English.translate('background'), /^\s*(?:background)\s*:\s*(.*)/i);
    deq(English.translate('rule'), /^\s*(?:rule)\s*:\s*(.*)/i);
    deq(English.translate('scenario'), /^\s*(?:scenario)\s*:\s*(.*)/i);
    deq(English.translate('examples'), /^\s*(?:examples|where)\s*:\s*(.*)/i);
  });

  it('should report missing translations', () => {
    throws(() => English.translate('missing'), (err) => {
      eq(err.code, MissingTranslationPullRequest.code);
      eq(err.message, 'English is missing a translation for the "missing" keyword - Please submit a pull request via https://github.com/acuminous/twiki-gherkish-feature-parser/pulls');
      return true;
    });
  });
});
