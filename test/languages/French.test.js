import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import { Languages } from '../../lib/index.js';
import { MissingTranslationPullRequest } from '../../lib/Errors.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { French } = Languages;

describe('French', () => {
  it('should map keywords', () => {
    deq(French.translate('feature'), /^\s*(?:fonctionnalité)\s*:\s*(.*)/i);
    deq(French.translate('background'), /^\s*(?:contexte)\s*:\s*(.*)/i);
    deq(French.translate('scenario'), /^\s*(?:scénario)\s*:\s*(.*)/i);
    deq(French.translate('examples'), /^\s*(?:exemples|exemple|ouù)\s*:\s*(.*)/i);
  });

  it('should report missing translations', () => {
    throws(() => French.translate('missing'), (err) => {
      eq(err.code, MissingTranslationPullRequest.code);
      eq(err.message, 'French is missing a translation for the "missing" keyword - Please submit a pull request via https://github.com/acuminous/twiki-gherkish-feature-parser/pulls');
      return true;
    });
  });
});
