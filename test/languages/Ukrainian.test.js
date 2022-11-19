import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import { Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { Ukrainian } = Languages;

describe('Ukrainian', () => {
  it('should map keywords', () => {
    deq(Ukrainian.translate('feature'), /^\s*(?:функція|функціонал|потреба|аспект|особливість|властивість)\s*:\s*(.*)/i);
    deq(Ukrainian.translate('background'), /^\s*(?:контекст)\s*:\s*(.*)/i);
    deq(Ukrainian.translate('scenario'), /^\s*(?:cценарій|шаблон)\s*:\s*(.*)/i);
    deq(Ukrainian.translate('examples'), /^\s*(?:приклади)\s*:\s*(.*)/i);
  });

  it('should report missing translations', () => {
    throws(() => Ukrainian.translate('missing'), { message: 'Ukrainian is missing a translation for the "missing" keyword - Please submit a pull request to https://github.com/acuminous/twiki-gherkish-feature-parser' });
  });
});
