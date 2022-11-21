import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import { Languages } from '../../lib/index.js';
import { MissingTranslationPullRequest } from '../../lib/Errors.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { Dutch } = Languages;

describe('Dutch', () => {
  it('should map keywords', () => {
    deq(Dutch.translate('feature'), /^\s*(?:functionaliteit|eigenschap)\s*:\s*(.*)/i);
    deq(Dutch.translate('background'), /^\s*(?:achtergrond)\s*:\s*(.*)/i);
    deq(Dutch.translate('scenario'), /^\s*(?:geval)\s*:\s*(.*)/i);
    deq(Dutch.translate('examples'), /^\s*(?:voorbeelden)\s*:\s*(.*)/i);
  });

  it('should report missing translations', () => {
    throws(() => Dutch.translate('missing'), (err) => {
      eq(err.code, MissingTranslationPullRequest.code);
      eq(err.message, 'Dutch is missing a translation for the "missing" keyword - Please submit a pull request via https://github.com/acuminous/twiki-gherkish-feature-parser/pulls');
      return true;
    });
  });
});
