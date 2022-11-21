import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import { Languages } from '../../lib/index.js';
import { MissingTranslationPullRequest } from '../../lib/Errors.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { Pirate } = Languages;

describe('Pirate', () => {
  it('should map keywords', () => {
    deq(Pirate.translate('feature'), /^\s*(?:tale|yarn)\s*:\s*(.*)/i);
    deq(Pirate.translate('background'), /^\s*(?:lore)\s*:\s*(.*)/i);
    deq(Pirate.translate('rule'), /^\s*(?:guideline)\s*:\s*(.*)/i);
    deq(Pirate.translate('scenario'), /^\s*(?:adventure|sortie)\s*:\s*(.*)/i);
    deq(Pirate.translate('examples'), /^\s*(?:wherest)\s*:\s*(.*)/i);
  });

  it('should report missing translations', () => {
    throws(() => Pirate.translate('missing'), (err) => {
      eq(err.code, MissingTranslationPullRequest.code);
      eq(err.message, 'Pirate is missing a translation for the "missing" keyword - Please submit a pull request via https://github.com/acuminous/twiki-gherkish-feature-parser/pulls');
      return true;
    });
  });
});
