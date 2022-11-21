import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import { Languages } from '../../lib/index.js';
import { MissingTranslationPullRequest } from '../../lib/Errors.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { Portugeuse } = Languages;

describe('Portugeuse', () => {
  it('should map keywords', () => {
    deq(Portugeuse.translate('feature'), /^\s*(?:funcionalidade|característica|caracteristica)\s*:\s*(.*)/i);
    deq(Portugeuse.translate('background'), /^\s*(?:fundo)\s*:\s*(.*)/i);
    deq(Portugeuse.translate('scenario'), /^\s*(?:cenário|cenario)\s*:\s*(.*)/i);
    deq(Portugeuse.translate('examples'), /^\s*(?:exemplos|exemplo)\s*:\s*(.*)/i);
  });

  it('should report missing translations', () => {
    throws(() => Portugeuse.translate('missing'), (err) => {
      eq(err.code, MissingTranslationPullRequest.code);
      eq(err.message, 'Portugeuse is missing a translation for the "missing" keyword - Please submit a pull request via https://github.com/acuminous/twiki-gherkish-feature-parser/pulls');
      return true;
    });
  });
});
