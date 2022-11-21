import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import { Languages } from '../../lib/index.js';
import { MissingTranslationPullRequest } from '../../lib/Errors.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { Russian } = Languages;

describe('Russian', () => {
  it('should map keywords', () => {
    deq(Russian.translate('feature'), /^\s*(?:функция|функционал|свойство)\s*:\s*(.*)/i);
    deq(Russian.translate('background'), /^\s*(?:предыстория|контекст)\s*:\s*(.*)/i);
    deq(Russian.translate('scenario'), /^\s*(?:cценарий)\s*:\s*(.*)/i);
    deq(Russian.translate('examples'), /^\s*(?:Примеры)\s*:\s*(.*)/i);
  });

  it('should report missing translations', () => {
    throws(() => Russian.translate('missing'), (err) => {
      eq(err.code, MissingTranslationPullRequest.code);
      eq(err.message, 'Russian is missing a translation for the "missing" keyword - Please submit a pull request via https://github.com/acuminous/twiki-gherkish-feature-parser/pulls');
      return true;
    });
  });
});
